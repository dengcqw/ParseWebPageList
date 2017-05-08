var siteQueryMap = require('./site.queryMap.js')
var urlConfig = require('../sites').urlConfig

var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
var urlToUrlID = require('./urlToUrlID.js');

var models = require('../models')

const phantom = require('phantom');

const loadWebPage = async function(pageURL) {
  const instance = await phantom.create();
  const page = await instance.createPage();

  const status = await page.open(pageURL);
  //console.log(status);

  const content = await page.property('content');

  await instance.exit();

  return content;
}

/*
 * 9个site，各3个category
 * 需要加载27个页面
 * 每个页面需要超时重试
 */
const captureList = ({siteID, categoryID, url})=> () => {
  console.log("fetching: ", siteID, categoryID, url);
  let startTime = Date.now();

  let queryFn = siteQueryMap[siteID];
  if (queryFn == undefined) {
    reject(new Error('fetch error: ', siteID, url));
  }

  return loadWebPage(url)
    .then(html=>queryFn(cheerio.load(html)))
    .then(hotItems=>{
      console.log("fetched: ", siteID, categoryID, url, hotItems.length);
      hotItems = hotItems || []

      // 如果是bilibili不删除警号后的数据
      let partStrs = (siteID == 'bilibili')?['?']:['?','#'];
      hotItems = hotItems.map(function(item) {
        return Object.assign({}, item, {urlID: urlToUrlID(item.url, partStrs)});
      });

      var elapsedTime = Date.now() - startTime;
      return {siteID, categoryID, result: {hotItems, elapsedTime, url}}; // <-- category data object
    })
}

const promiseRetry = (getPromise, retryCount, interval) =>  new Promise(function(resolve, reject) {
  let timeout = (ms) => new Promise((resolve, reject) => {
    ms = ms || 1000 * 60 * 2;// 120s
    setTimeout(reject, ms, new Error(`fetch timeout ${ms} ms`))
  })
  let retryWrapper = () => {
    Promise.race([timeout(interval), getPromise()])
      .then(function(hotList) {
        resolve(hotList)
      })
      .catch(err => {
        retryCount--;
        if (retryCount == 0) {
          reject(err)
        } else {
          retryWrapper()
        }
      })
  }
  retryWrapper()
})

const getAllListInfo = () => {
  return _.map(urlConfig, (urls, siteID) => {
    return _.map(urls, (url, categoryID) => {
      return {siteID, categoryID, url}
    })
  }).reduce(function(reducedValue, siteJobs) {
    siteJobs.forEach(job => reducedValue.push(job))
    return reducedValue
  }, [])
}

function CaptureQueue() {
  this.queue = [/* {hotList:{siteID, catrgoryID, url}, callback:(list, err)=>{}} */]
  this.running = false
  this.outputDir = undefined
  this.locked = false /* lock capture all */
}

CaptureQueue.prototype._run = function() {
  if (this.running == true) {
    return
  }

  let job = this.queue.shift()
  if (job) {
    this.running = true
    console.log("----> start capture job: ", JSON.stringify(job.listInfo))
    console.log("----> remain capture jobs: ", this.queue.length)
    promiseRetry(captureList(job.listInfo), 3, 5000)
      .then((hotList)=>{
        console.log("----> get hot list: ", job.listInfo.siteID, job.listInfo.categoryID)
        this.saveToFile(job.listInfo, hotList)
        this.updateDatabase(job.listInfo, hotList)

        job.callback(hotList)
        this.running = false
        this._run()
      })
      .catch((err)=>{
        console.log("----> get hot list err: ", job.listInfo.siteID, job.listInfo.categoryID)
        console.log("----> get hot list err: ", err)
        job.callback(null, err)
        this.running = false
        this._run()
      })
  } else {
    this.running = false
    console.log("----> capture queue is empty; stop running")
  }
}

CaptureQueue.prototype.updateDatabase = function(listInfo, hotList) {
  var urlIds = items => items.map((item)=>item.urlID)

  var updateObj = {[hotList.categoryID] :  urlIds(hotList.result.hotItems)}
  var date = models.createDateKey() // like 2017-04-30

  console.log("----> enqueue update db: ", hotList.siteID, hotList.categoryID, date)
  models.updateQueue.enqueue(() => {
    return (
      models.getSiteModel(listInfo.siteID)
      .findOrCreate({where: {date}, defaults: updateObj})
      .spread(function(siteModel, created) {
        console.log("----> update siteModel database created: ", created)
        if (created == false) return siteModel.update(updateObj)
        console.log(siteModel.get({plain: true}))
      })
    )
  })
  hotList.result.hotItems.forEach(item => {
    let urlid = item.urlID
    let updateObj = {capturedurl: item.url, title: item.title}
    let query = {
      where: {urlid},
      defaults: updateObj
    }
    models.updateQueue.enqueue(() => {
      return (
        models.Album.findOrCreate(query)
        .spread(function(album, created) {
          console.log("----> update album database created: ", created)
          // NOTE: this data need not updated again
          // if (created == false) return album.update(updateObj)
          console.log(album.get({plain: true}))
        })
      )
    })
  })
}

CaptureQueue.prototype.saveToFile = function(listInfo, hotList) {
  if (this.outputDir) {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }
    fs.writeFile(this.outputDir+'/'+listInfo.siteID+'.'+listInfo.categoryID+'.json', JSON.stringify(hotList), (err)=> {
      if (err) throw err
      console.log(`save ${listInfo.siteID} ${listInfo.categoryID} hotList to ${this.outputDir}`)
    })
  }
}

CaptureQueue.prototype.captureList = function(listInfo, callback) {
  this.queue.push({listInfo, callback})
  this._run()
}

CaptureQueue.prototype.captureAll = function(callback) {
  if (this.locked == true) throw new Error('capture is locked ,can not start capture all again')
  this.locked = true

  let allList = {}

  let jobs = getAllListInfo().map(listInfo => {
    return {
      listInfo: listInfo,
      callback: (list, err) => {
        if (list) {
          let siteID = list.siteID;
          if (!allList[siteID]) allList[siteID] = {}
          allList[siteID][list.categoryID] = Object.assign({}, list.result.hotItems.map(item=>item.urlID))
        }

        listCount--;
        if (listCount == 0) {
          callback(allList)
          this.locked = false
        }
      }
    }
  })
  let listCount = jobs.length

  models.updateQueue.enqueue(() => {
    let date = models.createDateKey()
    let query = {
      where: {date}
    }
    return (
      models.CaptureInfo.findOrCreate(query)
      .spread(function(captureModel, created) {
        console.log("----> update capture database created: ", created)
        console.log(captureModel.get({plain: true}))
      })
    )
  })

  this.queue =  this.queue.concat(jobs)
  console.log("----> start capture all total:", jobs.length)
  this._run()
}


module.exports = CaptureQueue

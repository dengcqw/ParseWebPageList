var siteQueryMap = require('./site.queryMap.js')
var urlConfig = require('../sites').urlConfig

var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
var urlToUrlID = require('./urlToUrlID.js');

var models = require('../models')

const loadWebPage = require('./loadWebpage.js')

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
    throw new Error('query fn undefined: ', siteID)
  }

  let delay = siteID == "acfun" ? 3000 : 100

  // TODO: timeout trigger but promise not cancel, so log will print later
  return loadWebPage(url, delay)
    .then(html=>queryFn(cheerio.load(html)))
    .then(hotItems=>{ // hotItmes keep properties same wtih model definition
      console.log("fetched: ", siteID, categoryID, url, hotItems.length);
      if (hotItems.length == 0) {
        throw new Error('fetched empty hotlist')
      }
      // 如果是bilibili不删除井号后的数据
      let partStrs = (siteID == 'bilibili')?['?']:['?','#']
      hotItems.forEach(function(item) {
        console.log("----> make urlid: ", item)
        item.urlid = urlToUrlID(item.capturedurl, partStrs)
      })

      var elapsedTime = Date.now() - startTime
      return {siteID, categoryID, result: {hotItems, elapsedTime, url}}; // <-- category data object
    })
}

const promiseRetry = (getPromise, retryCount, interval) =>  new Promise(function(resolve, reject) {
  let timeout = (ms) => new Promise((resolve, reject) => {
    ms = ms || 1000 * 20
    setTimeout(reject, ms, new Error(`fetch timeout ${ms} ms`))
  })
  let retryWrapper = () => {
    Promise.race([timeout(interval), getPromise()])
      .then(function(hotList) {
        console.log("----> capture race promise get list")
        resolve(hotList)
      })
      .catch(err => {
        retryCount--;
        if (retryCount == 0) {
          reject(err)
        } else {
          console.log("----> capture race promise error", err)
          setTimeout(retryWrapper, 200)
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
    //console.log("----> remain capture jobs: ", this.queue.length)
    promiseRetry(captureList(job.listInfo), 5, job.timeout)
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
  var urlIds = items => items.map(item => item.urlid)

  var updateObj = {[hotList.categoryID] : urlIds(hotList.result.hotItems)}
  var date = models.createDateKey() // like 2017-04-30

  console.log("----> enqueue update db: ", hotList.siteID, hotList.categoryID, date)
  models.updateQueue.enqueue(() => { // update or create site model with urlIds
    return (
      models.getSiteModel(listInfo.siteID)
      .findOrCreate({where: {date}})
      .spread(function(siteModel, created) {
        console.log("----> update siteModel database created: ", created)
        console.log("----> update siteModel urlIds count: ", hotList.siteID, hotList.categoryID, urlIds.length)
        return siteModel.update(updateObj)
      })
    )
  })
  hotList.result.hotItems.forEach(item => { // update or create albums model with hot list
    let urlid = item.urlid
    let query = {where: {urlid}}
    models.updateQueue.enqueue(() => {
      return (
        models.Album.findOrCreate(query)
        .spread(function(album, created) {
          console.log("----> update album database created: ", created, item.title)
          return album.update(item)
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
  let timeout = listInfo.siteID == 'acfun' ? 10000 : 10000
  this.queue.push({listInfo, callback, timeout})
  this._run()
}

CaptureQueue.prototype.captureAll = function(callback) {
  if (this.locked == true) throw new Error('capture is locked ,can not start capture all again')
  this.locked = true

  let allList = {}

  let jobs = getAllListInfo().map(listInfo => {
    return {
      listInfo: listInfo,
      timeout: (listInfo.siteID == 'acfun' ? 10000 : 10000),
      callback: (list, err) => {
        if (list) {
          let siteID = list.siteID;
          if (!allList[siteID]) allList[siteID] = {}
          allList[siteID][list.categoryID] = Object.assign({}, list.result.hotItems.map(item=>item.urlid))
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

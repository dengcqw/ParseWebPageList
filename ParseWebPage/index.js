
var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
const md5Hex = require('md5-hex');

var urlConfig = require('./urlConfig.json');
var siteMgr = require('./site.manager.js');
var loadWebPage = require('./loadWebPage.js'); // Promise

var startTime;

function urlToDocID(url, partStrs/* strs to delete */) {
  function deleteStr(origStr, partStr) {
    if (typeof origStr == 'string' && typeof partStr == 'string') {
      if (origStr.indexOf(partStr) != -1) {
        return origStr.slice(0, origStr.indexOf(partStr));
      } else {
        return origStr;
      }
    }
  }

  partStrs = partStrs || ['?', '#'];
  console.log("----> "+url);
  url = partStrs.reduce(deleteStr, url);
  console.log("----> "+url);
  return md5Hex(url);
}

// wrap url-fetch and html-parse for Promise.all
function wrapCategory(urls, queryFn, siteID) {

  var categoryWrappers = _.map(urls, (url, categoryID)=>{

    console.log("fetching: " + categoryID +' url: ' + url);

    return loadWebPage(url)
      .then(html=>queryFn(cheerio.load(html)))
      .then(hotItems=>{

        console.log('fetched: '+url+ ' length: ' + hotItems.length);

        // 如果是bilibili不删除警号后的数据
        let partStrs = (siteID == 'bilibili')?['?']:['?','#'];
        hotItems = hotItems.map(function(item) {
          return Object.assign({}, item, {docID: urlToDocID(item.url, partStrs)});
        });

        var elapsedTime = Date.now() - startTime;
        return {[categoryID]: {hotItems, elapsedTime}}; // <-- category data object
      })
      .catch((err)=>console.log(err));
  });

  return Promise.all(categoryWrappers);
}

function start() {
  startTime = Date.now();

  var siteWrappers = _.map(urlConfig, (urls, siteID)=>{
    var queryFn = siteMgr.queryMap[siteID];
    if (queryFn == undefined) {
      console.log(key + ' not define query function');
      throw new Error('fetch error: ' + siteID + ' ' + JSON.stringify(urls));
    }

    return wrapCategory(urls, queryFn, siteID).then(results=>{
      console.log('fetch success for : ' + siteID);
      if (this.outputPath) {
        fs.writeFile(this.latestPath+'/'+siteID+'.json', JSON.stringify(results), (err)=> {
          if (err) throw err;
          console.log(`fetch ${siteID} data save to ${this.latestPath}`);
        });
      }
      return {[siteID]: results};  // <-- site data object
    });
  });

  return Promise.all(siteWrappers).then(results=>{
    console.log('fetch all done')
    if (this.outputPath) {
      var date = new Date();
      var fileName = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay()+'-'+date.getHours()+'-'+date.getMinutes()+'.json';
      fs.writeFile(this.outputPath+'/'+fileName, JSON.stringify(results), (err) => {
        if (err) throw err;
        console.log('fetch data save to ' + this.outputPath);
      });
    }
    return results;
  });
}

function ParseWebPageList(outputPath) {
  this.outputPath = outputPath;
  this.latestPath = outputPath + '/latest';
  if ( ! fs.existsSync(this.outputPath)) {
    fs.mkdirSync(this.outputPath);
  }
  if ( ! fs.existsSync(this.latestPath)) {
    fs.mkdirSync(this.latestPath);
  }
}

function getFileNames(callback) {
  let path = this.outputPath;
  let jsonFiles = [];
  console.log("----> output path:"+path);
  fs.readdir(path, (err, files)=> {
    files.forEach((file)=>{
      if (file.startsWith('.')) return;
      var subpath = path + '/' + file;
      if(fs.lstatSync(subpath).isDirectory()){
        return;
      } else {
        jsonFiles.push(file);
      }
    });
    callback && callback(jsonFiles.sort().reverse());
  });
}

function getContent(fileName, callback) {
  let path = this.outputPath + '/' + fileName;
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    callback(data);
  });
}

ParseWebPageList.prototype.start = start;
ParseWebPageList.prototype.getFileNames = getFileNames;
ParseWebPageList.prototype.getContent = getContent;

module.exports = ParseWebPageList;

//var docid = urlToDocID("http://tv.sohu.com/20170228/n481998621.shtml?fid=678&pvid=4d4db6d26aa0a4ec#homt");
//console.log("----> "+docid);

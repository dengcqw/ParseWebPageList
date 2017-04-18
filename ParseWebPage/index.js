
var _ = require('lodash');
var fs = require('fs');

var urlConfig = require('./urlConfig-test.json');
var siteMgr = require('./site.manager.js');
var loadWebPage = require('./loadWebPage.js'); // Promise

var startTime;

// wrap url-fetch and html-parse for Promise.all
function wrapCategory(urls, queryFn) {

  var categoryWrappers = _.map(urls, (url, categoryID)=>{

    console.log("fetching: " + categoryID +' url: ' + url);

    return loadWebPage(url)
      .then(html=>siteMgr.parseTitleAndURL(queryFn, html))
      .then(hotItems=>{

        console.log('fetched: '+url+ ' length: ' + hotItems.length);

        var elapsedTime = Date.now() - startTime;

        return {categoryID, hotItems, elapsedTime}; // <-- category data object
      });
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

    return wrapCategory(urls, queryFn).then(results=>{
      console.log('fetch success for : ' + siteID);
      return {results, siteID};  // <-- site data object
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
}

ParseWebPageList.prototype.start = start;

module.exports = ParseWebPageList;

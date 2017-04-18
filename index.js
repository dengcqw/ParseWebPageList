
var _ = require('lodash');

var urlConfig = require('./urlConfig-test.json');
var siteMgr = require('./site.manager.js');
var loadWebPage = require('./loadWebPage.js'); // Promise


function start() {
  var startTime = Date.now();

  _.forEach(urlConfig, (urls, siteID)=>{
    var queryFn = siteMgr.queryMap[siteID];
    if (queryFn == undefined) {
      console.log(key + ' not define query function');
      return;
    }

    // wrap url-fetch and html-parse for Promise.all
    var transformWrappers = _.map(urls, (url, categoryID)=>{

      console.log("----> start fetch:" + siteID + '  ' + categoryID +'  ' + url);

      return loadWebPage(url)
        .then(html=>siteMgr.parseTitleAndURL(queryFn, html))
        .then(hotList=>{

          console.log('Get hot list of '+siteID+' '+categoryID+ ' length: ' + hotList.items.length);

          let cloneItem = Object.assign({}, hotList);
          cloneItem.siteID = siteID;
          cloneItem.categoryID = categoryID;
          cloneItem.time = Date.now() - startTime;
          return hotList;
        });
    });

    Promise.all(transformWrappers).then((results)=>{
      console.log(JSON.stringify(results));
    });
  });
}

function ParseWebPageList(outputPath) {
  this.outputPath = outputPath;
}

module.exports = ParseWebPageList;


var _ = require('lodash');

var urlConfig = require('./urlConfig-test.json');
var siteMgr = require('./site.manager.js');
var loadWebPage = require('./loadWebPage.js'); // Promise


_.forEach(urlConfig, (urls, siteID)=>{
  var queryFn = siteMgr.queryMap[siteID];
  if (queryFn == undefined) {
    console.log(key + ' not define query function');
    return;
  }
  _.forEach(urls, (url, categoryID)=>{
    console.log("----> start fetch:" + siteID + '  ' + categoryID +'  ' + url);
    loadWebPage(url)
    .then(html=>siteMgr.parseTitleAndURL(queryFn, html))
    .then(hotList=>{
      console.log('Get hot list of '+siteID+' '+categoryID+ ' length: ' + hotList.items.length);
      let cloneItem = Object.assign({}, hotList);
      cloneItem.siteID = siteID;
      cloneItem.categoryID = categoryID;
      //console.log(cloneItem);
    });
  });
});

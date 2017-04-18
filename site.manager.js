
var siteIds = require('./site.id.js').siteIds;
const cheerio = require('cheerio');

var queryMap = (function () {
  var queryMap = {};
  queryMap[siteIds.iqiyi] =    function($) {
    return $('.topDetails-list>li').find('h2>a[title]');
  };
  queryMap[siteIds.acfun] =    function($) {
    return $('.title');
  };
  queryMap[siteIds.bilibili] = function($) {
    return $('.title').parent();
  };
  queryMap[siteIds.mgtv] =     function($) {
    return $('.m-list-item');
  };
  queryMap[siteIds.sohu] =     function($) {
    return $('.rList_subCon').eq(0).find('.rList>li div.vName a.at');
  };
  queryMap[siteIds.letv] =     function($) {
    var alist = [];
    $('ol.chart-list').eq(0).children().each(function() {
      var subA = $(this).find('a');
      if (subA.length > 1) {
        alist.push(subA[1]);
      }
    })
    return alist;
  };
  queryMap[siteIds.qq] =       function($) {
    return $('.figures_list').find('.figure_title>a[title]');
  };
  queryMap[siteIds.pptv] =     function($) {
    return $('.main').eq(1).find('.plist1>ul.cf>li>div.tit>a');
  };
  queryMap[siteIds.youku] =    function($) {
    return $('#expRank').find('a.name');
  };

  return queryMap;
})();

function parseTitleAndURL(queryFn, html) {
  var $ = cheerio.load(html);
  var alist = queryFn($);

  if (alist == undefined) throw new Error('hot list is empty');

  var hotList = {};
  hotList.items = [];
  alist.each(function(i, elem) {
    var item = {};
    item.index = i + 1;
    item.title = $(this).text();
    item.url = $(this).attr('href');
    hotList.items.push(item);
  });
  return new Promise(function(resolve) {
    resolve(hotList);
  });
}

module.exports = {
  siteIds,
  queryMap, // title and url only
  parseTitleAndURL,
}

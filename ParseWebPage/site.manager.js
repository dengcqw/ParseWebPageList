
var siteIds = require('./site.id.js').siteIds;

const maxQueryCount = 10;

var queryMap = (function () {
  var queryMap = {};
  queryMap[siteIds.iqiyi] =    function($) {
    var alist = $('.topDetails-list>li').find('h2>a[title]');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.acfun] =    function($) {
    var alist = $('.title');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.bilibili] = function($) {
    var alist = $('.title').parent();
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.mgtv] =     function($) {
    var alist = $('.m-list-item>.info-1').find('span.title'); // title element, parent is a element

    var items = [];
    alist.each(function(i, elem) {
      var item = {};
      item.index = i + 1;
      item.title = $(this).text();
      item.url = $(this).parent().attr('href');
      items.push(item);
    });

    return new Promise(function(resolve) {
      resolve(items);
    });
  };
  queryMap[siteIds.sohu] =     function($) {
    var alist = $('.rList_subCon').eq(0).find('.rList>li div.vName a.at');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.letv] =     function($) {
    var alist = $('ol.chart-list.selected').children().find('span').filter(function(index, element) {
      return $(this).parent().children().get(1) == element }
    ).find('a');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.qq] =       function($) {
    var alist = $('.figures_list').find('.figure_title>a[title]');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.pptv] =     function($) {
    var alist = $('.main').eq(1).find('.plist1>ul.cf>li>div.tit>a');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.youku] =    function($) {
    var alist = $('#expRank').find('a.name');
    return parseTitleAndURL(alist, $);
  };

  return queryMap;
})();

function parseTitleAndURL(queryResult, $) {
  var alist = queryResult; // jquery object

  if (alist == undefined) throw new Error('hot list is empty');

  var items = [];
  alist.each(function(i, elem) {
    var item = {};
    item.index = i + 1;
    item.title = $(this).text();
    item.url = $(this).attr('href');
    items.push(item);
    if (i+1>=maxQueryCount) return false;
  });
  return new Promise(function(resolve) {
    resolve(items);
  });
}

module.exports = {
  siteIds,
  queryMap // title and url only
}

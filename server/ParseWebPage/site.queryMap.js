
const siteIds = require('../sites').siteIds;

// TODO: move to config file
const maxQueryCount = 30;

const queryMap = (function () {
  var queryMap = {};
  queryMap[siteIds.iqiyi] =    function($) {
    var alist = $('.topDetails-list>li').find('h2>a[title]');
    return parseTitleAndURL(alist, $);
  };
  queryMap[siteIds.acfun] =    function($) {
    return parseAcfun($);
  };
  queryMap[siteIds.bilibili] = function($) {
    return parseBilibili($);
  };
  queryMap[siteIds.imgo] =     function($) {
    var alist = $('.m-list-item>.info-1').find('span.title'); // title element, parent is a element

    var items = [];
    alist.each(function(i, elem) {
      var item = {};
      item.title = $(this).text();
      item.capturedurl = $(this).parent().attr('href');
      items.push(item);
      if (i+1>=maxQueryCount) return false;
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
    item.title = $(this).text();
    item.capturedurl = $(this).attr('href');
    items.push(item);
    if (i+1>=maxQueryCount) return false;
  });
  return items
}

function parseAcfun($) {
  var items = []
  $('div.mainer>div.item').each(function(i, elem) {
    let url = $(this).find('a.title').attr('href')
    let title = $(this).find('a.title').text()
    let image = $(this).find('img.preview').attr('src')
    let playCount = $(this).find('span.pts').eq(0).text()
    let desc = $(this).find('.desc').text()

    var item = {}
    item.title = title
    if (!url.startsWith('http')) {
      url = "http://www.acfun.cn" + url
    }
    item.capturedurl = url
    if (image.startsWith('//')) {
      image = 'http:'+image
    }
    item.imgh = image
    function transferPlayCount(playCount) {
      if (playCount.includes("万")) {
        return playCount
      } else if (parseInt(playCount) > 10000) {
        return (playCount/10000).toFixed(2)+"万"
      } else {
        return playCount
      }
    }
    item.playcount = transferPlayCount(playCount.replace(/,/g, ''))
    item.desc = desc

    items.push(item);
    if (i+1>=maxQueryCount) return false;
  })
  return items
}

function parseBilibili($) {
  var items = []
  $('ul#rank_list>li').each(function(i, elem) {
    let url = $(this).find('div.content>a').attr('href')
    let title = $(this).find('div.title').text()
    let image = $(this).find('img').attr('data-img')
    if (image.length == 0) image = $(this).find('img').attr('src')

    let playCount = $(this).find('div.detail>span').eq(0).text()

    var item = {}
    item.title = title
    if (!url.startsWith('http')) {
      url = "http://www.bilibili.com" + url
    }
    item.capturedurl = url
    if (image.startsWith('//')) {
      image = 'http:'+image
    }
    item.imgh = image
    item.playcount = playCount.replace(/,/g, '')

    items.push(item);
    if (i+1>=maxQueryCount) return false;
  })
  return items
}

module.exports = queryMap;

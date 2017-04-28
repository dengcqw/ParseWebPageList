
const siteIds = {
  iqiyi:    "iqiyi",
  youku:    "youku",
  qq:       "qq",
  sohu:     "sohu",
  mgtv:     "imgo",
  letv:     "letv",
  pptv:     "pptv",
  bilibili: "bilibili",
  acfun:    "acfun",
}


const siteNames = (function() {
  var siteNames = {};
  siteNames[siteIds.iqiyi] = "爱奇艺";
  siteNames[siteIds.youku] = "优酷";
  siteNames[siteIds.qq] = "腾讯";
  siteNames[siteIds.sohu] = "搜狐";
  siteNames[siteIds.mgtv] = "芒果TV";
  siteNames[siteIds.letv] = "乐视";
  siteNames[siteIds.pptv] = "PPTV";
  siteNames[siteIds.bilibili] = "B站";
  siteNames[siteIds.acfun] = "A站";
  return siteNames;
})()

const categoryName = {
  "dianshiju":"电视剧",
  "zongyi":"综艺",
  "dongman":"动漫"
}

function getIdentifier(href) {
  if(href.search(".iqiyi.com") >= 0) {
    return siteIds.iqiyi;
  } else if(href.search(".acfun.") >= 0) {
    return siteIds.acfun;
  } else if(href.search(".bilibili.com") >= 0) {
    return siteIds.bilibili;
  } else if(href.search('.mgtv.com') >= 0) {
    return siteIds.mgtv;
  } else if(href.search('.sohu.') >= 0) {
    return siteIds.sohu;
  } else if(href.search('.le.') >= 0) {
    return siteIds.letv;
  } else if(href.search('.v.qq.') >= 0) {
    return siteIds.qq;
  } else if(href.search('.pptv.') >= 0) {
    return siteIds.pptv;
  } else if(href.search('.youku.') >= 0) {
    return siteIds.youku;
  } else {
    return "unknown";
  }
}

function getSiteModelName(siteId) {
  return 'Hotlist-' + siteId;
}


module.exports = {
  siteIds,
  siteNames,
  getIdentifier,
  getSiteModelName
}


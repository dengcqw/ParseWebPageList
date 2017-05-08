
const siteIds = {
  iqiyi    : "iqiyi",
  youku    : "youku",
  qq       : "qq",
  sohu     : "sohu",
  mgtv     : "imgo",
  letv     : "letv",
  pptv     : "pptv",
  bilibili : "bilibili",
  acfun    : "acfun",
}

function getSiteID(href) {
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

function getSiteModelName(siteID) {
  return siteID+'Hotlist';
}

module.exports = {
  siteIds,
  getSiteID,
  getSiteModelName
}


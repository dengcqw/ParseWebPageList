
const categoryNames = {
  "dianshiju":"电视剧",
  "zongyi":"综艺",
  "dongman":"动漫",
  "dianying":"电影",
  "shaoer": "动漫",
}


function fetchDetailURL({title, categoryID, siteID, isAlbum}) {
  return `http://unkownhost/o?if=mobile&key=${title}&pos=${isAlbum?1:2}&channel_name=${categoryNames[categoryID]}&site=${siteID}`
}

const clearFileCacheOption = {
  method: 'POST',
  url: 'http://unkownhost',
  headers: {
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded' },
    form: {
      addr: '{"addr":""}',
      taiwan: '0'
    }
}

module.exports = {
  fetchDetailURL,
  uploadOption: {
    host: '',
    path: "",
  },
  clearFileCacheOption
}


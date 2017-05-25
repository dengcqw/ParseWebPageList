
const models = require('./server/models')
const { parseAll } = require('./server/ParseWebPage')
const syncDetail = require('./server/SyncDetail')
const uploadFile = require('./server/routes/upload.js')

module.exports = function autojob() {
  if (process.env.RUN_AUTOJOB && process.env.RUN_AUTOJOB == 'true') {
    console.log("----> will run autojob")
  } else {
    return
  }
  let today = models.createDateKey()
  parseAll() // 抓取网页
  .then(allList =>syncDetail(today)) // 同步全网
  .then(() => models.exportData(today, true)) // 导出数据
  .then(data => uploadFile(JSON.stringify(data))) //上传文件
  .then(() => {
    process.exit(0) //正常推出
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
}

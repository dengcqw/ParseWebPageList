

var models = require('../server/models')
var { siteIds, getSiteModelName } = require('../server/sites')

var test_dates = [
  '20170507',
  '20170508',
  '20170508',
  '20170509',
]


var testCaptureTable =() => new Promise(function(res, rej) {
  console.log("----> test capture")

  var index = 0;
  var insertTable = date=>{
    models.CaptureInfo
      .findOrCreate({where: {date}})
      .spread(function(capture, created) {
        console.log(capture.get({
          plain: true
        }))
        if (index < test_dates.length) {
          insertTable(test_dates[index++])
        } else {
          res()
        }
      })
  }
  insertTable(test_dates[index++]);
})

var urlIds = [
  'fec1738455e891db;1c66d913e47dfeaf;6661c7771d69a545;30bf854c6d0d1d3e',
  'fec1738455e891db;1c66d913e47dfeaf',
  'e61dfd551cbfeea5;f75a9e2099b6dec3',
  'a58f84c29576b009;f5a227442de72034',
]

var testListTable = () => new Promise(function(res, rej) {
  console.log("----> test list table for: ", 'iqiyi')

  var index = 0;
  var insertTable = date => {
    models[getSiteModelName(siteIds.iqiyi)]
      .findOrCreate({where: {date}, defaults: {dianshiju: urlIds[index], zongyi:urlIds[index]}})
      .spread(function(capture, created) {
        console.log(capture.get({
          plain: true
        }))
        index++;
        if (index < test_dates.length) {
          insertTable(test_dates[index])
        } else {
          res()
        }
      })
  }
  insertTable(test_dates[index]);
})

// create database
models.sequelize.sync().then(()=>console.log('create database success'))
return

/* Create tables without re-create
models.sequelize.sync({force: false})
  .then(() => {
    return testCaptureTable()
  }).then(() => {
    return testListTable()
  }).then(() => {
    console.log("----> "+"finish test")
  }).catch((err) => {
    console.log("----> test err: ", err)
  })
*/

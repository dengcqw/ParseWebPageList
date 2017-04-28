
var Sequelize = require('sequelize')
var path      = require("path");

var sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  define: { timestamps: false },
  logging:()=>{/* custom log here */},
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: './database.sqlite'
});


var siteModels = sequelize.import(path.join(__dirname, 'model-sites.js'));
var albumModel = sequelize.import(path.join(__dirname, 'model-album.js'));
var captureModel = sequelize.import(path.join(__dirname, 'model-capture.js'));

console.log("----> exist tables models before define: ", sequelize.models)

// Create tables without re-create
sequelize.sync({force: false})
  .then(() => {
    return testCaptureTable()
  }).then(() => {
    return testListTable()
  }).then(() => {
    console.log("----> "+"finish test")
  }).catch((err) => {
    console.log("----> test err: ", err)
  })

console.log("----> exist tables models: ", sequelize.models)

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
    CaptureTable
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
    ListTableMap['iqiyi']
      .findOrCreate({where: {date}, defaults: {urlIds: urlIds[index]}})
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

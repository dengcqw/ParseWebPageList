
"use strict";

var Sequelize = require("sequelize");
var path      = require("path");

var UpdateQueue = require('./UpdateQueue.js')
var { getSiteModelName } = require('../sites')

var { getHotListPromise } = require('./getHotList.js')
var { getAlbumsPromise } = require('./getAlbums.js')
var { exportDataWrapper } = require('./exportData.js')

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
  storage:  path.join(__dirname, '../../database.db')
});

var siteModels = sequelize.import(path.join(__dirname, 'model-sites.js'));
var albumModel = sequelize.import(path.join(__dirname, 'model-album.js'));
var captureInfoModel = sequelize.import(path.join(__dirname, 'model-captureInfo.js'));

var db = {}

siteModels.forEach(model => db[model.name] = model)
db.Album = albumModel
db.CaptureInfo = captureInfoModel

console.log("----> exist tables models before define: ", sequelize.models)

db.sequelize = sequelize
db.Sequelize = Sequelize
db.getSiteModel = (siteId) => db[getSiteModelName(siteId)]
db.createDateKey = () => new Date().toISOString().slice(0, 10)
db.updateQueue = new UpdateQueue()
db.getHotList = getHotListPromise.bind(db)
db.getAlbums = getAlbumsPromise.bind(db)
db.exportData = exportDataWrapper(db)

module.exports = db;

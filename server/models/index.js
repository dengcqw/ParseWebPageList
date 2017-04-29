
"use strict";

var Sequelize = require("sequelize");
var path      = require("path");

var UpdateQueue = require('./UpdateQueue.js')
var { getSiteModelName } = require('../ParseWebPage/site.id.js')

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
var captureModel = sequelize.import(path.join(__dirname, 'model-capture.js'));

var db = {}

siteModels.forEach(model => db[model.name] = model)
db.album = albumModel
db.capture = captureModel

console.log("----> exist tables models before define: ", sequelize.models)

db.sequelize = sequelize
db.Sequelize = Sequelize
db.getSiteModel = (siteId) => db[getSiteModelName(siteId)]
db.createDateKey = () => new Date().toISOString().slice(0, 10)
db.updateQueue = new UpdateQueue()

module.exports = db;

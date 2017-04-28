
"use strict";

var Sequelize = require("sequelize");
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

var db = {}

var models = [...siteModels, albumModel, captureModel]
models.forEach(model => db[model.name] = model)

console.log("----> exist tables models before define: ", sequelize.models)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


var Sequelize = require('sequelize')
var siteIds = require('./ParseWebPage/site.id.js').siteIds

var sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  define: {
    timestamps: false
  },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: './database.sqlite'
});

var RecordTable = sequelize.define('record', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  date: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var AlbumTable = sequelize.define('album', {
  urlid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  docid:Sequelize.STRING,
  title:Sequelize.STRING,
  desc:Sequelize.STRING,
  imgv:Sequelize.STRING,
  imgh:Sequelize.STRING
})

var ListTableMap = {};
Object.values(siteIds).forEach((siteId, index)=> {
  let Table = sequelize.define(siteId+'_hotlist', {
    date:Sequelize.STRING,
    url_id_list:Sequelize.STRING.BINARY,
  })
  ListTableMap[siteId] = Table
})





"use strict";

var { siteIds, getSiteModelName } = require('../ParseWebPage/site.id.js')

/*
 * create a model for each site to store hot list
 * each list is joined by semicolon
 */

module.exports = function(sequelize, DataTypes) {
  var siteModels = []
  Object.values(siteIds).forEach((siteId, index) => {
    let model = sequelize.define(getSiteModelName(siteId), {
      date: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      dianshiju :{
        type: DataTypes.STRING.BINARY,
        get: () => this.getDataValue('dianshiju').split(';')
      },
      dongman :{
        type: DataTypes.STRING.BINARY,
        get: () => this.getDataValue('dongman').split(';')
      },
      zongyi :{
        type: DataTypes.STRING.BINARY,
        get: () => this.getDataValue('zongyi').split(';')
      }
    })
    siteModels.push(model)
  })

  return siteModels;
};

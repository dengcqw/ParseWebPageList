
"use strict";

var { siteIds, getSiteModelName, categoryNames } = require('../ParseWebPage/site.id.js')

/*
 * create a model for each site to store hot list
 * each list is joined by semicolon
 */

var categoryColumnDef = (DataTypes) => Object.keys(categoryNames).map(categoryID => {
  return {
    [categoryID] : {
      type: DataTypes.TEXT,
      get: function() {
        var value = this.getDataValue(categoryID)
        if (value) value = value.split(';')
        return value
      },
      set: function(val) {
        // TODO: SyntaxError: Unexpected identifier for instanceOf
        // if (val instanceOf Array) val = val.join(';')
        console.log("----> set site value", val)
        if (val.length) val = val.join(';')
        this.setDataValue(categoryID, val)
      }
    }
  }
})

var dateColumnDef = (DataTypes) => {
  return {
    date: {
      type: DataTypes.CHAR(10),
      primaryKey: true,
      allowNull: false,
      unique: true
    }
  }
}

var columnDef = (DataTypes) => Object.assign({}, dateColumnDef(DataTypes), ...categoryColumnDef(DataTypes))

module.exports = function(sequelize, DataTypes) {
  var siteModels = []
  Object.values(siteIds).forEach((siteId, index) => {
    let model = sequelize.define(getSiteModelName(siteId), columnDef(DataTypes))
    siteModels.push(model)
  })

  return siteModels;
};

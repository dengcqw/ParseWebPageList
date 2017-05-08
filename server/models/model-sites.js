
"use strict";

var { getSiteModelName, urlConfig } = require('../sites')

/*
 * create a model for each site to store hot list
 * each list is joined by semicolon
 */

var categoryColumnDef = (DataTypes, categoryIds) => categoryIds.map(categoryID => {
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

var columnDef = (DataTypes, categoryIds) => (
  Object.assign({}, dateColumnDef(DataTypes), ...categoryColumnDef(DataTypes, categoryIds))
)

module.exports = function(sequelize, DataTypes) {
  var siteModels = []
  Object.entries(urlConfig).forEach(([siteID, siteContent]) => {
    let categoryIds = Object.keys(siteContent)
    let model = sequelize.define(getSiteModelName(siteID), columnDef(DataTypes, categoryIds))
    siteModels.push(model)
  })

  return siteModels;
};

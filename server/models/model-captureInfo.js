"use strict";

/*
 * store info about each capture
 */
module.exports = function(sequelize, DataTypes) {
  var CaptureInfoModel = sequelize.define('CaptureInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      unique: true
    }
  });
  return CaptureInfoModel;
};


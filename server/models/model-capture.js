"use strict";

/*
 * store info about each capture
 */
module.exports = function(sequelize, DataTypes) {
  var CaptureModel = sequelize.define('Capture', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  return CaptureModel;
};


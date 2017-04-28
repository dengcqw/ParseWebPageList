
"use strict";

/*
 * store video album detail info
 */
module.exports = function(sequelize, DataTypes) {
  var AlbumModel = sequelize.define('Album', {
    urlid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    docid:DataTypes.STRING,
    title:DataTypes.STRING,
    desc:DataTypes.STRING,
    imgv:DataTypes.STRING,
    imgh:DataTypes.STRING
  }, {
    timestamps: true, // 增加updatedAt, createdAt
    createdAt: false,
    paranoid: true, // 不直接删除，增加deletedAt
  })
  return AlbumModel
};

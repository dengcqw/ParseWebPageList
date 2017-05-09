
"use strict";

/*
 * store video album detail info
 */
module.exports = function(sequelize, DataTypes) {
  var AlbumModel = sequelize.define('Album', {
    urlid: {
      type: DataTypes.CHAR(16),
      primaryKey: true,
      allowNull: false
    },
    docid:DataTypes.CHAR(32),
    title:DataTypes.CHAR(100),
    capturedurl:DataTypes.STRING,
    desc:DataTypes.TEXT,
    imgv:DataTypes.STRING,
    imgh:DataTypes.STRING,
    playcount:DataTypes.CHAR(10),
    episode:DataTypes.CHAR(25),
  }, {
    timestamps: true, // 增加updatedAt, createdAt
    createdAt: false,
    paranoid: true, // 不直接删除，增加deletedAt
  })
  return AlbumModel
};



module.exports = (json) => {
  let report = ["榜单数据分析"]
  Object.entries(json).forEach(([siteID, siteContent]) => {
    report.push(" 站点："+siteID)
    Object.entries(siteContent).forEach(([categoryID, albums]) => {
      report.push("   分类："+categoryID)
      albums.forEach((album) => {
        let albumCheck = ""
        if (siteID == "acfun" || siteID == "bilibili") {
          if (album.playcount.length == 0) {
            albumCheck = albumCheck + "无播放量 "
          }
          if (album.imgh.length == 0) {
            albumCheck = albumCheck + "无横图 "
          }
        } else {
          if (album.docid.length == 0) {
            albumCheck = albumCheck + "未获取到专辑"
            report.push("      "+`${album.title}：${albumCheck}`)
            return
          }
          if (album.imgv.length == 0) {
            albumCheck = albumCheck + "无竖图 "
          }
          if (categoryID == "dianying") {
            if (album.episode.length > 0) {
              albumCheck = albumCheck + "电影无episode"
            }
          } else {
            if (album.episode.length == 0) {
              albumCheck = albumCheck + "无集数"
            }
          }
        }
        if (albumCheck.length) {
          report.push("      "+`${album.title}：${albumCheck}`)
        }
      })
    })
  })
  return report.join('\r')
}

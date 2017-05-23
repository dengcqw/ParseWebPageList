
const PromiseQueue = require('./PromiseQueue.js')
const models = require('../models')
const requestDetail = require('./fetchDetail.js')
const siteIds = require('../sites').siteIds

const syncQueue_0 = new PromiseQueue()
const syncQueue_1 = new PromiseQueue()
const syncQueue_2 = new PromiseQueue()

// 1. get all url ids in a day - read db
// 2. get albums info of the url ids - read db
// 3. fetch detail if docid is empty - network requset
// 4. save the detail - write db


let getQyImageURL= (width, height) => url => {
  let index = url.search('.jpg')
  if (index == -1) {
    return ""
  } else {
    return url.substring(0, index) + "_" + width +"_"+ height +".jpg"
  }
}

/*
{siteID: {
  categoryID: [urlids]   =>   [{siteID, catetoryID, urlID}]
}}
*/
function flattenHotList(hotList) {
  return Object.entries(hotList).reduce((reduced, [siteID, siteContent]) => {
    let itemsOfSite = Object.entries(siteContent).reduce((reduced, [categoryID, urlIds]) => {
      if (!urlIds) {
        console.log("----> urlIds is null: ", siteID, categoryID)
        return reduced
      }
      if (siteID == siteIds.bilibili || siteID == siteIds.acfun)  {
        return reduced
      }
      return reduced.concat(urlIds.map(urlID => ({siteID, categoryID, urlID})))
    }, [])

    return reduced.concat(itemsOfSite)
  }, [])
}

function getAlbumsPromise(urlID) {
  return new Promise(function(res, rej) {
    models.updateQueue.enqueue(() => {
      return models.Album.find({where:{urlid: urlID}})
        .then(album => res(album)).catch(err => rej(err))
    })
  })
}

function syncItemDetail(urlIdInfo) {
  return getAlbumsPromise(urlIdInfo.urlID) // use urlID get album detail
    .then(album => {
      //if (!album || album.docid) {
        //console.log("----> album has docid: ", album.docid)
        //return null
      //}
      //else { // if no docid then make a requset for detail
        let title = album.title
        let updateTitle = false
        let isQy =false
        // TODO: use api to fetch detail
        if (urlIdInfo.siteID == siteIds.iqiyi) {
            isQy = true
            if (urlIdInfo.categoryID == 'zongyi') {
              title = title.split('之')[0]
              updateTitle = true
            }
        }
        return requestDetail(Object.assign({}, urlIdInfo, {title})).then(detail => {
          let albumDocInfo = detail.albumDocInfo || {}
          if (albumDocInfo == undefined) {
            return null
          }
          let transferImage = getQyImageURL(260, 360)
          album.imgh = albumDocInfo.albumHImage
          album.imgv =isQy ? transferImage(albumDocInfo.albumVImage) : albumDocInfo.albumVImage
          album.desc = albumDocInfo.description
          album.docid = detail.doc_id
          try {
            let episode = ''
            let update = albumDocInfo.video_lib_meta.filmtv_update_strategy
            if (update.search(/^\d{8}$/g) == 0) { // ag. 20170505
              //filmtv_update_strategy : "20170409"
              //season : 3
              update = update.substr(4)
              update = update.substr(0,2) + '-' + update.substr(2) + '期'
              episode = update
            } else if (update.search(/^\d{1,4}$/g) == 0 && urlIdInfo.categoryID != 'dianying') {
              let totalVideoCount = albumDocInfo.video_lib_meta.total_video_count
              if (totalVideoCount == '0') {
                episode = `更新至${update}集`
              } else if (totalVideoCount == update) {
                episode = `${totalVideoCount}集全`
              } else {
                episode = `更新至${update}集`
              }
            }
            album.episode = episode
          } catch(e) {
            console.log("----> format video update info error", err)
          }

          if (updateTitle) {
            album.title = albumDocInfo.albumTitle
          }
          console.log("----> will save album", album.title)
          return album.save()
        })
      //}
    })
}

function enqueueSyncItemDetail(urlIdInfos) {
  return new Promise(function(res, rej) {
    let jobCount = urlIdInfos.length
    console.log("----> start sync item count: ", jobCount)
    urlIdInfos.forEach((urlIdInfo, index) => {
      let promise = () => syncItemDetail(urlIdInfo).then(()=>{
        jobCount--
        if (jobCount == 0) res()
      }).catch(err => {
        console.log("----> get item detail err", urlIdInfo, err)
        jobCount--
        if (jobCount == 0) res()
      })
      promise.message = 'sync item detail ' + JSON.stringify(urlIdInfo)
      if (index%3 == 0) syncQueue_0.enqueue(promise)
      if (index%3 == 1) syncQueue_1.enqueue(promise)
      if (index%3 == 2) syncQueue_2.enqueue(promise)
    })
  })
}

module.exports = function syncDetail(date) {
  return models
    .getHotList(date)
    .then(flattenHotList)
    .then(enqueueSyncItemDetail)
}

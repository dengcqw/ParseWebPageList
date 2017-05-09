
const PromiseQueue = require('./PromiseQueue.js')
const models = require('../models')
const requestDetail = require('./fetchDetail.js')
cosnt siteIds = require('../sites').siteIds

const syncQueue_0 = new PromiseQueue()
const syncQueue_1 = new PromiseQueue()
const syncQueue_2 = new PromiseQueue()

// 1. get all url ids in a day - read db
// 2. get albums info of the url ids - read db
// 3. fetch detail if docid is empty - network requset
// 4. save the detail - write db

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
      if (!album || album.docid) {
        console.log("----> album has docid: ", album.docid)
        return null
      }
      else { // if no docid then make a requset for detail
        let title = album.title
        // TODO: use api to fetch detail
        if (urlIdInfo.siteID == siteIds.iqiyi && urlIdInfo.categoryID == 'zongyi') {
          title = title.split('之')[0]
        }
        return requestDetail(Object.assign({}, urlIdInfo, {title})).then(detail => {
          let albumDocInfo = detail.albumDocInfo || {}
          if (albumDocInfo == undefined) {
            return null
          }
          album.imgh = albumDocInfo.albumHImage
          album.imgv = albumDocInfo.albumVImage
          album.desc = albumDocInfo.description
          album.docid = detail.doc_id
          console.log("----> will save album", album.title)
          return album.save()
        })
      }
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

//syncDetail('2017-05-04')

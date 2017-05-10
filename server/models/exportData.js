
const PromiseQueue = require('../SyncDetail/PromiseQueue.js')

const promiseQueue_0 = new PromiseQueue()

// models is db defined in ./idnex.js
function exportData(models, date, callback/* (result, err) */) {
  models.getHotList(date)
  .then(hotList => {
    let jobCount = 0
    let promiseArr = []
    let urlIds = Object.entries(hotList).forEach(([siteID, siteContent]) => {
      Object.entries(siteContent).forEach(([categoryID, urlIds]) => {
        let urlIDMap = {}
        console.log("----> create promise", siteID, categoryID)
        let promise = () => models.getAlbums(urlIds).then(albums => {
          try {
            let existDocids = {}
            let repeatFilterdAlbums = urlIds.map(urlID => {
              let album = albums[urlID]
              let imgh = siteID == 'acfun' || siteID == 'bilibili' ? album.imgh : ''
              return {
                title: album.title || "",
                url: album.capturedurl || "",
                imgv: album.imgv || "",
                imgh: imgh || "",
                playcount: album.playcount || "",
                episode: album.episode || "",
                docid: album.docid || "",
                urlid: album.urlid || ""
              }
            })
            .filter((item, index, self) => {
              if (!item.docid || item.docid == "")  return true // acfun and bilibili have not docid
              if (existDocids[item.docid]) {
                return false
              } else {
                existDocids[item.docid] = item.docid
                return true
              }
            })
            console.log("----> get filter", repeatFilterdAlbums.length)

            hotList[siteID][categoryID] = repeatFilterdAlbums
          }catch(e) {
            console.log("----> export data: process album err", e)
          }

          jobCount--
          if (jobCount == 0) callback(hotList)
        }).catch(err => {
          console.log("----> export data err", err)
          jobCount--
          if (jobCount == 0) callback(hotList)
        })

        promise.message = siteID+' '+categoryID

        promiseArr.push(promise)
      })
    })

    jobCount = promiseArr.length
    console.log("----> jobs", jobCount)
    promiseArr.forEach(promise => {
      promiseQueue_0.enqueue(promise)
    })

  })
  .catch(err => {console.log(err); res.sendStatus(503)})
}

function exportDataPromise(models, date) {
  return new Promise((res, rej) => {
    exportData(models, date, (result, err) => {
      if (err) {
        rej(err)
      } else {
        res(result)
      }
    })
  })
}

// send all the urlid
module.exports = {
  exportDataWrapper : (models) => (date) => exportDataPromise(models, date)
}



const PromiseQueue = require('../SyncDetail/PromiseQueue.js')

const syncQueue_0 = new PromiseQueue()

const models = require('./index.js')

const fs = require('fs')


// models is db defined in ./idnex.js
function exportData(models, callback/* (result, err) */) {
  models.getHotList(models.createDateKey())
  .then(hotList => {
    let jobCount = 0
    let promiseArr = []
    let urlIds = Object.entries(hotList).forEach(([siteID, siteContent]) => {
      Object.entries(siteContent).forEach(([categoryID, urlIds]) => {
        let promise = () => models.getAlbums(urlIds).then((albums)=>{
          try {
            hotList[siteID][categoryID] = urlIds.map(urlID => albums[urlID])
          }catch(e) {
            console.log("----> msg", e)
          }

          jobCount--
          if (jobCount == 0) callback(hotList)
        }).catch(err => {
          console.log("----> export data err", err)
          jobCount--
          if (jobCount == 0) callback(hotList)
        })

        promiseArr.push(promise)
      })
    })

    jobCount = promiseArr.length
    promiseArr.forEach(promise => {
      syncQueue_0.enqueue(promise)
    })

  })
  .catch(err => {console.log(err); res.sendStatus(503)})
}

//exportData(models, (result, err) => {
  //let outputPath = process.cwd() + '/exportData.json'
  //fs.writeFile(outputPath, JSON.stringify(result), (err)=> {
    //if (err) throw err
      //console.log('export data to ', outputPath)
  //})
//})

// send all the urlid in a day
module.exports = {
  exportData
}



const { urlConfig } = require('../sites')
const siteIds = Object.keys(urlConfig)


// need bind this to index db obj
function getHotListPromise(date) {
  return new Promise((res, rej) => {
    getHotList(this, date, function(result, err) {
      if (result) res(result)
      else rej(err)
    })
  })
}


// models is db defined in ./idnex.js
function getHotList(models, date, callback/* (result, err) */) {
  if (!date) {
    callback(null, new Error('get hot list with null date'))
    return
  }

  let jobCount = siteIds.length
  let result = {}

  siteIds.forEach(siteID => {
    models.updateQueue.enqueue(() => { // update db promise queue
      return models.getSiteModel(siteID)
        .find({where:{date}})
        .then(siteModel => { // site model contain hotlist urlID
          if (siteModel) {
            result[siteID] = Object.keys(urlConfig[siteID]).reduce((reducedObj, categoryID) => {
              reducedObj[categoryID] = siteModel[categoryID] // read hotlist of category
              return reducedObj
            }, {})
          } else {
            result[siteID] = {}
          }
          console.log("----> get content for site", siteID)
          jobCount--
          if (jobCount == 0) callback(result)
        }).catch(err => {
          console.log("----> get content error for site", siteID, err)
          result[siteID] = {}
          jobCount--
          if (jobCount == 0) callback(result)
        })
    })
  })
}


// send all the urlid in a day
module.exports = {
  getHotList,
  getHotListPromise
}


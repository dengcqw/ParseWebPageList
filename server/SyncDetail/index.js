
const PromiseQueue = require('./PromiseQueue.js')
const models = require('../models')
const requestDetail = require('./fetchDetail.js')
const {siteIds, categoryNames} = require('../ParseWebPage/site.id.js')

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
      return reduced.concat(urlIds.map(urlID => ({siteID, categoryID, urlID})))
    }, [])

    return reduced.concat(itemsOfSite)
  }, [])
}

function syncDetail(date) {
  models.getHotList(date)
    .then(hotList => flattenHotList(hotList))
  .then(urlIdInfos => console.log("----> msg", urlIdInfos.length))
    .catch(err => console.log(err))
}

syncDetail('2017-05-05')

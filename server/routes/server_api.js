
const express = require('express'),
  router = express.Router();

const { parseCategory, parseAll } = require('../ParseWebPage');
const { requestDetail } = require('./api.js')
const models = require('../models')
const {siteIds, categoryNames} = require('../ParseWebPage/site.id.js')
const urlConfig = require('../ParseWebPage/urlConfig.json')

const apiMap = {
  fetchAll: (req, res) => {
    parseAll()
      .then(allList => res.send(allList))
      .catch(err => res.sendStatus(503))
  },
  fetchCatetory: (req, res) => {
    parseCategory(req.query.siteid, req.query.categoryid, req.query.date)
      .then(list => res.send(list))
      .catch(err => res.sendStatus(503))
  },
  itemDetail: (req, res) => {
    requestDetail(req.query)
      .then(content => res.send(content))
      .catch(err => res.sendStatus(503))
  },
  captureInfo: (req, res) => {
    models.CaptureInfo.findAll({
      order: 'date DESC'
    }).then(infos => {
      res.send(infos)
    }).catch(err => res.sendStatus(503))
  },
  getHotList: (req, res) => { // send all the urlid
    let date = req.query.date
    if (!date) {
      res.sendStatus(503)
      return
    }

    let jobCount = Object.values(siteIds).length
    let result = {}

    Object.values(siteIds).forEach(siteID => {
      models.updateQueue.enqueue(() => { // update db promise queue
        return models.getSiteModel(siteID)
          .find({where:{date}})
          .then(siteModel => { // site model contain hotlist urlID
            if (siteModel) {
              result[siteID] = Object.keys(categoryNames).reduce((reducedObj, categoryID) => {
                reducedObj[categoryID] = siteModel[categoryID] // read hotlist of category
                return reducedObj
              }, {})
            }
            jobCount--
            console.log("----> get content for site", siteID)
            if (jobCount == 0) res.send(result)
          }).catch(err => {
            console.log("----> get content error for site", siteID, err)
            result[siteID] = {}
            jobCount--
            if (jobCount == 0) res.send(result)
          })
      })
    })
  },
  getAlbums: (req, res) => {
    let urlIds =  req.body
    if (!urlIds) {
      res.sendStatus(503)
      return
    }
    let jobCount = urlIds.length
    let result = {}
    urlIds.forEach(urlid => {
      models.updateQueue.enqueue(() => {
        return models.Album.find({where:{urlid}})
          .then(album => {
            result[urlid] = album.toJSON()
            jobCount--
            console.log("----> get albums for site", urlid)
            if (jobCount == 0) res.send(result)
          }).catch(err => {
            console.log("----> get albums error for site", urlid, err)
            result[siteID] = {}
            jobCount--
            if (jobCount == 0) res.send(result)
          })
      })
    })
  },
  redirectHotPage: (req, res) => {
    try {
      let hotPageURL = urlConfig[req.query.siteid][req.query.categoryid]
      res.redirect(hotPageURL)
    }catch(e) {
      res.sendStatus(404)
    }
  }
}

/*
 * /api/ as relerant root
 */
router.all('/:id', function(req, res) {

  console.log("----> request api: ", req.params.id)
  console.log("----> request query: ", req.query)
  console.log("----> request body: ", req.body)

  if (apiMap[req.params.id]) {
    apiMap[req.params.id](req, res)
  } else {
    res.sendStatus(404)
  }
})

module.exports = router

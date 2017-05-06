
const express = require('express'),
  router = express.Router();

const { parseCategory, parseAll } = require('../ParseWebPage');
const requestDetail = require('../SyncDetail/fetchDetail.js')
const models = require('../models')
const {siteIds, categoryNames} = require('../ParseWebPage/site.id.js')
const urlConfig = require('../ParseWebPage/urlConfig.json')
const syncDetail = require('../SyncDetail')


const apiMap = {
  fetchAll: (req, res) => {
    parseAll()
      .then(allList => res.send(allList))
      .catch(err => {console.log(err); res.sendStatus(503)})
  },
  fetchCatetory: (req, res) => {
    parseCategory(req.query.siteid, req.query.categoryid, req.query.date)
      .then(list => res.send(list))
      .catch(err => {console.log(err); res.sendStatus(503)})
  },
  itemDetail: (req, res) => {
    let itemInfo = {title:req.query.title, categoryID:req.query.categoryid, siteID:req.query.siteid}
    requestDetail(itemInfo)
      .then(content => res.send(content))
      .catch(err => { console.log(err); res.sendStatus(503) })
  },
  captureInfo: (req, res) => {
    models.CaptureInfo.findAll({
      order: 'date DESC'
    }).then(infos => {
      res.send(infos)
    }).catch(err => {console.log(err); res.sendStatus(503)})
  },
  getHotList: (req, res) => { // send all the urlid
    models.getHotList(req.query.date)
      .then(result => res.send(result))
      .catch(err => {console.log(err); res.sendStatus(503)})
  },
  getAlbums: (req, res) => {
    models.getAlbums(req.body)
      .then(result => res.send(result))
      .catch(err => {console.log(err); res.sendStatus(503)})
  },
  redirectHotPage: (req, res) => {
    try {
      let hotPageURL = urlConfig[req.query.siteid][req.query.categoryid]
      res.redirect(hotPageURL)
    }catch(e) {
      res.sendStatus(404)
    }
  },
  syncDetail: (req, res) => {
    syncDetail(req.query.date)
      .then(() => res.send())
      .catch(err => {console.log(err); res.sendStatus(503)})
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

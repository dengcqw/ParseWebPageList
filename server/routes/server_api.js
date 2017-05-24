
const express = require('express'),
  router = express.Router();

const { parseCategory, parseAll } = require('../ParseWebPage');
const requestDetail = require('../SyncDetail/fetchDetail.js')
const models = require('../models')
const urlConfig = require('../sites').urlConfig
const syncDetail = require('../SyncDetail')
const validation = require('../models/validateData.js')

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
    let itemInfo = {title:req.query.title, categoryID:req.query.categoryid, siteID:req.query.siteid, isAlbum: true}
    requestDetail(itemInfo)
      .then(content => res.send(content))
      .catch(err => { console.log(err); res.sendStatus(503) })
  },
  captureInfo: (req, res) => {
    models.updateQueue.enqueue(() => {
      return models.CaptureInfo
        .findAll({ order: 'date DESC' })
        .then(infos => { res.send(infos) })
        .catch(err => {console.log(err); res.sendStatus(503)})
    })
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
  },
  uploadJson: (req, res) => {
    setTimeout(()=> {
      res.send()
    }, 2000)
    //syncDetail(req.query.date)
      //.then(() => res.send())
      //.catch(err => {console.log(err); res.sendStatus(503)})
  },
  downloadJson: (req, res) => {
    let filter = req.query.type == '0' ? true : false
    models.exportData(models.createDateKey(), filter)
    .then(data => {
      if (req.query.type == '0') { // hot list
        return res.send(JSON.stringify(data))
      } else if (req.query.type == '1') {
        return res.send(validation(data))
      } else {
        throw new Error("download json type error: " + req.query.type)
      }
    }).catch(err => {console.log(err); res.sendStatus(503)})
  },
  saveDetail: (req, res) => {
    let urlid = req.body.urlid
    models.updateQueue.enqueue(() => {
      return models.Album
        .find({where:{urlid}})
        .then(album => album.update(req.body))
        .then(() => res.send())
        .catch(err => {console.log(err); res.sendStatus(503)})
    })
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

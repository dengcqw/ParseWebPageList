
const express = require('express'),
  router = express.Router();

const { parseCatetory, parseAll } = require('../ParseWebPage');
const { requestDetail } = require('./api.js')

const apiMap = {
  fetchAll: (req, res) => {
    parseAll()
      .then(allList => res.send(allList))
      .catch(err => res.sendStatus(503))
  },
  fetchCatetory: (req, res) => {
    parseCatetory(req.query.siteid, req.query.categoryid)
      .then(list => res.send(list))
      .catch(err => res.sendStatus(503))
  },
  itemDetail: (req, res) => {
    requestDetail(req.query)
      .then(content => res.send(content))
      .catch(err => res.sendStatus(503))
  }
}

/*
 * /api/ as relerant root
 */
router.all('/:id', function(req, res) {

  console.log("----> request api: ", req.params.id, req.query);

  if (apiMap[req.params.id]) {
    apiMap[req.params.id](req, res)
  } else {
    res.sendStatus(404)
  }
})

module.exports = router

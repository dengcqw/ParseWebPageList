
// fetch polyfill can't remove
require('es6-promise').polyfill();
require('isomorphic-fetch');

const {categoryNames} = require('../ParseWebPage/site.id.js')
const fetchDetailURL = require('./api.js')

function _requestDetail(query, cb) {
  let url = encodeURI(fetchDetailURL(query.title, query.categoryid, query.siteid))
  console.log("----> fetch detial url: "+url)
  fetch(url)
  .then(function(response) {
    if (response.status >= 400) {
      cb(null, response.statusText);
      return;
    }
    return response.json();
  })
  .then(function(detail) {
    if(detail && detail.code == "A00000"
      && detail.docinfos
      && detail.docinfos.length) {

      cb(detail.docinfos[0])
    } else {
      cb(null, 'detail is empty');
    }
  })
  .catch(err => cb(null, err));
}

const requestDetail = (query) => new Promise(function(res, rej) {
  _requestDetail(query, function(detail, err) {
    if (err) {
      console.log("----> requset detail error: ", err)
      rej(err);
    } else {
      res(detail);
    }
  })
})

module.exports = {requestDetail};


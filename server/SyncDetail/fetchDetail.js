
// fetch polyfill can't remove
require('es6-promise').polyfill();
require('isomorphic-fetch');

const fetchDetailURL = require('./api.js')

function _requestDetail(itemInfo, cb) {
  console.log("----> fetch detial itemInfo: ", itemInfo)
  let url = encodeURI(fetchDetailURL(itemInfo))
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

const requestDetail = (itemInfo) => new Promise(function(res, rej) {
  _requestDetail(itemInfo, function(detail, err) {
    if (err) {
      console.log("----> requset detail error: ", err)
      rej(err);
    } else {
      res(detail);
    }
  })
})

module.exports = requestDetail


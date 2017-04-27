
const path = require('path');
const CaptureQueue = require('./CaptureQueue.js');
var urlConfig = require('./urlConfig.json');
const captureQueue = new CaptureQueue();

captureQueue.outputDir = path.resolve(process.cwd(), './output');

const parseAll = () => new Promise(function(res, rej) {
  try {
    console.log("----> start parseAll")
    captureQueue.captureAll(function(allList) {
      res(allList)
    })
  } catch(err) {
    rej(err)
  }
})

const parseCatetory = (siteID, categoryID) => new Promise(function(res, rej) {
  try {
    let url = urlConfig[siteID][categoryID]
    captureQueue.captureList(
      {siteID, categoryID, url},
      (list, err) => {
        if (list) {
          res(list)
        } else {
          rej(err)
        }
      }
    )
  } catch(err) {
    rej(err)
  }
})

module.exports = {
  parseAll,
  parseCatetory
};

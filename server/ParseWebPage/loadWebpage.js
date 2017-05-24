
var phantom = require("phantom")
var _ph, _page

//FIXED: It may be a good idea to register handlers to SIGTERM and SIGINT signals with #kill().
process.on('SIGINT', () => {
  console.log("----> SIGINT kill phantom ")
  if (_ph) _ph.kill()
  if (_page) _page.close()
  //NOTE: if not invoke exit, process will not exit
  process.exit()
})
process.on('SIGTERM', () => {
  console.log("----> SIGTERM kill phantom ")
  if (_ph) _ph.kill()
  if (_page) _page.close()
  process.exit()
})

function getPhantomInstnce() {
  return new Promise(function (res, rej) {
    if (_ph) {
      res(_ph)
    } else {
      let log = console.log
      let nolog = function() {}
      let logger ={
        logger: { warn: log, debug: nolog, error: log },
        logLevel: 'info'
      }
      phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'], logger).then(ph => {
        _ph = ph
        res(ph)
      }).catch(err => rej(err))
    }
  })
}

// TODO: use js inject instand of cheerio; because content-laod block by some resource loading
module.exports = (url, delay=100) => (
  getPhantomInstnce().then(ph => {
    return _ph.createPage()
  }).then(page => {
    _page = page
    // NOTE: below callback executes in the PhantomJS process not Nodejs
    page.on('onResourceRequested', true, function(requestData, networkRequest) {
      if (requestData.url.search("gtm.js") > 0) { // acfun load this url timeout
        networkRequest.abort()
        console.error("----> abort", requestData.url)
      }
    })
    page.on('onResourceError', function(resourceError) {
      console.error("----> onResourceError", resourceError)
    })

    return _page.open(url)
  }).then(status => {
    console.log("----> load webpage status: ", status)
    return new Promise(function(res){
      setTimeout(()=> {
        res()
      }, delay)
    }).then(() => _page.property('content'))
  }).then(content => {
    console.log("----> load webpage content: ", content.length)
    if (_page) {
      _page.close()
      _page = null
    }
    return content
  })
)


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
      phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(ph => {
        _ph = ph
        res(ph)
      }).catch(err => rej(err))
    }
  })
}

// TODO: use js inject instand of cheerio; because content-laod block by some resource loading
module.exports = (url) => (
  getPhantomInstnce().then(ph => {
    return _ph.createPage()
  }).then(page => {
    _page = page
    return _page.open(url)
  }).then(status => {
    console.log("----> load webpage status: ", status)
    return _page.property('content')
  }).then(content => {
    setTimeout(() => {
      _page.close()
      _page = null
    }, 1)
    return content
  })
)

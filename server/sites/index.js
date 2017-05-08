
const siteIds = require('./site.id.js')
//const urlConfig = require('./urlConfig-test.json')
const urlConfig = require('./urlConfig.json')

module.exports = Object.assign({}, siteIds, {urlConfig})

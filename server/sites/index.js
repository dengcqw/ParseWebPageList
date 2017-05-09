
const siteIds = require('./site.id.js')
/**
 * this config file affect frontpage appearance and database
 */
//const urlConfig = require('./urlConfig-test.json')
const urlConfig = require('./urlConfig.json')

module.exports = Object.assign({}, siteIds, {urlConfig})

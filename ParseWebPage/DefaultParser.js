
var path = require('path');
var ParseWebPage = require('./index.js');
var parser = new ParseWebPage(path.resolve(process.cwd(), './output'));

module.exports = parser;

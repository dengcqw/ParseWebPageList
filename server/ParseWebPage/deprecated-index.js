
var _ = require('lodash');
var fs = require('fs');
var loadWebPage = require('./loadWebPage.js'); // Promise

var startTime;

function start() {
  startTime = Date.now();

  var timeout = (ms) => new Promise((resolve, reject) => {
    ms = ms || 1000 * 60 * 2;
    setTimeout(reject, ms, new Error('fetch site timeout: ',ms , 'ms'));
  });

  return Promise.all([...siteWrappers, timeout()]).then(results=>{
    console.log('fetch all done')
    results = _.keyBy(results, function(result) {
      return result.siteID;
    });
    if (this.outputPath) {
      var date = new Date();
      var fileName = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay()+'-'+date.getHours()+'-'+date.getMinutes()+'.json';
      fs.writeFile(this.outputPath+'/'+fileName, JSON.stringify(results), (err) => {
        if (err) throw err;
        console.log('fetch data save to ' + this.outputPath);
      });
    }
    return results;
  });
}

function ParseWebPageList(outputPath) {
  this.outputPath = outputPath;
  this.latestPath = outputPath + '/latest';
  if ( ! fs.existsSync(this.outputPath)) {
    fs.mkdirSync(this.outputPath);
  }
  if ( ! fs.existsSync(this.latestPath)) {
    fs.mkdirSync(this.latestPath);
  }
}

function getFileNames(callback) {
  let path = this.outputPath;
  let jsonFiles = [];
  console.log("----> output path:"+path);
  fs.readdir(path, (err, files)=> {
    files&&files.forEach((file)=>{
      if (file.startsWith('.')) return;
      var subpath = path + '/' + file;
      if(fs.lstatSync(subpath).isDirectory()){
        return;
      } else {
        jsonFiles.push(file);
      }
    });
    callback && callback(jsonFiles.sort().reverse());
  });
}

function getContent(fileName, callback) {
  let path = this.outputPath + '/' + fileName;
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    callback(data);
  });
}

ParseWebPageList.prototype.start = start;
ParseWebPageList.prototype.getFileNames = getFileNames;
ParseWebPageList.prototype.getContent = getContent;

module.exports = ParseWebPageList;

var ParseWebPage = require('./ParseWebPage');
var parser = new ParseWebPage(process.cwd() + '/output');
parser.start().then((all)=>{
  console.log("get all result ----> "+all.length);
});

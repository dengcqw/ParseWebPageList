
module.exports = function (app) {
  app.use('/', require('./frontpage.js'));
  app.use('/login', require('./login.js'));
};

// TODO: break down, give more control
//var ParseWebPage = require('./ParseWebPage');
//var parser = new ParseWebPage(process.cwd() + '/output');
//parser.start().then((all)=>{
  //console.log("get all result ----> "+all.length);
//});



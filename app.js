
var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');
var bodyParser = require('body-parser');

var app = express();
var isDev = false;// process.env.NODE_ENV !== 'production';
var port = 3000;

// assign the ejs engine to .html files
app.engine('html', consolidate.ejs);
// set .html as the default extension
app.set('view engine', 'html');

// res.render() serach path
app.set('views', path.resolve(__dirname, './server/views'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

if (isDev) {

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {
        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.get('/test/:id', function (req, res) {
      console.log("----> test html: ", req.params.id)
      res.render(req.params.id)
    });

    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });

    // TODO: check it later, busy now
    // add "reload" to express, see: https://www.npmjs.com/package/reload
    //var reload = require('reload');
    //var http = require('http');

    //var server = http.createServer(app);
    //reload(server, app);

    //server.listen(port, function(){
    //    console.log('App (dev) is now running on port 3000!');
    //});
} else {

    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/test/:id', function (req, res) {
      console.log("----> test html: ", req.params.id)
      res.render(req.params.id)
    });
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}

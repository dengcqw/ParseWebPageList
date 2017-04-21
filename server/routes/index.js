
module.exports = function (app) {
  app.use('/', require('./frontpage.js'));
  app.use('/login', require('./login.js'));
  app.use('/api', require('./server_api.js')); /* /api/* */
};


var express = require('express');
var logger = require('morgan');
var log = require("./lib/logger")("app");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  var env = req.app.get("env");
  if (env == "development" && !err.status) {
    log(err.stack);
  }
  var message = err.message;
  var status = err.status || 500;
  res.status(status);

  res.json({
    status: status,
    message: message
  })
});

module.exports = app;

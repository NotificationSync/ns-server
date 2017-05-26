var express = require('express');
var router = express.Router();
var root = require('./root');
var notification = require("./notification");
var user = require('./user');

router
  .use(root)
  .use("/notification", notification)
  .use("/user", user);

var v1 = express.Router().use("/api/v1", router);

module.exports = { v1 };

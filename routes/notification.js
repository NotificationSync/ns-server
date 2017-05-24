var express = require('express');
var router = express.Router();
var util = require("../lib/util");

router.all("*", async function (req, res, next) {
  var x_ns_token = req.get("x-ns-token");
  if (x_ns_token) {
    var user = await util.findUserByToken(x_ns_token);
    if (user.length < 1) {
      var err = new Error("No such token");
      err.status = 401;
      next(err);
    } else {
      var notification = await util.findNotificationByUser(user);
      res.locals.user = user;
      res.locals.notification = notification;
      next();
    }
  } else {
    var err = new Error("Need token");
    err.status = 401;
    next(err);
  }
});

router.post("*", function (req, res, next) {
  
});

router.get("*", function (req, res, next) {

});

module.exports = router;
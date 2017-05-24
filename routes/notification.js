var express = require('express');
var router = express.Router();
var util = require("../lib/util");

router.all("*", function (req, res, next) {
  var x_ns_token = req.get("x-ns-token");
  if (x_ns_token) {
    req.locals.user = util.findUserByToken(x_ns_token);
    next();
  } else {
    var err = new Error("need token first");
    err.status = 401;
    next(err);
  }
});

router.post(function (req, res, next) {

});

router.get(function (req, res, next) {

});

module.exports = router;
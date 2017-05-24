var express = require('express');
var router = express.Router();
var util = require("../lib/util");

router.all("/token", function (req, res, next) {
  var user = req.body;
  if (user && user.mail) {
    util.saveNewToken(user);
    res.json({
      "status": "200",
      "message": "check your email to get token"
    });
  } else {
    next(new Error("Registe need a mail address"));
  }
});

module.exports = router;
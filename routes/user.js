var express = require('express');
var router = express.Router();
var util = require("../lib/util");

router.all("/token", async function (req, res, next) {
  try {
    var user = req.body;
    if (user && user.mail) {
      await util.saveNewToken(user);
      res.json({
        "status": "200",
        "message": "check your email to get token"
      });
    } else {
      next(new Error("Registe need a mail address"));
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;
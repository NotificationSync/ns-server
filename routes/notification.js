var express = require('express');
var router = express.Router();
var event = require("../ws/index").event;
var util = require("../lib/util");

router.all("*", async function (req, res, next) {
  var x_ns_token = req.get("x-ns-token");
  if (x_ns_token) {
    var users = await util.findUserByToken(x_ns_token);
    if (users.length < 1) {
      var err = new Error("No such token");
      err.status = 401;
      next(err);
    } else {
      res.locals.user = users[0];
      next();
    }
  } else {
    var err = new Error("Need token");
    err.status = 401;
    next(err);
  }
});

router.post("*", async function (req, res, next) {
  var notification = req.body;
  var user = res.locals.user;
  var io = req.app.locals.io;
  try {
    var rs = await util.saveNewNotification(user, notification);
    notification.id = rs.insertId
    io.to(user.id).emit(event.notification.new, notification);
    res.json({
      status: "200",
      result: "push and saved"
    })
  } catch (error) {
    next(error);
  }
});

router.get("/", async function (req, res, next) {
  var query = req.query;
  try {
    var notifications = await util.findNotificationByUser(res.locals.user);
    res.json({
      status: 200,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
})

router.get("/unread", async function (req, res, next) {
  var query = req.query;
  try {
    var notifications = await util.findNotificationUnreaded(res.locals.user, query);
    res.json({
      status: 200,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
});

router.patch("*", async function (req, res, next) {
  var noti_ids = req.body;
  try {
    if (Array.isArray(noti_ids)) {
      var ret = await util.updateNotificationAsReaded(noti_ids);
      res.json({
        status: 200,
        data: ret
      })
    }
    else
      throw new Error("this api need an notification id array")
  } catch (error) {
    next(error);
  }
});

module.exports = router;
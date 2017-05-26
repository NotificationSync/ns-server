var db = require("./db");
var uuid = require("uuid");
var transporter = require("./mail");
var console = require("console");
var logger = require("./logger");
var config = require("../config");
var _ = require("lodash");
var valid = require("validator");

var util = {

  newToken: function () {
    return uuid().replace(/-/g, '');
  },

  sendMessage: function (from, to, subject, text) {
    var mailOpts = {
      from: from,
      to: to,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOpts, function (err, info) {
      if (err)
        console.error(err);
      logger(info);
    });
  },

  sendToken: function (to, token) {
    util.sendMessage(`NotificationSync <${config.mail.auth.user}>`, to, "Notification Sync Message", `Dear ${to}: your new token is ${token}`);
  },

  saveNewToken: async function (user) {
    if (!valid.isEmail(user.mail)) {
      throw new Error("Need a correct email address");
    }
    var newToken = util.newToken();
    var res = await db.query(`select * from user where mail = '${user.mail}'`);
    if (res.length > 0) {
      await db.query("insert into token set ?", { user_id: res[0].id, content: newToken });
    } else {
      var res = await db.query("insert into user set ?", user);
      await db.query("insert into token set ?", { user_id: res.insertId, content: newToken })
    }
    util.sendToken(user.mail, newToken);
  },

  findUserByToken: async function (token) {
    return await db.query(`SELECT user.* from user INNER JOIN token on token.user_id = user.id where token.content = '${token}'`)
  },

  findNotificationByUser: async function (user) {
    return await db.query(`select * from notification where user_id = '${user.id}'`);
  },

  saveNewNotification: async function (user, notification) {
    var newNotification = { user_id: user.id, title: notification.title, content: notification.content };
    return await db.query(`insert into notification set ?`, newNotification);
  },

  findNotificationUnreaded: async function (user) {
    var notifications = await util.findNotificationByUser(user);
    var ret = _.filter(notifications, { readed: 0 });
    return ret;
  },

  updateNotificationAsReaded: async function (ids) {
    ids = ids || [];
    var ret = await Promise.all(ids.map(id => db.query("update notification set readed = 1 where id = ?", [id])));
    return ret;
  }

};

module.exports = util;
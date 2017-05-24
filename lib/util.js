var db = require("./db");
var uuid = require("uuid");
var transporter = require("./mail");
var console = require("console");
var logger = require("./logger");
var config = require("../config.json");

var util = {
  checkAuth: function (token) {

  },

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
    var newToken = util.newToken();
    var conn = await db.getConnection();
    var res = await conn.query(`select * from user where mail = '${user.mail}'`);
    if (res.length > 0) {
      await conn.query("insert into token set ?", { user_id: res[0].id, content: newToken });
    } else {
      var res = await conn.query("insert into user set ?", user);
      await conn.query("insert into token set ?", { user_id: res.insertId, token: newToken })
    }
    util.sendToken(user.mail, newToken);
  },

  findUserByToken: async function (token) {
    conn = await db.getConnection();
    return await conn.query(`SELECT user.* from user INNER JOIN token on token.user_id = user.id where token.content = '${token}'`)
  },

  findNotificationByUser: async function (user) {
    conn = await db.getConnection();
    return await conn.query(`select * from notification where user_id = '${user.id}'`);
  }

};

module.exports = util;
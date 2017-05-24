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

  saveNewToken: function (user) {
    var newToken = util.newToken();
    db.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(`select * from user where mail = '${user.mail}'`, function (err, res) {
        if (err) throw err;
        if (!res.length) {
          conn.query("insert into user set ?", user, function (err, results) {
            conn.query("insert into token set ?", { user_id: results.insertId, token: newToken });
          });
        } else {
          conn.query("insert into token set ?", { user_id: res[0].id, content: newToken });
        }
      });
    });
    util.sendToken(user.mail, newToken);
  },

  findUserByToken: async (token) {

  }

};

module.exports = util;
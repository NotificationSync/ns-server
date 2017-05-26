var db = require("./db");
var uuid = require("uuid");
var transporter = require("./mail");
var console = require("console");
var logger = require("./logger");
var config = require("../config");
var _ = require("lodash");
var valid = require("validator");

var util = {

  /**
   * generate a new token
   * 
   * @returns token
   */
  newToken: function () {
    return uuid().replace(/-/g, '');
  },

  /**
   * send message by mail
   * 
   * @param {String} from 
   * @param {String} to 
   * @param {String} subject 
   * @param {String} text 
   * @returns send info
   */
  sendMessage: async function (from, to, subject, text) {
    var mailOpts = {
      from: from, to: to, subject: subject, text: text
    };
    return await transporter.sendMailAsync(mailOpts);
  },

  /**
   * send a token to a certain mail
   * 
   * @param {String} to receiver
   * @param {String} token token content
   * @returns 
   */
  sendToken: async function (to, token) {
    return await util.sendMessage(`NotificationSync <${config.mail.auth.user}>`, to, "Notification Sync Message", `Dear ${to}: your new token is ${token}`);
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
    await util.sendToken(user.mail, newToken);
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

  /**
   * find unreaded notifications of the user
   * 
   * @param {Object} user 
   * @returns 
   */
  findNotificationUnreaded: async function (user) {
    var notifications = await util.findNotificationByUser(user);
    var ret = _.filter(notifications, { readed: 0 });
    return ret;
  },

  /**
   * set all notifications as readed
   * 
   * @param {Array<Number>} ids all notifications ids
   * @returns 
   */
  updateNotificationAsReaded: async function (ids) {
    ids = ids || [];
    var ret = await Promise.all(ids.map(id => db.query("update notification set readed = 1 where id = ?", [id])));
    return ret;
  }

};

module.exports = util;
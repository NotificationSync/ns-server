var io = require("socket.io");
var util = require("../lib/util");


var event = {
  connection: "connection",
  message: "message",
  user: {
    token: "user/token",
    mytoken: "user/mytoken"
  },
  notification: {
    unread: "notification/unread",
    all: "notification/all",
    read: "notification/read",
    new: "notification/new"
  }
}

class Message {
  constructor(message, status = 200) {
    this.message = message;
    this.status = status;
  }
}


/**
 * 
 * 
 * @param {any} server 
 * @returns 
 */
function mountWebsocketService(server) {
  var ws_server = io(server);
  ws_server.on(event.connection, socket => {

    socket.on(event.user.token, async (user, cb) => {
      var message = new Message("check your email to get token");
      try {
        await util.saveNewToken(user);
      } catch (error) {
        message = new Message(error.message, 500);
      }
      if (cb)
        cb(message);
    });

    socket.on(event.user.mytoken, async (payload, cb) => {
      var message = new Message("this session have valid by your token")
      try {
        var rs = await util.findUserByToken(payload.token);
        if (rs.length > 0) {
          var user = rs[0];
          var user_id = user.id;
          socket.join(user_id);

          socket.on(event.notification.new, async (payload, cb) => {
            try {
              await util.saveNewNotification(user, payload);
              socket.to(user_id).emit(event.notification.new, payload);
              if (cb)
                cb(new Message("new notification saved"))
            } catch (error) {
              if (cb)
                cb(new Message(error.message, 500));
            }
          });

          socket.on(event.notification.unread, async (payloda, cb) => {
            try {
              var notifications = await util.findNotificationUnreaded(user);
              if (cb)
                cb(notifications);
            } catch (error) {
              if (cb)
                cb(new Message(error.message, 500));
            }
          });

          socket.on(event.notification.all, async (payloda, cb) => {
            try {
              var notifications = await util.findNotificationByUser(user);
              if (cb)
                cb(notifications);
            } catch (error) {
              if (cb)
                cb(new Message(error.message, 500));
            }
          });

          socket.on(event.notification.read, async (ids, cb) => {
            try {
              await util.updateNotificationAsReaded(ids);
              if (cb)
                cb(new Message(`make ${ids} readed`));
            } catch (error) {
              if (cb)
                cb(new Message(error.message, 500));
            }
          });

        } else {
          throw new Error("No such token")
        }
      } catch (error) {
        message = new Message(error.message, 500);
      }
      if (cb)
        cb(message);
    });


  });

  return ws_server;
}

module.exports = { mountWebsocketService, event }
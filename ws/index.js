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


function mountWebsocketService(server) {
  var ws_server = io(server);
  var online_clients = {};
  ws_server.on(event.connection, socket => {

    socket.on(event.user.token, async (user, cb) => {
      var message = new Message("check your email to get token");
      try {
        await util.saveNewToken(user);
      } catch (error) {
        message = new Message(error.message, 500);
      }
      cb(message);
    });

    socket.on(event.user.mytoken, async (data, cb) => {
      var message = new Message("this session have valid by your token")
      try {
        var rs = util.findUserByToken(data.token);
        if (rs.length > 0) {
          var user = rs[0];
          var user_clients = online_clients[user.id] = online_clients[user.id] || [];
          user_clients.push(socket);
          socket._clients = user_clients;
        } else {
          throw new Error("No such token")
        }
      } catch (error) {
        message = new Message(error.message, 500);
      }
      cb(message);
    });


  });

  return ws_server;
}

module.exports = { mountWebsocketService }
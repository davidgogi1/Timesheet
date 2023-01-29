const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();
const socket = require("socket.io");
const Server = socket.Server;
const { Notification, validate } = require("./models/notification");

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", async (socket) => {
  socket.on("newUser", async (username) => {
    addNewUser(username, socket.id);

    const notifications = await Notification.find().select("-__v");

    for (let i = 0; i < notifications.length; i++) {
      notifications[i]._doc.receiverName === username &&
        io
          .to(getUser(notifications[i]._doc.receiverName)?.socketId)
          .emit("getNotification", {
            senderName: notifications[i]._doc.senderName,
            receiverName: notifications[i]._doc.receiverName,
            type: notifications[i]._doc.type,
            shown: notifications[i]._doc.shown,
          });
    }
  });

  socket.on(
    "sendNotification",
    async ({ senderName, receiverName, type, shown }) => {
      const receiver = getUser(receiverName);

      const notification = new Notification({
        senderName: senderName,
        receiverName: receiverName,
        type: type,
        shown: shown,
      });
      notification.save();

      io.to(receiver?.socketId).emit("getNotification", {
        senderName: notification._doc.senderName,
        receiverName: notification._doc.receiverName,
        type: notification._doc.type,
        shown: notification._doc.shown,
      });
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
io.listen(5001);

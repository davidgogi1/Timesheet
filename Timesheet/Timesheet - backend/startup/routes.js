const express = require("express");
const spreadsheets = require("../routes/spreadsheets");
const projects = require("../routes/projects");
const employers = require("../routes/employers");
const notifications = require("../routes/notifications");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/spreadsheets", spreadsheets);
  app.use("/api/projects", projects);
  app.use("/api/employers", employers);
  app.use("/api/notifications", notifications);
  app.use("/api/auth", auth);
  app.use(error);
};

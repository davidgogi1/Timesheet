const { Notification, validate } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const notifications = await Notification.find().select("-__v");
  res.send(notifications);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const notification = new Notification({
    senderName: req.body.senderName,
    receiverName: req.body.receiverName,
    type: req.body.type,
    shown: req.body.shown,
  });
  await notification.save();
  res.send(notification);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    {
      senderName: req.body.senderName,
      receiverName: req.body.receiverName,
      type: req.body.type,
      shown: req.body.shown,
    },
    { new: true }
  );

  if (!notification)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(notification);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const notification = await Notification.findByIdAndRemove(req.params.id);

  if (!notification)
    return res
      .status(404)
      .send("The notification with the given ID was not found.");

  res.send(notification);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const notification = await Notification.findById(req.params.id).select(
    "-__v"
  );
  if (!notification)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(notification);
});

module.exports = router;

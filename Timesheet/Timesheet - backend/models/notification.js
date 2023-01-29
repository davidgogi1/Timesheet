const Joi = require("joi");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  receiverName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  shown: {
    type: Boolean,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

function validateNotification(notification) {
  const schema = {
    senderName: Joi.string().min(1).max(50).required(),
    receiverName: Joi.string().min(1).max(50).required(),
    type: Joi.string().min(1).max(50).required(),
    shown: Joi.boolean().required(),
  };

  return Joi.validate(notification, schema);
}

exports.notificationSchema = notificationSchema;
exports.Notification = Notification;
exports.validate = validateNotification;

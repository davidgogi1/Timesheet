const Joi = require("joi");
const mongoose = require("mongoose");

const Spreadsheet = mongoose.model(
  "Spreadsheets",
  new mongoose.Schema({
    value: {
      type: Number,
      //required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    project: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
  })
);

function validateSpreadsheet(spreadsheet) {
  const schema = {
    value: Joi.required(),
    email: Joi.string().required(),
    project: Joi.string().required(),
  };

  return Joi.validate(spreadsheet, schema);
}

exports.Spreadsheet = Spreadsheet;
exports.validate = validateSpreadsheet;

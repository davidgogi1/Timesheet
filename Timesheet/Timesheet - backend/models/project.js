const Joi = require("joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  creator: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  people: {
    type: Array,
    required: true,
    minlength: 0,
    maxlength: 50,
  },
});

const Project = mongoose.model("Project", projectSchema);

function validateProject(project) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    creator: Joi.string().min(1).max(50).required(),
    people: Joi.array().min(0).max(50).required(),
  };

  return Joi.validate(project, schema);
}

exports.projectSchema = projectSchema;
exports.Project = Project;
exports.validate = validateProject;

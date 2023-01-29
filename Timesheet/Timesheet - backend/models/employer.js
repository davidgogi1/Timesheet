const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  passwordRepeat: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  surname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  date: {
    type: String,
    required: true,
  },
});

employerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      password: this.password,
      passwordRepeat: this.passwordRepeat,
      name: this.name,
      surname: this.surname,
      date: this.date,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Employer = mongoose.model("Employer", employerSchema);

function validateEmployer(employer) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    passwordRepeat: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    date: Joi.string().required(),
  };

  return Joi.validate(employer, schema);
}

exports.Employer = Employer;
exports.validateEmployer = validateEmployer;

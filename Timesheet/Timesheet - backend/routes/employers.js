const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Employer, validateEmployer } = require("../models/employer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const employer = await Employer.find();
  res.send(employer);
});

router.post("/", async (req, res) => {
  const { error } = validateEmployer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let employer = await Employer.findOne({ email: req.body.email });
  if (employer) return res.status(400).send("Employer already registered.");

  employer = new Employer(
    _.pick(req.body, [
      "email",
      "password",
      "passwordRepeat",
      "name",
      "surname",
      "date",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  employer.password = await bcrypt.hash(employer.password, salt);
  await employer.save();

  const token = employer.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      _.pick(employer, [
        "_id",
        "email",
        "password",
        "passwordRepeat",
        "name",
        "surname",
        "date",
      ])
    );
});

module.exports = router;

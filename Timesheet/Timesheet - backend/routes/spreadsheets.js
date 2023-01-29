const { Spreadsheet, validate } = require("../models/spreadsheet");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const spreadsheets = await Spreadsheet.find().select("-__v");
  res.send(spreadsheets);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const spreadsheet = new Spreadsheet({
    value: req.body.value,
    email: req.body.email,
    project: req.body.project,
  });
  await spreadsheet.save();
  res.send(spreadsheet);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const spreadsheet = await Spreadsheet.findByIdAndUpdate(
    req.params.id,
    {
      value: req.body.value,
      email: req.body.email,
      project: req.body.project,
    },
    { new: true }
  );

  if (!spreadsheet)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(spreadsheet);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const spreadsheet = await Spreadsheet.findByIdAndRemove(req.params.id);

  if (!spreadsheet)
    return res
      .status(404)
      .send("The spreadsheet with the given ID was not found.");

  res.send(spreadsheet);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const spreadsheet = await Spreadsheet.findById(req.params.id).select("-__v");
  if (!spreadsheet)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(spreadsheet);
});

module.exports = router;

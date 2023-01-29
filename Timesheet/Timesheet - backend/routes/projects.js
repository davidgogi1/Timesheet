const { Project, validate } = require("../models/project");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await Project.find().select("-__v");
  res.send(projects);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const project = new Project({
    name: req.body.name,
    creator: req.body.creator,
    people: req.body.people,
  });
  await project.save();
  res.send(project);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      creator: req.body.creator,
      people: req.body.people,
    },
    { new: true }
  );

  if (!project)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(project);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const project = await Project.findByIdAndRemove(req.params.id);

  if (!project)
    return res.status(404).send("The project with the given ID was not found.");

  res.send(project);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const project = await Project.findById(req.params.id).select("-__v");
  if (!project)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(project);
});

module.exports = router;

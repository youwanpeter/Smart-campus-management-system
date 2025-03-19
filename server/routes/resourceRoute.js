const express = require("express");
const router = express.Router();
const Resource = require("../models/resource.js");

//Generate ID with 01, 02, 03 precedence format
const generateId = async () => {
  const resources = await Resource.find().sort({ id: 1 });
  let newId =
    resources.length > 0 ? parseInt(resources[resources.length - 1].id) + 1 : 1;
  return newId.toString().padStart(2, "0");
};

//Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources" });
  }
});

//Add resource
router.post("/", async (req, res) => {
  try {
    const {
      resource_name,
      acquired_date,
      return_date,
      acquired_person,
      resource_dep,
      resource_purpose,
      resource_status,
      resource_remarks,
    } = req.body;

    const acqDate = new Date(acquired_date);
    const retDate = new Date(return_date);
    const id = await generateId();

    const newResource = new Resource({
      id,
      resource_name,
      acquired_date: acqDate,
      return_date: retDate,
      acquired_person,
      resource_dep,
      resource_purpose,
      resource_status,
      resource_remarks,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding resource" });
  }
});

//Edit resource
router.put("/:id", async (req, res) => {
  try {
    const updatedResource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource" });
  }
});

//Delete resource
router.delete("/:id", async (req, res) => {
  try {
    await Resource.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource" });
  }
});

module.exports = router;

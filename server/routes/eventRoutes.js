const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

// Create Event
router.post("/create", async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      event_id: Date.now().toString(),
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Get All Events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Update Event
router.put("/update/:event_id", async (req, res) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { event_id: req.params.event_id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete Event
router.delete("/delete/:event_id", async (req, res) => {
  try {
    await Event.findOneAndDelete({ event_id: req.params.event_id });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;

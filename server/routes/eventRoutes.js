const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

// Middleware to set CORS headers
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
    console.log("Updating event with ID:", req.params.event_id);
    console.log("Request body:", req.body);

    const updatedEvent = await Event.findOneAndUpdate(
      { event_id: req.params.event_id },
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      console.log("Event not found with ID:", req.params.event_id);
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("Event updated successfully:", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete Event
router.delete("/delete/:event_id", async (req, res) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({
      event_id: req.params.event_id,
    });
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;

const express = require("express");
const multer = require("multer");
const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");
const router = express.Router();

<<<<<<< HEAD
// Middleware to set CORS headers
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Generate a unique event ID with a leading zero
let eventCounter = 0; // This could be replaced with a persistent storage solution
function generateEventID() {
  eventCounter++;
  return String(eventCounter).padStart(2, "0");
=======
// Ensure uploads directory exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
>>>>>>> 1d173788e667e8021fb2dc4d572f53658027a468
}

// Middleware to handle file upload using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Upload folder (ensure the folder exists)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Route to create a new event with image upload
router.post("/create", upload.single("event_image"), async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Log the form data
    console.log("Received file:", req.file); // Log file data

    // Check if event image file exists
    const eventImage = req.file ? `/uploads/${req.file.filename}` : "";

    // Create new event document
    const newEvent = new Event({
      ...req.body,
      event_image: eventImage, // Store image path if file is uploaded
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error during event creation:", error);
    res
      .status(500)
      .json({ error: "Failed to create event", message: error.message });
  }
});

// Route to update an event with image upload
router.put(
  "/update/:event_id",
  upload.single("event_image"),
  async (req, res) => {
    try {
      console.log("Received request body for update:", req.body); // Log the form data
      console.log("Received file for update:", req.file); // Log file data

      // Find the existing event to check if it has an image
      const existingEvent = await Event.findOne({
        event_id: req.params.event_id,
      });

      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Only update the image if a new file is uploaded
      // Otherwise, keep the existing image
      const updateData = { ...req.body };

      if (req.file) {
        updateData.event_image = `/uploads/${req.file.filename}`;

        // Delete the old image file if it exists
        if (existingEvent.event_image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            existingEvent.event_image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      // Update the event
      const updatedEvent = await Event.findOneAndUpdate(
        { event_id: req.params.event_id },
        updateData,
        { new: true }
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error during event update:", error);
      res
        .status(500)
        .json({ error: "Failed to update event", message: error.message });
    }
  }
);

// ADD THE DELETE ROUTE - This was missing from your original code
router.delete("/delete/:event_id", async (req, res) => {
  try {
    console.log("Deleting event with ID:", req.params.event_id);

    // Find the event to get the image path
    const event = await Event.findOne({ event_id: req.params.event_id });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete the image file if it exists
    if (event.event_image) {
      const imagePath = path.join(__dirname, "..", event.event_image);
      console.log("Checking for image at:", imagePath);

      if (fs.existsSync(imagePath)) {
        console.log("Deleting image file:", imagePath);
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the event from the database
    const result = await Event.findOneAndDelete({
      event_id: req.params.event_id,
    });

    if (!result) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res
      .status(500)
      .json({ error: "Failed to delete event", message: error.message });
  }
});

module.exports = router;

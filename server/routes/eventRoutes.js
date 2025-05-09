const express = require("express");
const multer = require("multer");
const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
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

// Helper function to generate sequential ID
async function generateSequentialId() {
  try {
    // Find the event with the highest ID
    const latestEvent = await Event.findOne().sort({ event_id: -1 });

    let nextId = 1; // Start with 1 if no events exist

    if (latestEvent && latestEvent.event_id) {
      // Extract the numeric part of the ID
      const currentId = parseInt(latestEvent.event_id, 10);

      // If the conversion worked, increment it
      if (!isNaN(currentId)) {
        nextId = currentId + 1;
      }
    }

    // Format with leading zeros (01, 02, 03, etc.)
    return nextId.toString().padStart(2, "0");
  } catch (error) {
    console.error("Error generating sequential ID:", error);
    throw error;
  }
}

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

    // Generate sequential ID for the new event
    const eventId = await generateSequentialId();

    // Create new event document
    const newEvent = new Event({
      ...req.body,
      event_id: eventId, // Set the generated sequential ID
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

// Route to delete an event
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

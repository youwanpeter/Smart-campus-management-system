const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    event_id: { type: String, unique: true, required: true }, // Unique event identifier
    event_name: { type: String, required: true }, // Name of the event
    event_description: { type: String, required: true }, // Event details
    event_date: { type: Date, required: true }, // Date of the event
    event_location: { type: String, required: true }, // Location of the event
    organizer_name: { type: String, required: true }, // Name of the organizer
    created_at: { type: Date, default: Date.now }, // Creation timestamp
    updated_at: { type: Date, default: Date.now }, // Last update timestamp
    status: {
      type: String,
      enum: ["Pending", "Published", "Unpublished"], // Event status
      default: "Pending",
    },
    event_image: { type: String, default: "" }, // Image URL (stored in Cloudinary, Firebase, or local server)
  },
  { timestamps: true } // Enables automatic createdAt & updatedAt fields
);

const EventModel = mongoose.model("Event", EventSchema);

module.exports = EventModel;

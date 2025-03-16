const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  event_id: { type: String, unique: true, required: true },
  event_name: { type: String, required: true },
  event_description: { type: String, required: true },
  event_date: { type: Date, required: true },
  event_location: { type: String, required: true },
  organizer_name: { type: String, required: true },
  event_image: { type: String },
  status: { type: String, default: "Pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    event_id: { type: String, unique: true, required: true },
    event_name: { type: String, required: true },
    event_description: { type: String, required: true },
    event_date: { type: Date, required: true },
    event_location: { type: String, required: true },
    organizer_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Published", "Unpublished"],
      default: "Pending",
    },
    event_image: { type: String, default: "" },
  },
  { timestamps: true }
);

const EventModel = mongoose.model('Event', EventSchema);
module.exports = EventModel;
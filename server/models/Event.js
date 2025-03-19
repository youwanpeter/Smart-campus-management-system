// Import mongoose
const mongoose = require("mongoose");

// Define the schema
const eventSchema = new mongoose.Schema({
  event_id: {
    type: String, // or use ObjectId, depending on your needs
    required: false, // make it optional if it's auto-generated
    default: function () {
      return new mongoose.Types.ObjectId(); // generates a new ObjectId if event_id is not provided
    },
  },
  event_name: {
    type: String,
    required: true,
  },
  event_description: {
    type: String,
    required: true,
  },
  event_date: {
    type: Date,
    required: true,
  },
  event_location: {
    type: String,
    required: true,
  },
  organizer_name: {
    type: String,
    required: true,
  },
  event_image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Published", "Unpublished"],
    default: "Pending", // Default status
  },
});

// Create the model from the schema
const Event = mongoose.model("Event", eventSchema);

// Export the model so it can be used elsewhere in the application
module.exports = Event;

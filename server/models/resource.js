const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  resource_name: String,
  acquired_date: String,
  return_date: String,
  acquired_person: String,
  resource_dep: String,
  resource_purpose: String,
  resource_status: String,
  resource_remarks: String,
  status: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Approved",
  },
  requested_by: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
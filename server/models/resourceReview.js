const mongoose = require("mongoose");

  const resourceReviewSchema = new mongoose.Schema({
    resource_name: { type: String, required: true },
    acquired_date: { type: String, required: true },
    return_date: { type: String, required: true },
    acquired_person: { type: String, required: true },
    resource_dep: { type: String, required: true },
    resource_purpose: { type: String, required: true },
    resource_status: { type: String, required: true },
    resource_remarks: { type: String },
    action_type: { type: String, enum: ["add", "edit", "delete"], required: true },
    original_id: { type: String },
    requested_by: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    created_at: { type: Date, default: Date.now },
    processed_at: { type: Date },
  });

const ResourceReview = mongoose.model("ResourceReview", resourceReviewSchema);

module.exports = ResourceReview;
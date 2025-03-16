const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, 
  resource_name: { type: String, required: true },
  acquired_date: { type: Date, required: true }, 
  return_date: { type: Date, required: true }, 
  acquired_person: { type: String, required: true },
  resource_dep: { type: String, required: true },
  resource_purpose: { type: String, required: true },
  resource_remarks: { type: String, required: true },
});

const ResourceModel = mongoose.model("Resource", ResourceSchema);

module.exports = ResourceModel;

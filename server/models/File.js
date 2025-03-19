// models/File.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    lecturerName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
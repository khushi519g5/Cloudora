const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String, // will store S3 URL later
    required: true
  },
  uploadedBy: {
    type: String, // teacher ID (no foreign key, as you prefer)
    required: true
  },
  roleAccess: {
    type: String, // student / teacher
    default: "student"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resource", resourceSchema);
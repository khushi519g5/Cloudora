const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  uploadedBy: String
}, { timestamps: true });

module.exports = mongoose.model("Document", schema);
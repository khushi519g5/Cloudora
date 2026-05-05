// models/Chunk.js
const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document"
  },
  text: String,
  embedding: [Number],
  chunkIndex: Number
});

module.exports = mongoose.model("Chunk", chunkSchema);
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    message: String,
    type: {
      type: String,
      enum: ["upload", "view", "download", "announcement"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
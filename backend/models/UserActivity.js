const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    category: {
      type: String,
      default: "general",
    },

    action: {
      type: String,
      enum: ["view", "download"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
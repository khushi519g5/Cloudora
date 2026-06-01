const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: "ALL_USERS",
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
});

module.exports = router;
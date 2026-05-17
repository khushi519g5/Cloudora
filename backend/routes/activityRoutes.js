const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// GET ALL ACTIVITY
router.get("/", async (req, res) => {
  try {
    const data = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  saveActivity,
  getRecommendations,
} = require("../controllers/recommendationController");

router.post("/track", saveActivity);
router.get("/recommendations", getRecommendations);

module.exports = router;
const router = require("express").Router();
const { ingest, query } = require("../rag");
const Resource = require("../models/Resource");

// --------------------
// INGEST
// --------------------
router.post("/ingest", async (req, res) => {
  console.log("🔥 INGEST HIT");
  try {
    const doc = await Resource.findById(req.body.resourceId);

    if (!doc) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const count = await ingest(doc, doc._id);

    res.json({ message: "done", chunks: count });
  } catch (err) {
    console.log("🔥 INGEST ROUTE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// ASK
// --------------------
router.post("/ask", async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question || !documentId) {
      return res.status(400).json({
        error: "question and documentId required",
      });
    }

    const result = await query(question, documentId);

    res.json(result);
  } catch (err) {
    console.log("🔥 ASK ROUTE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
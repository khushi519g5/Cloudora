const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");

// CREATE RESOURCE
router.post("/upload", async (req, res) => {
  try {
    const { title, description, subject, fileUrl, uploadedBy } = req.body;

    const newResource = new Resource({
      title,
      description,
      subject,
      fileUrl,
      uploadedBy
    });

    await newResource.save();

    res.status(201).json({ message: "Resource uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL RESOURCES
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE RESOURCE
router.delete("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// UPDATE RESOURCE
router.put("/:id", async (req, res) => {
  try {
    const { title, description, subject, roleAccess } = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        subject,
        roleAccess
      },
      { new: true } // returns updated document
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({
      message: "Resource updated successfully",
      updatedResource
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
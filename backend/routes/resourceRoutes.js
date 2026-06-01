const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const createNotification = require("../utils/createNotification");



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
     // ✅ ADD NOTIFICATION HERE
    await createNotification({
      title: "New Document Uploaded",
      message: `${newResource.title} is now available`,
      type: "upload",
    });


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
    const { title, description, subject } = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        subject,
      },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
     await createNotification({
      title: "Document Updated",
      message: `${updatedResource.title} has been updated`,
      type: "update",
    });

    res.json({
      message: "Resource updated successfully",
      updatedResource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // increase views
    resource.views = (resource.views || 0) + 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/download/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();

    res.json({ message: "Download counted", fileUrl: resource.fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
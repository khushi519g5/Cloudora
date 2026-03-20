const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET CHAT BETWEEN 2 USERS
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 }); // oldest → latest

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ SAVE MESSAGE
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
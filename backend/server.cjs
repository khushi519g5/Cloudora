require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/admin");
const resourceRoutes = require("./routes/resourceRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/messages", messageRoutes);

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ JOIN USER ROOM (IMPORTANT)
  socket.on("join_user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // CHAT
   

socket.on("send_message", async (data) => {
  const { senderId, receiverId, message } = data;

  try {
    // ✅ SAVE TO DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    // ✅ SEND TO RECEIVER
    io.to(receiverId).emit("receive_message", newMessage);

    // ✅ ALSO SEND BACK TO SENDER (IMPORTANT)
    io.to(senderId).emit("receive_message", newMessage);

  } catch (err) {
    console.log(err);
  }
});

  // LIVE UPDATES
  socket.on("send_update", (data) => {
    io.to(data.roomId).emit("receive_update", data);
  });

  // COLLAB (Typing Indicator)
  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("user_typing", socket.id);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
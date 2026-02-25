require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "mittalkhushi97@gmail.com" });
    if (existing) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "mittalkhushi97@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });

    console.log("Admin created successfully:", admin);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
// utils/createNotification.js
const Notification = require("../models/Notification");

const createNotification = async ({ title, message, type }) => {
  await Notification.create({
    userId: "ALL_USERS",
    title,
    message,
    type,
  });
};

module.exports = createNotification;
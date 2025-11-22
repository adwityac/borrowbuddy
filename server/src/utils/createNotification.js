const Notification = require("../models/Notification");

async function createNotification(userId, message, type) {
  try {
    await Notification.create({
      user: userId,
      message,
      type
    });
  } catch (err) {
    console.error("Notification error:", err);
  }
}

module.exports = createNotification;

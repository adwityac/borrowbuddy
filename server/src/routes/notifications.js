const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/authMiddleware");

// Get all notifications for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Get unread notification count
router.get("/unread-count", requireAuth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.userId,
      seen: false,
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notification count" });
  }
});

// Mark all as read
router.post("/read-all", requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId },
      { seen: true }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating notifications" });
  }
});

// Clear all notifications
router.delete("/clear", requireAuth, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.userId });
    res.json({ message: "All notifications removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing notifications" });
  }
});

// Mark one as read
router.post("/:id/read", requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { seen: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Marked as read", notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating notification" });
  }
});

// Delete one notification
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting notification" });
  }
});

module.exports = router;

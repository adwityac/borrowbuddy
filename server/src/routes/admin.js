const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Request = require("../models/Request");

const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");


// GET ALL USERS
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET ALL ITEMS
router.get("/items", requireAuth, requireAdmin, async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// GET ALL REQUESTS
router.get("/requests", requireAuth, requireAdmin, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("item")
      .populate("requester", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// GET ADMIN DASHBOARD STATS
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [users, items, requests, pendingRequests] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Request.countDocuments(),
      Request.countDocuments({ status: "pending" }),
    ]);

    res.json({ users, items, requests, pendingRequests });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// DELETE ANY ITEM (ADMIN)
router.delete("/items/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await Request.deleteMany({ item: req.params.id });
    res.json({ message: "Item deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

// BAN USER
router.post("/users/:id/ban", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: "You cannot ban yourself" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role: "banned" }, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User banned" });
  } catch (err) {
    res.status(500).json({ message: "Failed to ban user" });
  }
});

// UNBAN USER
router.post("/users/:id/unban", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: "user" }, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User unbanned" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unban user" });
  }
});

module.exports = router;

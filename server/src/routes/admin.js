const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Request = require("../models/Request");

const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");


// GET ALL USERS
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

// GET ALL ITEMS
router.get("/items", requireAuth, requireAdmin, async (req, res) => {
  const items = await Item.find().populate("owner", "name email");
  res.json(items);
});

// GET ALL REQUESTS
router.get("/requests", requireAuth, requireAdmin, async (req, res) => {
  const requests = await Request.find()
    .populate("item")
    .populate("requester", "name email")
    .populate("owner", "name email");

  res.json(requests);
});

// DELETE ANY ITEM (ADMIN)
router.delete("/items/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

// BAN USER
router.post("/users/:id/ban", requireAuth, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "banned" });
    res.json({ message: "User banned" });
  } catch (err) {
    res.status(500).json({ message: "Failed to ban user" });
  }
});

// UNBAN USER
router.post("/users/:id/unban", requireAuth, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "user" });
    res.json({ message: "User unbanned" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unban user" });
  }
});

module.exports = router;
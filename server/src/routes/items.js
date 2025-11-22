const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Item = require("../models/Item");

// storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 📌 GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load items" });
  }
});

// 📌 GET SINGLE ITEM — REQUIRED BY ItemDetailPage
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to load item" });
  }
});

// 📌 POST NEW ITEM
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const item = await Item.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.user.id,
      availability: "available",
      imageUrl: `http://localhost:4000/uploads/${req.file.filename}`,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload item" });
  }
});

module.exports = router;

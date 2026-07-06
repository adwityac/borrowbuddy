const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Item = require("../models/Item");
const Request = require("../models/Request");
const { requireAuth } = require("../middleware/authMiddleware");

const uploadsDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

function getBaseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
}

function serializeItem(item) {
  const obj = item.toObject ? item.toObject() : item;
  return {
    ...obj,
    owner: obj.owner?._id ? obj.owner._id.toString() : obj.owner?.toString?.() || obj.owner,
    ownerInfo: obj.owner?.name ? {
      id: obj.owner._id,
      name: obj.owner.name,
      email: obj.owner.email,
    } : undefined,
  };
}

//  GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.owner) {
      filter.owner = req.query.owner;
    }

    if (req.query.availability) {
      filter.availability = req.query.availability;
    }

    const items = await Item.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(items.map(serializeItem));
  } catch (err) {
    res.status(500).json({ message: "Failed to load items" });
  }
});

// GET ITEMS CREATED BY LOGGED-IN USER
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    res.json(items.map(serializeItem));
  } catch (err) {
    res.status(500).json({ message: "Failed to load your items" });
  }
});

//  GET SINGLE ITEM 
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name email");

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(serializeItem(item));
  } catch (err) {
    res.status(500).json({ message: "Failed to load item" });
  }
});

//  POST NEW ITEM
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Item image is required" });
    }

    const item = await Item.create({
      title,
      description,
      owner: req.user.userId,
      availability: "available",
      imageUrl: `${getBaseUrl(req)}/uploads/${req.file.filename}`,
    });

    res.status(201).json(serializeItem(item));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload item" });
  }
});

// UPDATE AN ITEM OWNED BY LOGGED-IN USER
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowed = ["title", "description", "availability"];
    for (const field of allowed) {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    }

    await item.save();
    res.json(serializeItem(item));
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
});

// DELETE AN ITEM OWNED BY LOGGED-IN USER
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Request.deleteMany({ item: item._id });
    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: {
    type: String,
    enum: ["available", "requested", "borrowed", "unavailable"],
    default: "available"
  },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);


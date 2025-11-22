const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: { type: String, default: "available" },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);


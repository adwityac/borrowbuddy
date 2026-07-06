const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "returned"],
    default: "pending",
  },
}, { timestamps: true });

requestSchema.index({ requester: 1, createdAt: -1 });
requestSchema.index({ owner: 1, createdAt: -1 });
requestSchema.index({ item: 1, requester: 1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);

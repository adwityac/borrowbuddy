const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["request", "approved", "rejected", "returned", "admin"],
      default: "request",
    },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.virtual("read").get(function read() {
  return this.seen;
});

notificationSchema.set("toJSON", { virtuals: true });
notificationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Notification", notificationSchema);

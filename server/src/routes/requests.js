const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const Item = require("../models/Item");
const { requireAuth } = require("../middleware/authMiddleware");

const createNotification = require("../utils/createNotification");


// CREATE BORROW REQUEST
router.post("/:itemId", requireAuth, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.owner.toString() === req.user.userId)
      return res.status(400).json({ message: "You cannot request your own item." });

    if (item.availability !== "available") {
      return res.status(400).json({ message: "This item is not available right now." });
    }

    // Prevent duplicate requests
    const existing = await Request.findOne({
      item: itemId,
      requester: req.user.userId,
      status: { $in: ["pending", "approved"] }
    });

    if (existing)
      return res.status(400).json({ message: "You already have an active request for this item." });

    const newRequest = await Request.create({
      item: itemId,
      requester: req.user.userId,
      owner: item.owner,
    });

    //  Notify item owner
    await createNotification(
      item.owner,
      `Someone requested your item: ${item.title}`,
      "request"
    );

    const populated = await newRequest.populate([
      { path: "item" },
      { path: "owner", select: "name email" },
      { path: "requester", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating request" });
  }
});


// GET REQUESTS MADE BY LOGGED-IN USER
router.get("/mine", requireAuth, async (req, res) => {
  const requests = await Request.find({ requester: req.user.userId })
    .populate("item")
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
});


// GET REQUESTS FOR ITEMS YOU OWN (OWNER DASHBOARD)
router.get("/incoming", requireAuth, async (req, res) => {
  const requests = await Request.find({ owner: req.user.userId })
    .populate("item")
    .populate("requester", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
});


// APPROVE REQUEST
router.post("/:requestId/approve", requireAuth, async (req, res) => {
  try {
    const reqId = req.params.requestId;
    const request = await Request.findById(reqId).populate("item");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Only pending requests can be approved" });
    if (!request.item || request.item.availability !== "available")
      return res.status(400).json({ message: "Item is not available" });

    request.status = "approved";
    await request.save();

    // update item availability
    await Item.findByIdAndUpdate(request.item._id, { availability: "borrowed" });

    await Request.updateMany(
      { item: request.item._id, _id: { $ne: request._id }, status: "pending" },
      { status: "rejected" }
    );

    //  Notify requester
    await createNotification(
      request.requester,
      `Your request for "${request.item.title}" was approved!`,
      "approved"
    );

    res.json(await request.populate("requester", "name email"));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error approving request" });
  }
});


// REJECT REQUEST
router.post("/:requestId/reject", requireAuth, async (req, res) => {
  try {
    const reqId = req.params.requestId;
    const request = await Request.findById(reqId).populate("item");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Only pending requests can be rejected" });

    request.status = "rejected";
    await request.save();

    //  Notify requester
    await createNotification(
      request.requester,
      `Your request for "${request.item.title}" was rejected.`,
      "rejected"
    );

    res.json(request);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error rejecting request" });
  }
});


// MARK REQUEST AS RETURNED
router.post("/:requestId/returned", requireAuth, async (req, res) => {
  try {
    const reqId = req.params.requestId;
    const request = await Request.findById(reqId).populate("item");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "approved")
      return res.status(400).json({ message: "Only approved requests can be marked returned" });

    request.status = "returned";
    await request.save();

    await Item.findByIdAndUpdate(request.item._id, {
      availability: "available"
    });

    //  Notify requester
    await createNotification(
      request.requester,
      `The item "${request.item.title}" has been marked as returned.`,
      "returned"
    );

    res.json({ message: "Item marked as returned", request });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error marking returned" });
  }
});

// CANCEL A REQUEST MADE BY LOGGED-IN USER
router.delete("/:requestId", requireAuth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.requester.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Only pending requests can be cancelled" });

    await request.deleteOne();
    res.json({ message: "Request cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error cancelling request" });
  }
});

module.exports = router;

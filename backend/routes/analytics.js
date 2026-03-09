const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Dashboard Statistics
router.get("/dashboard", async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const inProgressComplaints = await Complaint.countDocuments({ status: "In Progress" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });

    // Category-wise count
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Ward-wise count
    const wardStats = await Complaint.aggregate([
      { $group: { _id: "$ward", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Status distribution
    const statusStats = [
      { status: "Pending", count: pendingComplaints },
      { status: "In Progress", count: inProgressComplaints },
      { status: "Resolved", count: resolvedComplaints }
    ];

    // Priority distribution
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      categoryStats,
      wardStats,
      statusStats,
      priorityStats
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Complaint Hotspots
router.get("/hotspots", async (req, res) => {
  try {
    const hotspots = await Complaint.aggregate([
      {
        $group: {
          _id: {
            ward: "$ward",
            category: "$category"
          },
          count: { $sum: 1 },
          complaints: { $push: { title: "$title", location: "$location" } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Department Performance
router.get("/department-performance", async (req, res) => {
  try {
    const departments = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          totalComplaints: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Map Data
router.get("/map-data", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      "location.latitude": { $exists: true },
      "location.longitude": { $exists: true }
    }).select("title category status location ward priority");

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

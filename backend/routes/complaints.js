const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");
const { detectImageProblem } = require("../services/imageDetection");

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// AI Categorization Helper
const categorizeComplaint = (title, description) => {
  const text = (title + " " + description).toLowerCase();
  
  if (text.includes("road") || text.includes("pothole") || text.includes("footpath")) {
    return { category: "Roads", department: "Road Department" };
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("dustbin")) {
    return { category: "Waste Management", department: "Sanitation Department" };
  } else if (text.includes("water") || text.includes("pipeline") || text.includes("leakage")) {
    return { category: "Water Supply", department: "Water Department" };
  } else if (text.includes("light") || text.includes("electricity") || text.includes("power")) {
    return { category: "Electricity", department: "Electricity Department" };
  } else if (text.includes("drain") || text.includes("flood") || text.includes("waterlog")) {
    return { category: "Drainage", department: "Drainage Department" };
  }
  return { category: "Roads", department: "General" };
};

// Priority Detection
const detectPriority = (title, description) => {
  const text = (title + " " + description).toLowerCase();
  const highPriorityKeywords = ["hospital", "school", "accident", "emergency", "urgent", "danger"];
  
  for (let keyword of highPriorityKeywords) {
    if (text.includes(keyword)) {
      return "High";
    }
  }
  return "Medium";
};

// Create Complaint
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { userId, title, description, category, location, ward } = req.body;

    // AI Categorization
    const aiCategory = categorizeComplaint(title, description);
    const priority = detectPriority(title, description);

    // AI Image Detection
    let aiImageAnalysis = null;
    if (req.file) {
      console.log('Image uploaded:', req.file.filename);
      const imagePath = path.join(__dirname, '../uploads', req.file.filename);
      console.log('Image path:', imagePath);
      aiImageAnalysis = await detectImageProblem(imagePath);
      console.log('AI Detection Result:', aiImageAnalysis);
    } else {
      console.log('No image uploaded');
    }

    const complaint = new Complaint({
      userId,
      title,
      description,
      category: category || aiCategory.category,
      image: req.file ? req.file.filename : "",
      location: JSON.parse(location || "{}"),
      ward,
      priority,
      department: aiCategory.department,
      aiDetection: aiImageAnalysis
    });

    console.log('💾 Saving complaint with AI detection:', aiImageAnalysis);
    await complaint.save();
    console.log('✅ Complaint saved successfully');

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: complaint._id,
      category: complaint.category,
      priority: complaint.priority,
      aiDetection: aiImageAnalysis
    });
  } catch (error) {
    console.error('❌ Error creating complaint:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Complaints by User
router.get("/user/:userId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Single Complaint
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("userId", "name email phone");
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update Complaint Status
router.put("/update/:id", async (req, res) => {
  try {
    const { status, department } = req.body;
    
    const updateData = { status, department, updatedAt: Date.now() };
    if (status === "Resolved") {
      updateData.resolvedAt = Date.now();
    }
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Complaint
router.delete("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

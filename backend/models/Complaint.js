const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Roads", "Waste Management", "Water Supply", "Electricity", "Drainage"]
  },
  image: {
    type: String,
    default: ""
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  ward: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  department: {
    type: String,
    default: ""
  },
  aiDetection: {
    detected: Boolean,
    issue: String,
    confidence: Number,
    rawPredictions: Array
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);

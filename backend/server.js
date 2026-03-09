const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { loadModel } = require("./services/imageDetection");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smart-crm")
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.log("❌ Database Connection Error:", err));

// Routes
const userRoutes = require("./routes/users");
const complaintRoutes = require("./routes/complaints");
const analyticsRoutes = require("./routes/analytics");

app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Smart Public Service CRM API Running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await loadModel();
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { performFaceRecognition } = require("./utils/faceRecognition");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

// ✅ Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: "10mb" })); // Parse JSON data with increased limit

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.use("/api/auth", authRoutes);         // Authentication routes (Login/Register)
app.use("/api/complaints", complaintRoutes); // Complaint routes

// ✅ Image Upload Route
app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        const { buffer, mimetype } = req.file;

        // Validate image format
        if (!["image/jpeg", "image/png"].includes(mimetype)) {
            return res.status(400).json({ message: "❌ Unsupported image format. Please upload a JPEG or PNG image." });
        }

        // Perform face recognition with the uploaded image
        const bestMatch = await performFaceRecognition(buffer, mimetype);

        res.json({ message: "✅ Image uploaded successfully", bestMatch });
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        res.status(500).json({ message: "❌ Error uploading image", error: error.message });
    }
});

// ✅ Face Recognition Route
app.post("/api/scan", async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ message: "❌ No image provided." });

        console.log("📷 Received image for face recognition...");

        // Perform face recognition
        const bestMatch = await performFaceRecognition(image);

        console.log("🔍 Face Recognition Result:", bestMatch);

        // Send recognition result back to client
        return res.json({ bestMatch });
    } catch (error) {
        console.error("❌ Error in /api/scan:", error);
        res.status(500).json({ message: "❌ Error processing face recognition", error: error.message });
    }
});

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("🚀 Searching Lost Person API is running...");
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));



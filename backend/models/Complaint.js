const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Lost person’s name
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    lastSeenLocation: { type: String, required: true },
    dateMissing: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // URL to the uploaded image
    status: { type: String, enum: ["Lost", "Found"], default: "Lost" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
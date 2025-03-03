const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    location: { type: String, required: true },
    password: { type: String, required: true }, // Store password as plain text
    role: { type: String, enum: ["User", "Public"], default: "User" }
});

// ❌ Remove password hashing logic
// ❌ Remove password comparison method

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

// Define the schema for the person
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    lastSeenLocation: { type: String, required: true },
    dateMissing: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    description: { type: String, required: true },
    faceDescriptor: { type: Array, required: true }, // This could store a face descriptor for matching
    image: { type: String, required: true }, // The image can be stored as a base64 string or URL
});

// Create a model based on the schema
const Person = mongoose.model("Person", personSchema);

module.exports = { Person };

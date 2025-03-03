const faceapi = require("face-api.js");
const canvas = require("canvas");
const path = require("path");
const fs = require("fs");
require("@tensorflow/tfjs");

// Set up face-api.js with Node.js canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Define model directory
const modelPath = path.join(__dirname, "../models");
console.log("📂 Loading models from:", modelPath); // Debugging log

// Load models before using them
const loadModels = async () => {
    try {
        console.log("🔄 Loading face recognition models...");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        console.log("✅ Models loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading models:", error);
        throw new Error("Model loading failed!");
    }
};

// Perform Face Recognition and return the image with detected face box
const performFaceRecognition = async (imageBuffer, mimetype) => {
    try {
        await loadModels(); // Ensure models are loaded

        // Check if the mime type is supported
        if (!['image/jpeg', 'image/png'].includes(mimetype)) {
            console.log("❌ Unsupported image format.");
            return { message: "❌ Unsupported image format. Please upload a JPEG or PNG image." };
        }

        // Load the image directly from the buffer (no need for temp files)
        const img = await canvas.loadImage(imageBuffer);

        // Perform face detection
        const detections = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections) {
            console.log("❌ No face detected.");
            return { message: "❌ No Match Found" };
        }

        // Draw face detection results on the image
        const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors("detected", [detections.descriptor]);
        const faceImage = faceapi.createCanvasFromMedia(img);
        faceapi.draw.drawDetections(faceImage, detections); // Draw face bounding box
        faceapi.draw.drawFaceLandmarks(faceImage, detections); // Draw face landmarks

        // Get the image as a base64 string
        const faceImageBase64 = faceImage.toDataURL();

        console.log("✅ Face detected successfully!");
        return { message: "✅ Match Found!", image: faceImageBase64 };

    } catch (error) {
        console.error("❌ Error in face recognition:", error);
        return { message: "❌ Error in processing" };
    }
};

module.exports = { performFaceRecognition };

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    image: { type: String, required: true } // Base64 stored image
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = { Image };

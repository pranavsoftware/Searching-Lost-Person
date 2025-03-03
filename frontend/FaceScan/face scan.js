async function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select an image file.");
        return;
    }

    // Show the "Processing..." status message
    document.getElementById("status-message").innerText = "Processing... Please wait.";

    // Create FormData object
    const formData = new FormData();
    formData.append("image", file);

    // Send the image to the server
    try {
        const response = await fetch("http://127.0.0.1:5000/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.message === "✅ Image uploaded successfully") {
            // Show the result message and image with face detection
            document.getElementById("message").innerText = data.bestMatch.message;
            document.getElementById("result").src = data.bestMatch.image;
            document.getElementById("result-message").innerText = "Face detected successfully!";
            document.getElementById("result-section").style.display = "block"; // Show the result section
        } else {
            document.getElementById("message").innerText = data.message;
            document.getElementById("result-section").style.display = "none"; // Hide the result section
        }
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        document.getElementById("message").innerText = "❌ Error uploading image.";
        document.getElementById("result-section").style.display = "none"; // Hide the result section
    } finally {
        // Clear the "Processing..." status after receiving the response
        document.getElementById("status-message").innerText = "";
    }
}

const apiBaseURL = "http://localhost:5000/api"; // Adjust when hosting

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    preventBackNavigation();

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
        fetchComplaints(userId);
    }

    const complaintForm = document.getElementById("complaintForm");
    if (complaintForm) {
        complaintForm.addEventListener("submit", submitComplaint);
    }
});

// ✅ Check authentication status
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("❌ Unauthorized! Please log in.");
        window.location.href = "../Login/";
    }
}

// 🔄 Prevent back navigation after logout
function preventBackNavigation() {
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.pushState(null, null, location.href);
}

// 🚪 Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("✅ Logged out successfully!");
    window.location.href = "../Login/";
}

// 📷 Convert image to Base64 format
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// 📩 Submit complaint
async function submitComplaint(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("❌ Unauthorized! Please log in.");
        window.location.href = "../Login/";
        return;
    }

    const userId = localStorage.getItem("userId");
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const lastSeenLocation = document.getElementById("location").value;
    const dateMissing = new Date(document.getElementById("dateMissing").value);
    const contactNumber = document.getElementById("contact").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("imageFile").files[0];

    let imageBase64 = "";
    if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile);
    }

    const complaintData = {
        user: userId,
        name,
        age,
        gender,
        lastSeenLocation,
        dateMissing,
        contactNumber,
        description,
        image: imageBase64,
        status: "Lost",
    };

    try {
        const res = await fetch(`${apiBaseURL}/complaints`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(complaintData),
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Complaint submitted successfully!");
            fetchComplaints(userId);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

// 📜 Fetch complaints from API and populate table
async function fetchComplaints(userId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Unauthorized! Please log in.");
            window.location.href = "../Login/";
            return;
        }

        const res = await fetch(`${apiBaseURL}/complaints`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch complaints");

        const data = await res.json();
        const complaintsTableBody = document.getElementById("complaintsTableBody");

        if (complaintsTableBody) {
            complaintsTableBody.innerHTML = "";

            const userComplaints = data.filter(complaint => complaint.user === userId);
            userComplaints.forEach((complaint) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${complaint.name}</td>
                    <td>${complaint.age}</td>
                    <td>${complaint.gender}</td>
                    <td>${complaint.description}</td>
                    <td>${complaint.lastSeenLocation}</td>
                    <td>${new Date(complaint.dateMissing).toLocaleDateString()}</td>
                    <td>${complaint.contactNumber}</td>
                    <td><img src="${complaint.image}" alt="Image" width="50"></td>
                    <td><button class="delete-btn" data-id="${complaint._id}">❌ Delete</button></td>
                `;
                complaintsTableBody.appendChild(row);
            });

            // Attach event listeners to delete buttons
            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", async (e) => {
                    const complaintId = e.target.getAttribute("data-id");

                    const res = await fetch(`${apiBaseURL}/complaints/${complaintId}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (res.ok) {
                        alert("✅ Complaint deleted successfully!");
                        fetchComplaints(userId);
                    } else {
                        alert("❌ Error deleting complaint.");
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error fetching complaints:", error);
    }
}

const apiBaseURL = "http://localhost:5000/api"; // Adjust when hosting
console.log("data")
const token = localStorage.getItem("token");

// If no token, redirect to login and prevent back navigation
if (!token) {
    alert("❌ Unauthorized! Please log in.");
    window.location.href = "../Login/";
}
// Convert image file to Base64 format
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// Function to check authentication status
function checkAuth() {
    console.log("Checking authentication status...");
    const token = localStorage.getItem("token");

    // If no token, redirect to login and prevent back navigation
    if (!token) {
        alert("❌ Unauthorized! Please log in.");
        window.location.href = "../Login/";
    }
}

// Prevent back navigation after logout
function preventBackNavigation() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
    };
}

// Run authentication check on page load
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("user dashboard")) {
        checkAuth(); // Restrict access unless logged in
        preventBackNavigation(); // Prevent back button navigation
    }

    // User Signup
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const mobile = document.getElementById("mobile").value;
            const location = document.getElementById("location").value;
            const password = document.getElementById("password").value;

            const res = await fetch(`${apiBaseURL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, mobile, location, password }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("✅ Registration successful! Please login.");
                window.location.href = "../Login/";
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        });
    }

    // User Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const res = await fetch(`${apiBaseURL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                alert("✅ Login successful!");
                window.location.href = "../user dashboard/";
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        });
    }

    // Logout function
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            alert("✅ Logged out successfully!");

            // Prevent back navigation after logout
            window.location.href = "../Login/";
            setTimeout(() => {
                history.pushState(null, null, location.href);
            }, 0);
        });
    }

    // Fetch complaints if on the dashboard page
    const userId = localStorage.getItem("userId");
    if (window.location.pathname.includes("user dashboard") && userId) {
        fetchComplaints(userId);
    }

    // Handle complaint form submission
    const complaintForm = document.getElementById("complaintForm");
    if (complaintForm) {
        complaintForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");
            if (!token) {
                alert("❌ Unauthorized! Please log in.");
                window.location.href = "../Login/";
                return;
            }

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

            console.log("Submitting Complaint:", complaintData);

            const res = await fetch(`${apiBaseURL}/complaints`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(complaintData),
            });

            const data = await res.json();
            console.log("Server Response:", data);

            if (res.ok) {
                alert("✅ Complaint submitted successfully!");
                fetchComplaints(userId);
            } else {
                alert(`❌ Error: ${data.message || "Something went wrong"}`);
            }
        });
    }
});

// Fetch complaints from API and populate table
async function fetchComplaints(userId) {
    try {
        const token = localStorage.getItem("token");

        // Redirect if not authenticated
        if (!token) {
            alert("❌ Unauthorized! Please log in.");
            window.location.href = "../Login/";
            return;
        }

        const res = await fetch(`${apiBaseURL}/complaints`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch complaints");
        }

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
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    const data = await res.json();
                    if (res.ok) {
                        alert("✅ Complaint deleted successfully!");
                        fetchComplaints(userId);
                    } else {
                        alert(`❌ Error: ${data.message}`);
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error fetching complaints:", error);
    }                             
}

let complaintsData = []; // ✅ Declare globally so both functions can access it

// ✅ Move renderComplaints outside so it's accessible globally
function renderComplaints(complaints) {
    const complaintsContainer = document.getElementById("complaints-container");
    complaintsContainer.innerHTML = ""; // Clear existing content
    complaints.forEach((complaint) => {
        const card = document.createElement("div");
        card.classList.add("complaint-card");

        card.innerHTML = `
            <img src="${complaint.image}" alt="Missing Person">
            <h3>${complaint.name} (Age: ${complaint.age})</h3>
            <p><strong>Gender:</strong> ${complaint.gender}</p>
            <p><strong>Last Seen:</strong> ${complaint.lastSeenLocation}</p>
            <p><strong>Date Missing:</strong> ${new Date(complaint.dateMissing).toDateString()}</p>
            <p><strong>Contact:</strong> ${complaint.contactNumber}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Status:</strong> ${complaint.status}</p>
        `;

        complaintsContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const postComplaintButton = document.getElementById("post-complaint");
    const searchBar = document.getElementById("search-bar");

    // Redirect to login when clicking "Post Complaint"
    postComplaintButton.addEventListener("click", function () {
        window.location.href = "../Login/";
    });

    // Fetch complaints from the server
    async function fetchComplaints() {
        try {
            const response = await fetch("http://localhost:5000/api/complaints");
            complaintsData = await response.json(); // ✅ Update global variable
            renderComplaints(complaintsData);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    }

    // Fetch complaints when the page loads
    fetchComplaints();
});

// ✅ Move filter function outside so it can access complaintsData
function filterComplaints() {
    const searchBar = document.getElementById("search-bar");
    const searchTerm = searchBar.value.toLowerCase();

    const filteredComplaints = complaintsData.filter((complaint) =>
        complaint.name.toLowerCase().includes(searchTerm)
    );

    renderComplaints(filteredComplaints); // ✅ Now it works because it's global
}

// ✅ Ensure the search bar is listening for input events
document.getElementById("search-bar").addEventListener("input", filterComplaints);

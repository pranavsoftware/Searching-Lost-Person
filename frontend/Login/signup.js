const apiBaseURL = "http://localhost:5000/api"; // Adjust when hosting

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const mobile = document.getElementById("mobile").value;
            const location = document.getElementById("location").value;
            const password = document.getElementById("password").value;

            try {
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
                    throw new Error(data.message);
                }
            } catch (error) {
                alert(`❌ Error: ${error.message}`);
            }
        });
    }
});

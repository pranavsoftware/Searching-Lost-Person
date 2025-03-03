const apiBaseURL = "http://localhost:5000/api"; // Adjust when hosting

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
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
                    throw new Error(data.message);
                }
            } catch (error) {
                alert(`❌ Error: ${error.message}`);
            }
        });
    }
});

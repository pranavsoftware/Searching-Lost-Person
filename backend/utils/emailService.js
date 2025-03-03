const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or App Password
    },
});

// Function to send a registration confirmation email
const sendRegistrationEmail = async (userEmail, userName) => {
    try {
        await transporter.sendMail({
            from: `"Lost Person Search" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🎉 Registration Successful!",
            html: `<h2>Welcome, ${userName}!</h2>
                   <p>Thank you for registering on our platform. You can now log in and report/search for missing persons.</p>
                   <p>Best Regards,<br>Lost Person Search Team</p>`,
        });
        console.log(`✅ Registration email sent to ${userEmail}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};

module.exports = sendRegistrationEmail;

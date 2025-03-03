const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract only the token

    if (!token) {
        return res.status(401).json({ message: "❌ Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        req.user = decoded;
        next();  // Continue to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: "❌ Invalid token." }); // Use 403 for forbidden access
    }
};

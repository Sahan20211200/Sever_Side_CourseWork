const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authentication token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        req.user = decoded;
        console.log(`✅ JWT Validated: User ${req.user.id}`);
        next();
    });
};

module.exports = { authMiddleware };

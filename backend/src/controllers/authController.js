const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const crypto = require("crypto");
require("dotenv").config();

const register = (req, res) => {
    const { username, password, role, adminSecret } = req.body;

    let userRole = "user";

    if (role === "admin") {
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ error: "Invalid admin secret key" });
        }
        userRole = "admin";
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Error hashing password" });
        }

        createUser(username, hash, userRole, (err) => {
            if (err) {
                console.error("User creation failed:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: `User registered successfully as ${userRole}` });
        });
    });
};


const login = (req, res) => {
    const { username, password } = req.body;

    findUserByUsername(username, (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: "Invalid username or password" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error verifying password" });
            if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

            const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

            updateLastLoggedDate(user.id);

            res.json({ token, username: user.username, role: user.role });
        });
    });
};


const generateApiKey = (req, res) => {
    const userId = req.user.id;
    const apiKey = crypto.randomBytes(16).toString("hex");
    const createdDate = new Date().toISOString();
    const lastUsedDate = null;

    createApiKey(userId, apiKey, createdDate, lastUsedDate, (err) => {
        if (err) return res.status(500).json({ error: "Error generating API key" });
        res.json({ apiKey, createdDate });
    });
};

const getApiKeys = (req, res) => {
    const userId = req.user.id;
    getApiKeysByUser(userId, (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ apiKeys: rows });
    });
};

const removeApiKey = (req, res) => {
    const { apiKey } = req.params;
    const userId = req.user?.id;

    if (!apiKey) return res.status(400).json({ error: "API key is required in the request URL" });
    if (!userId) return res.status(403).json({ error: "Unauthorized access" });

    deleteApiKey(userId, apiKey, (err) => {
        if (err) {
            console.error("Error deleting API key:", err);
            return res.status(500).json({ error: "Failed to delete API key" });
        }

        res.json({ message: "API key successfully deleted" });
    });
};

module.exports = {
    register,
    login,
    generateApiKey,
    getApiKeys,
    deleteApiKey: removeApiKey
};


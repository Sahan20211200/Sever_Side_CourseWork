const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const crypto = require("crypto");
require("dotenv").config();

const register = (req, res) => {
    const { username, password, role, adminSecret } = req.body;
    // console.log("Received Registration Data:", req.body);

    let userRole = "user";

    if (role === "admin") {
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ error: "Invalid admin secret key" });
        }
        userRole = "admin";
    }

    const createdDate = new Date().toISOString();
    const lastLoggedDate = createdDate;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Error hashing password" });
        }

        db.run(
            "INSERT INTO users (username, password, role, created_date, last_logged_date) VALUES (?, ?, ?, ?, ?)",
            [username, hash, userRole, createdDate, lastLoggedDate],
            function (err) {
                if (err) {
                    console.error("SQLite Error:", err.message);
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: `User registered successfully as ${userRole}` });
            }
        );
    });
};


const login = (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: "Invalid username or password" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error verifying password" });
            if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

            const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

            const lastLoggedDate = new Date().toISOString();
            db.run("UPDATE users SET last_logged_date = ? WHERE id = ?", [lastLoggedDate, user.id]);

            res.json({ token, username: user.username, role: user.role });
        });
    });
};

const generateApiKey = (req, res) => {
    const userId = req.user.id;
    const apiKey = crypto.randomBytes(16).toString("hex");
    const createdDate = new Date().toISOString();
    const lastUsedDate = null;

    db.run("INSERT INTO api_keys (user_id, api_key, created_date, last_used_date) VALUES (?, ?, ?, ?)", 
        [userId, apiKey, createdDate, lastUsedDate], function (err) {
            if (err) return res.status(500).json({ error: "Error generating API key" });

            res.json({ apiKey, createdDate });
        }
    );
};

const getApiKeys = (req, res) => {
    const userId = req.user.id; // Get user ID from authentication
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    db.all("SELECT api_key, created_date, last_used_date FROM api_keys WHERE user_id = ?", 
        [userId], 
        (err, rows) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ apiKeys: rows });
    });
};

const deleteApiKey = (req, res) => {
    const { apiKey } = req.params; // ✅ Get API key from request URL
    const userId = req.user?.id; // ✅ Extract user ID from auth middleware
    if (!apiKey) {
        return res.status(400).json({ error: "API key is required in the request URL" });
    }

    if (!userId) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

        // Step 2: Delete the API key from api_keys table
        db.run("DELETE FROM api_keys WHERE user_id = ? AND api_key = ?", [userId, apiKey], function (err) {
            if (err) {
                console.error("Error deleting API key:", err);
                return res.status(500).json({ error: "Failed to delete API key" });
            }

            res.json({ message: "API key successfully deleted" });
        });
};


module.exports = { register, login, generateApiKey, getApiKeys, deleteApiKey  };

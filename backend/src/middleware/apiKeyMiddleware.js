const db = require("../config/database");
const { getUserByApiKey } = require("../models/apiKeyModel");

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(403).json({ error: "API key required in 'x-api-key' header" });
    }

    getUserByApiKey(apiKey, (err, row) => {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database lookup failed" });
        }

        if (!row) {
            return res.status(401).json({ error: "Invalid API key" });
        }

        const lastUsedDate = new Date().toISOString();
        db.run("UPDATE api_keys SET last_used_date = ? WHERE api_key = ?", [lastUsedDate, apiKey], (err) => {
            if (err) {
                console.error("Failed to update API key usage:", err.message);
                return res.status(500).json({ error: "Error updating API key" });
            }

            req.user = { id: row.user_id, role: row.role };
            console.log(`API Key Validated: User ${req.user.id}`);
            next();
        });
    });
};

module.exports = { validateApiKey };

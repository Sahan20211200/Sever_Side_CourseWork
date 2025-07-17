const {
    getAllUsersWithKeyCount,
    deleteApiKeyAndUsageByUserId,
    getUnusedApiKeys,
    getApiKeyOwners
} = require("../models/apiKeyModel");

const getUsers = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    getAllUsersWithKeyCount((err, rows) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
};

const revokeApiKey = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { userId, apiKey } = req.params;

    deleteApiKeyAndUsageByUserId(userId, apiKey, (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to revoke API key or usage" });
        }
        res.json({ message: "API key revoked and usage history deleted" });
    });
};


const fetchUnusedApiKeys = (req, res) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const formattedDate = twoDaysAgo.toISOString().slice(0, 19).replace("T", " ");

    getUnusedApiKeys(formattedDate, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
};

const fetchApiKeyOwners = (req, res) => {
    const apiKeyIds = req.body.apiKeys;

    if (!apiKeyIds || apiKeyIds.length === 0) {
        return res.status(400).json({ error: "No API keys provided" });
    }

    getApiKeyOwners(apiKeyIds, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
};


module.exports = {
    getUsers,
    revokeApiKey,
    getUnusedApiKeys: fetchUnusedApiKeys,
    getApiKeyOwners: fetchApiKeyOwners
};

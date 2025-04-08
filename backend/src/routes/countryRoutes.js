const express = require("express");
const { getCountryInfo } = require("../controllers/countryController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateApiKey } = require("../middleware/apiKeyMiddleware");
const { logApiUsage } = require("../Utils/logger");

const router = express.Router();

router.get("/:name", authMiddleware, validateApiKey, async (req, res) => {
    try {
        // Log API usage
        await logApiUsage(req.user.id, req.originalUrl);

        // Fetch and respond with country info
        await getCountryInfo(req, res);
    } catch (error) {
        console.error("Error during country fetch:", error.message);
        res.status(500).json({ error: "Failed to fetch country data or log usage" });
    }
});

module.exports = router;

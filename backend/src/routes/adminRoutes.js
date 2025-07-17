const express = require("express");
const {
    getUsers,
    revokeApiKey,
    getUnusedApiKeys,
    getApiKeyOwners
} = require("../controllers/adminController");

const { authMiddleware } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { logAdminAction } = require("../Utils/logger");

const router = express.Router();


const logActionMiddleware = (action) => {
    return async (req, res, next) => {
        const adminId = req.user.id;
        const { userId } = req.params;

        try {
            await logAdminAction(adminId, action, userId);
        } catch (err) {

        }

        next(); 
    };
};

router.get("/users", authMiddleware, adminMiddleware, getUsers);

router.get("/unused-api-keys", authMiddleware, adminMiddleware, getUnusedApiKeys);

router.post("/api-key-owners", authMiddleware, adminMiddleware, getApiKeyOwners);

router.delete(
    "/api-key/:userId/:apiKey",
    authMiddleware,
    adminMiddleware,
    logActionMiddleware("Revoke API Key"),
    revokeApiKey
);

module.exports = router;

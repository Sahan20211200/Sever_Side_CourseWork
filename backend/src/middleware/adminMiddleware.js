module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        console.warn(`Unauthorized access attempt by User ID: ${req.user?.id || "Unknown"}`);
        return res.status(403).json({ error: "Access denied: Admins only" });
    }

    next();
};

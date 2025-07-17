const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/config/database");
const logRequest = require("./src/middleware/logRequest");
const rateLimiter = require("./src/middleware/rateLimiter");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3002",
    credentials: true
}));
app.use(cookieParser());
app.use(logRequest);
app.use(rateLimiter);

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/countries", require("./src/routes/countryRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

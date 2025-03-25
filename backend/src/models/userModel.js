const db = require("../config/database");

// Function to Register a User
const createUser = (username, hashedPassword, role, callback) => {
    const createdAt = new Date().toISOString();
    const lastLoggedDate = createdAt;

    db.run(
        `INSERT INTO users (username, password, role, created_at, last_logged_date) VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, role, createdAt, lastLoggedDate],
        function (err) {
            callback(err, this ? this.lastID : null);
        }
    );
};

// Function to Update Last Logged Date
const updateLastLoggedDate = (userId) => {
    const lastLoggedDate = new Date().toISOString();
    db.run(`UPDATE users SET last_logged_date = ? WHERE id = ?`, [lastLoggedDate, userId]);
};

// Function to Find User by Username
const findUserByUsername = (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], callback);
};

module.exports = { createUser, updateLastLoggedDate, findUserByUsername };

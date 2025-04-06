const db = require("../config/database");

const createUser = (username, hashedPassword, role, callback) => {
    const createdAt = new Date().toISOString();
    const lastLoggedDate = createdAt;

    db.run(
        `INSERT INTO users (username, password, role, created_date, last_logged_date) VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, role, createdAt, lastLoggedDate],
        function (err) {
            callback(err, this ? this.lastID : null);
        }
    );
};

const updateLastLoggedDate = (userId) => {
    const lastLoggedDate = new Date().toISOString();
    db.run(`UPDATE users SET last_logged_date = ? WHERE id = ?`, [lastLoggedDate, userId]);
};

const findUserByUsername = (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], callback);
};

module.exports = { createUser, updateLastLoggedDate, findUserByUsername };

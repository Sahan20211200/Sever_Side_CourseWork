const db = require("../config/database");

const getAllUsersWithKeyCount = (callback) => {
    const query = `
        SELECT 
            users.username, 
            users.last_logged_date, 
            COALESCE(COUNT(api_keys.id), 0) AS api_key_count
        FROM users
        LEFT JOIN api_keys ON users.id = api_keys.user_id
        GROUP BY users.id
    `;
    db.all(query, [], callback);
};

const deleteApiKeyAndUsageByUserId = (userId, callback) => {
    db.run("DELETE FROM api_usage WHERE user_id = ?", [userId], function (err) {
        if (err) return callback(err);

        db.run("DELETE FROM api_keys WHERE user_id = ?", [userId], function (err2) {
            callback(err2);
        });
    });
};

const getUnusedApiKeys = (formattedDate, callback) => {
    const query = `
        SELECT 
            user_id,
            api_key, 
            created_date, 
            COALESCE(last_used_date, 'Never Used') AS last_used_date
        FROM api_keys
        WHERE last_used_date IS NULL OR last_used_date < ?
    `;
    db.all(query, [formattedDate], callback);
};

const getApiKeyOwners = (apiKeys, callback) => {
    const placeholders = apiKeys.map(() => "?").join(", ");
    const query = `
        SELECT 
            users.username, 
            COUNT(api_keys.id) AS risky_api_count,
            COALESCE(COUNT(api_usage.id), 0) AS search_count,
            GROUP_CONCAT(api_keys.api_key) AS risky_api_keys
        FROM users
        JOIN api_keys ON users.id = api_keys.user_id
        LEFT JOIN api_usage ON users.id = api_usage.user_id
        WHERE api_keys.api_key IN (${placeholders})
        GROUP BY users.id
    `;
    db.all(query, apiKeys, callback);
};

const createApiKey = (userId, apiKey, createdDate, lastUsedDate, callback) => {
    db.run("INSERT INTO api_keys (user_id, api_key, created_date, last_used_date) VALUES (?, ?, ?, ?)",
        [userId, apiKey, createdDate, lastUsedDate], callback);
};

const getApiKeysByUser = (userId, callback) => {
    db.all("SELECT api_key, created_date, last_used_date FROM api_keys WHERE user_id = ?", [userId], callback);
};

const deleteApiKey = (userId, apiKey, callback) => {
    db.run("DELETE FROM api_keys WHERE user_id = ? AND api_key = ?", [userId, apiKey], callback);
};

const getUserByApiKey = (apiKey, callback) => {
    const query = `
        SELECT api_keys.user_id, users.role
        FROM api_keys
        JOIN users ON users.id = api_keys.user_id
        WHERE api_key = ?
    `;

    db.get(query, [apiKey], callback);
};

module.exports = {
    getAllUsersWithKeyCount,
    deleteApiKeyAndUsageByUserId,
    getUnusedApiKeys,
    getApiKeyOwners,
    createApiKey,
    getApiKeysByUser,
    deleteApiKey,
    getUserByApiKey
};

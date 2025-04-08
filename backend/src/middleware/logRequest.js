const fs = require('fs');
const path = require('path');

// Define log file path: /logs/api_requests.log (relative to project root)
const logFilePath = path.join(__dirname, '../../logs/api_requests.log');

// Make sure the logs directory exists
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

const logRequest = (req, res, next) => {
    const userId = req.user ? req.user.id : 'Anonymous';
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | User: ${userId}\n`;

    fs.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });

    next();
};

module.exports = logRequest;

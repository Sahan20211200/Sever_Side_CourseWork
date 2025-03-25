const db = require("../config/database");

// Check Tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
        console.error("Error checking tables:", err);
    } else {
        console.log("Tables in database:", rows.map(row => row.name));
    }
});

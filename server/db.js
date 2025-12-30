const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database file
const dbPath = path.resolve(__dirname, 'smart_recipe_hub.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Wrapper to mimic MySQL's query interface: query(sql, [params], callback)
const query = (sql, params, callback) => {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }

    // Check if it's a SELECT query to use db.all, otherwise db.run
    const cmd = sql.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

    db[cmd](sql, params, function (err, rows) {
        if (err) {
            console.error("SQL Error:", err.message);
            return callback(err, null);
        }

        if (cmd === 'run') {
            // In sqlite3, 'this' context for run contains lastID and changes
            // We mimic mysql result format slightly for compat
            const result = {
                insertId: this.lastID,
                affectedRows: this.changes,
            };
            callback(null, result);
        } else {
            callback(null, rows);
        }
    });
};

// Export object matching pool interface (query, on)
module.exports = {
    query,
    on: (event, cb) => {
        // SQLite doesn't have connection events exactly like MySQL pool
        if (event === 'error') {
            db.on('error', cb);
        }
    },
    // Add promise wrapper used in server.js check
    promise: () => {
        return {
            query: (sql, params) => {
                return new Promise((resolve, reject) => {
                    query(sql, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve([rows]); // MySQL promise returns [rows, fields]
                    });
                });
            }
        };
    }
};

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const isPostgres = !!process.env.DATABASE_URL;
let db;
let pgPool;

if (isPostgres) {
    console.log('Connecting to the PostgreSQL database...');
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for some hosted PG instances like Render
        }
    });

    // Simple wrapper to test connection
    pgPool.query('SELECT 1', (err) => {
        if (err) console.error('PG Connection Error:', err.message);
        else console.log('Connected to the PostgreSQL database.');
    });
} else {
    // Connect to SQLite database file
    const dbPath = path.resolve(__dirname, 'smart_recipe_hub.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database ' + dbPath + ': ' + err.message);
        } else {
            console.log('Connected to the SQLite database.');
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');
        }
    });
}

// Wrapper to mimic MySQL's query interface: query(sql, [params], callback)
const query = (sql, params, callback) => {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }

    if (isPostgres) {
        // Convert ? placeholders to $1, $2 for PG
        let pgSql = sql;
        let pIndex = 1;
        while (pgSql.includes('?')) {
            pgSql = pgSql.replace('?', `$${pIndex++}`);
        }

        pgPool.query(pgSql, params, (err, res) => {
            if (err) {
                console.error("SQL Error (PG):", err.message);
                return callback(err, null);
            }

            // Mimic the response format
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
                callback(null, { insertId: res.rows[0] ? res.rows[0].id : null, affectedRows: res.rowCount });
            } else if (sql.trim().toUpperCase().startsWith('SELECT')) {
                callback(null, res.rows);
            } else {
                callback(null, { affectedRows: res.rowCount });
            }
        });
    } else {
        // Check if it's a SELECT query to use db.all, otherwise db.run
        const cmd = sql.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

        db[cmd](sql, params, function (err, rows) {
            if (err) {
                console.error("SQL Error (SQLite):", err.message);
                return callback(err, null);
            }

            if (cmd === 'run') {
                const result = {
                    insertId: this.lastID,
                    affectedRows: this.changes,
                };
                callback(null, result);
            } else {
                callback(null, rows);
            }
        });
    }
};

// Export object matching pool interface (query, on)
module.exports = {
    query,
    on: (event, cb) => {
        if (isPostgres) {
            pgPool.on(event, cb);
        } else {
            if (event === 'error') {
                db.on('error', cb);
            }
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

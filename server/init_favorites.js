const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'smart_recipe_hub.db');
const db = new sqlite3.Database(dbPath);

const schema = `
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
`;

db.serialize(() => {
    db.run(schema, (err) => {
        if (err) {
            console.error('Error creating favorites table:', err.message);
        } else {
            console.log('✅ Favorites table initialized successfully');
        }
    });

    // Optional: Add a test favorite if you have a user and recipe ID
    // db.run('INSERT OR IGNORE INTO favorites (user_id, recipe_id) VALUES (1, 624)');
});

db.close();

const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const createReviewsTable = async () => {
    try {
        console.log('Checking reviews table...');

        // 1. Drop existing table to ensure clean slate (optional, but good for fixing schema)
        await db.promise().query('DROP TABLE IF EXISTS reviews');
        console.log('Dropped existing reviews table.');

        // 2. Create with SQLite compatible syntax
        await db.promise().query(`
            CREATE TABLE reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                recipe_id INTEGER,
                rating INTEGER CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Reviews table created with SQLite syntax.');

        // 3. Test Insertion (Verification)
        const [users] = await db.promise().query('SELECT id FROM users LIMIT 1');
        const [recipes] = await db.promise().query('SELECT id FROM recipes LIMIT 1');

        if (users.length > 0 && recipes.length > 0) {
            await db.promise().query(
                'INSERT INTO reviews (user_id, recipe_id, rating, comment) VALUES (?, ?, ?, ?)',
                [users[0].id, recipes[0].id, 5, 'Test review system check']
            );
            console.log('✅ Test review inserted successfully.');
        } else {
            console.warn('⚠️ Cannot test insertion: No users or recipes found.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to initialize reviews:', err);
        process.exit(1);
    }
};

createReviewsTable();

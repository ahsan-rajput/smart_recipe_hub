const db = require('./db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    try {
        console.log('Checking existing users...');
        const [rows] = await db.promise().query('SELECT * FROM users WHERE id = 1');

        if (rows.length > 0) {
            console.log('User ID 1 already exists. Skipping user seed.');
            process.exit(0);
        }

        console.log('Creating Admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await db.promise().query(
            'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [1, 'AdminChef', 'admin@example.com', hashedPassword, 'admin']
        );

        console.log('✅ Admin user created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding users:', err);
        process.exit(1);
    }
}

seedUsers();

const axios = require('axios');

async function createDebugUser() {
    try {
        console.log('Registering debug user...');
        await axios.post('http://localhost:5000/api/register', {
            username: 'debuguser_' + Date.now(),
            email: 'debug_' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('User registered.');

        // Login immediately
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/login', {
            email: 'debug_last@example.com', // Wait, I need to use the same email.
            // Let's just fixed email for simplicity, might fail if exists but I handle that below
        });

    } catch (err) {
        // Ignore if already exists and try login
        console.log('Registration might have failed (maybe exists), trying login with standard debug user');
    }
}

// Actually, let's just use a fixed script that tries to login with a known user, if 401, registers it.
async function getValidToken() {
    const email = 'debug_tester@example.com';
    const password = 'password123';

    try {
        const res = await axios.post('http://localhost:5000/api/login', { email, password });
        return res.data.token;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            // Maybe needs registration
            try {
                await axios.post('http://localhost:5000/api/register', {
                    username: 'DebugTester',
                    email,
                    password
                });
                const res = await axios.post('http://localhost:5000/api/login', { email, password });
                return res.data.token;
            } catch (regErr) {
                console.error('Registration failed:', regErr.message);
            }
        }
        console.error('Login failed:', err.message);
    }
    return null;
}

async function test() {
    const token = await getValidToken();
    if (!token) return;

    try {
        console.log('Fetching shopping list...');
        const res = await axios.get('http://localhost:5000/api/shopping-list', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('API Error:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', err.response.data);
        }
    }
}

test();

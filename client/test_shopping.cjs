const axios = require('axios');

async function test() {
    try {
        // We need a token. This script assumes the server doesn't strictly enforce token for this specific test or we need valid credentials.
        // Actually, the endpoint IS protected: authenticateToken.
        // So I need to login first.

        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/login', {
            email: 'test@example.com', // I need a valid user. "test@example.com" / "password123" is a good guess or I can create one.
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        console.log('Fetching shopping list...');
        const res = await axios.get('http://localhost:5000/api/shopping-list', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));

    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', err.response.data);
        }
    }
}

test();

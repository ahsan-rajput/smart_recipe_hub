const axios = require('axios');

async function test() {
    try {
        console.log('Fetching reviews for recipe 1...');
        const res = await axios.get('http://localhost:5000/api/reviews/1');
        console.log('Status:', res.status);
        console.log('Data Type:', Array.isArray(res.data) ? 'Array' : typeof res.data);
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

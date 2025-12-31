const axios = require('axios');

async function testWithData() {
    const email = 'debug_tester@example.com';
    const password = 'password123';

    // Login
    const loginRes = await axios.post('http://localhost:5000/api/login', { email, password });
    const token = loginRes.data.token;

    // Create a dummy meal plan
    // We need a valid recipe ID. Let's assume ID=1 exists (it should from seeds).
    const dummyPlan = {
        "Monday": {
            "breakfast": [{ id: 624, title: 'Chicken Biryani', servings: 2 }]
        }
    };

    const weekStart = '2025-12-29'; // Use a current date

    console.log('Saving meal plan...');
    await axios.post('http://localhost:5000/api/meal-plan', {
        plan_json: dummyPlan,
        weekStart: weekStart
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Fetching shopping list...');
    const res = await axios.get(`http://localhost:5000/api/shopping-list?weekStart=${weekStart}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Shopping List Data:', JSON.stringify(res.data, null, 2));
}

testWithData();

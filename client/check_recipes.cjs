const axios = require('axios');

async function checkRecipes() {
    try {
        const res = await axios.get('http://localhost:5000/api/recipes');
        console.log('Recipes found:', res.data.length);
        if (res.data.length > 0) {
            console.log('First recipe:', JSON.stringify(res.data[0], null, 2));
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkRecipes();

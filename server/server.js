const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// Routes
app.get('/', (req, res) => {
    res.send('API is running. Please access the frontend at http://localhost:5173');
});

// Authentication Routes
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.promise().query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.get('/api/recipes', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM recipes';
        let params = [];

        if (search) {
            query += ' WHERE title LIKE ? OR description LIKE ?';
            params = [`%${search}%`, `%${search}%`];
        }

        const [recipes] = await db.promise().query(query, params);

        // Parse JSON fields
        const formattedRecipes = recipes.map(r => ({
            ...r,
            ingredients: JSON.parse(r.ingredients_json),
            steps: JSON.parse(r.steps_json),
            nutrition: JSON.parse(r.nutritional_info_json)
        }));

        res.json(formattedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

// Meal Plan Routes
app.get('/api/meal-plan', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { weekStart } = req.query; // Expecting YYYY-MM-DD

        let query = 'SELECT * FROM meal_plans WHERE user_id = ?';
        let params = [userId];

        if (weekStart) {
            query += ' AND week_start_date = ?';
            params.push(weekStart);
        } else {
            // Default to most recent if no date specified
            query += ' ORDER BY week_start_date DESC LIMIT 1';
        }

        const [plans] = await db.promise().query(query, params);

        if (plans.length === 0) {
            return res.json({ plan_json: null });
        }

        res.json({ ...plans[0], plan_json: JSON.parse(plans[0].plan_json) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
});

app.post('/api/meal-plan', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { plan_json, weekStart } = req.body;
        console.log(`[POST] Saving plan for User ${userId}, Week: ${weekStart}`);

        if (!weekStart) {
            return res.status(400).json({ error: 'weekStart is required' });
        }

        // Check if plan exists for this specific week
        const [existing] = await db.promise().query(
            'SELECT id FROM meal_plans WHERE user_id = ? AND week_start_date = ?',
            [userId, weekStart]
        );

        if (existing.length > 0) {
            console.log(`[POST] Updating existing plan ID: ${existing[0].id}`);
            await db.promise().query(
                'UPDATE meal_plans SET plan_json = ? WHERE id = ?',
                [JSON.stringify(plan_json), existing[0].id]
            );
        } else {
            console.log(`[POST] Creating new plan for week ${weekStart}`);
            await db.promise().query(
                'INSERT INTO meal_plans (user_id, plan_json, week_start_date) VALUES (?, ?, ?)',
                [userId, JSON.stringify(plan_json), weekStart]
            );
        }

        res.json({ message: 'Meal plan saved successfully' });
    } catch (err) {
        console.error('[POST ERROR]', err);
        res.status(500).json({ error: 'Failed to save meal plan' });
    }
});

// Shopping List Route
app.get('/api/shopping-list', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { weekStart } = req.query;

        console.log('[Shopping List] Request received for user:', userId, 'weekStart:', weekStart);

        // 1. Get current plan or specific week plan
        let query = 'SELECT plan_json FROM meal_plans WHERE user_id = ?';
        let params = [userId];

        if (weekStart) {
            query += ' AND week_start_date = ?';
            params.push(weekStart);
        } else {
            query += ' ORDER BY week_start_date DESC LIMIT 1';
        }

        console.log('[Shopping List] Querying database with:', query, params);
        const [plans] = await db.promise().query(query, params);
        console.log('[Shopping List] Plans found:', plans.length);

        if (plans.length === 0) {
            console.warn('[Shopping List] No meal plans found for user');
            return res.json([]);
        }

        const plan = JSON.parse(plans[0].plan_json);
        console.log('[Shopping List] Parsed meal plan:', JSON.stringify(plan, null, 2));
        const recipeIds = new Set();

        // 2. Extract Recipe IDs from plan
        Object.values(plan).forEach(day => {
            Object.values(day).forEach(slot => {
                const items = Array.isArray(slot) ? slot : (slot ? [slot] : []);
                items.forEach(item => {
                    if (item && item.id) {
                        recipeIds.add(item.id);
                    }
                });
            });
        });

        console.log('[Shopping List] Recipe IDs extracted:', Array.from(recipeIds));

        if (recipeIds.size === 0) {
            console.warn('[Shopping List] No recipe IDs found in meal plan');
            return res.json([]);
        }

        // 3. Fetch Recipes with full details
        const placeholders = Array.from(recipeIds).map(() => '?').join(',');
        const [recipes] = await db.promise().query(
            `SELECT id, title, servings, ingredients_json FROM recipes WHERE id IN (${placeholders})`,
            Array.from(recipeIds)
        );

        console.log('[Shopping List] Recipes fetched from database:', recipes.length);

        // 4. Build grouped shopping list
        const shoppingList = recipes.map(recipe => {
            const ingredients = JSON.parse(recipe.ingredients_json);

            // Calculate scaling ratio
            // We need to find the userServings for THIS specific recipe from the plan
            // Since a recipe could be used multiple times, we might need to sum them up or list them separately.
            // For simplicity in this shopping list view, we will sum up the TOTAL servings required for this recipe across the week.

            let totalUserServings = 0;
            Object.values(plan).forEach(day => {
                Object.values(day).forEach(slot => {
                    const items = Array.isArray(slot) ? slot : (slot ? [slot] : []);
                    items.forEach(item => {
                        if (item && item.id === recipe.id) {
                            totalUserServings += (item.userServings || recipe.servings);
                        }
                    });
                });
            });

            // If for some reason we didn't find it (shouldn't happen due to logic above), default to base
            if (totalUserServings === 0) totalUserServings = recipe.servings;

            const ratio = totalUserServings / recipe.servings;

            return {
                recipeId: recipe.id,
                recipeTitle: recipe.title,
                servings: totalUserServings, // Show total servings planned
                ingredients: ingredients.map(ing => {
                    if (typeof ing === 'string') {
                        return { name: ing };
                    } else {
                        // Attempt to scale quantity
                        let quantity = ing.quantity;
                        let unit = ing.unit;

                        // Check if quantity is a number or a range
                        if (quantity && !isNaN(parseFloat(quantity))) {
                            const numIdx = parseFloat(quantity);
                            // Simple scaling
                            const scaled = numIdx * ratio;
                            // Format: if integer, show integer, else 1 decimal
                            quantity = Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);
                        }

                        return {
                            name: ing.name,
                            quantity: quantity,
                            unit: unit
                        };
                    }
                })
            };
        });

        console.log('[Shopping List] Final list generated with', shoppingList.length, 'recipe groups');
        console.log('[Shopping List] Sample data:', JSON.stringify(shoppingList[0], null, 2));
        res.json(shoppingList);
    } catch (err) {
        console.error('[SHOPPING LIST ERROR]', err);
        console.error('[SHOPPING LIST ERROR] Stack:', err.stack);
        res.status(500).json({ error: 'Failed to generate shopping list' });
    }
});

// --- Reviews Endpoints ---

// Get reviews for a recipe
app.get('/api/reviews/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const [reviews] = await db.promise().query(
            `SELECT r.*, u.username
                     FROM reviews r
                     JOIN users u ON r.user_id = u.id
                     WHERE r.recipe_id = ?
                            ORDER BY r.created_at DESC`,
            [recipeId]
        );
        res.json(reviews);
    } catch (err) {
        console.error('Failed to fetch reviews', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Add a review
app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipeId, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if user already reviewed this recipe
        const [existing] = await db.promise().query(
            'SELECT id FROM reviews WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'You have already reviewed this recipe' });
        }

        await db.promise().query(
            'INSERT INTO reviews (user_id, recipe_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, recipeId, rating, comment]
        );

        res.json({ message: 'Review added successfully' });
    } catch (err) {
        console.error('Failed to add review', err);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// --- Favorites Endpoints ---

// Get all favorite recipe IDs for the current user
app.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [favorites] = await db.promise().query(
            'SELECT recipe_id FROM favorites WHERE user_id = ?',
            [userId]
        );
        res.json(favorites.map(f => f.recipe_id));
    } catch (err) {
        console.error('Failed to fetch favorites', err);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Toggle a recipe as favorite
app.post('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipeId } = req.body;

        if (!recipeId) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }

        // Check if already favorited
        const [existing] = await db.promise().query(
            'SELECT id FROM favorites WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );

        if (existing.length > 0) {
            // Remove from favorites
            await db.promise().query(
                'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
                [userId, recipeId]
            );
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            // Add to favorites
            await db.promise().query(
                'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)',
                [userId, recipeId]
            );
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (err) {
        console.error('Failed to toggle favorite', err);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to SmartRecipe Hub API' });
});

// --- Pantry Routes ---
app.get('/api/pantry', authenticateToken, async (req, res) => {
    try {
        const [items] = await db.promise().query('SELECT * FROM pantry_items WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch pantry' });
    }
});

app.post('/api/pantry', authenticateToken, async (req, res) => {
    try {
        const { name, quantity, unit, expiration_date } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        await db.promise().query(
            'INSERT INTO pantry_items (user_id, name, quantity, unit, expiration_date) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, name, quantity || 0, unit || '', expiration_date || null]
        );
        res.json({ message: 'Item added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.delete('/api/pantry/:id', authenticateToken, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM pantry_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});



// --- Smart Search (Pantry-based) ---
app.get('/api/recipes/search/smart', authenticateToken, async (req, res) => {
    try {
        // 1. Get User Pantry
        const [pantryItems] = await db.promise().query('SELECT name FROM pantry_items WHERE user_id = ?', [req.user.id]);
        const pantryNames = pantryItems.map(p => p.name.toLowerCase());

        if (pantryNames.length === 0) return res.json([]); // Empty pantry

        // 2. Get All Recipes
        const [recipes] = await db.promise().query('SELECT * FROM recipes');

        // 3. Calculate Matches
        console.log(`[Smart Search] Calculating matches for pantry: [${pantryNames.join(', ')}]`);

        const results = recipes.map(r => {
            const ingredients = JSON.parse(r.ingredients_json || '[]');

            // Correct logic: ingredients is an array of objects {name, quantity, unit}
            const matches = ingredients.filter(ing => {
                const ingName = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
                return pantryNames.some(pItem => {
                    const pItemLower = pItem.toLowerCase();
                    return ingName.includes(pItemLower) || pItemLower.includes(ingName);
                });
            });

            return {
                ...r,
                ingredients: ingredients, // expand for frontend
                steps: JSON.parse(r.steps_json),
                nutrition: JSON.parse(r.nutritional_info_json),
                matchCount: matches.length,
                missingCount: ingredients.length - matches.length,
                matches: matches.map(m => typeof m === 'string' ? m : m.name)
            };
        });

        // 4. Filter & Sort
        // Must have at least 1 match. Sort by most matches, then fewest missing.
        const sorted = results
            .filter(r => r.matchCount > 0)
            .sort((a, b) => {
                if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount; // More matches first
                return a.missingCount - b.missingCount; // Fewer missing second
            });

        res.json(sorted);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Smart search failed' });
    }
});

// --- Admin Endpoints ---

// Get Admin Stats
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [[{ count: recipeCount }]] = await db.promise().query('SELECT COUNT(*) as count FROM recipes');
        const [[{ count: userCount }]] = await db.promise().query('SELECT COUNT(*) as count FROM users');
        const [[{ count: planCount }]] = await db.promise().query('SELECT COUNT(*) as count FROM meal_plans');

        res.json({
            recipeCount,
            userCount,
            planCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get All Users
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Add New Recipe
app.post('/api/recipes', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, cuisine, category, cooking_time, servings, image_url, youtube_url, ingredients_json, steps_json, nutritional_info_json } = req.body;

        const result = await db.promise().query(
            `INSERT INTO recipes (title, description, cuisine, category, cooking_time, servings, image_url, youtube_url, ingredients_json, steps_json, nutritional_info_json) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, cuisine, category, cooking_time, servings, image_url, youtube_url,
                typeof ingredients_json === 'string' ? ingredients_json : JSON.stringify(ingredients_json),
                typeof steps_json === 'string' ? steps_json : JSON.stringify(steps_json),
                typeof nutritional_info_json === 'string' ? nutritional_info_json : JSON.stringify(nutritional_info_json)]
        );

        res.status(201).json({ message: 'Recipe created', recipeId: result[0].insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// Update Recipe
app.put('/api/recipes/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, cuisine, category, cooking_time, servings, image_url, youtube_url, ingredients_json, steps_json, nutritional_info_json } = req.body;

        await db.promise().query(
            `UPDATE recipes SET title=?, description=?, cuisine=?, category=?, cooking_time=?, servings=?, image_url=?, youtube_url=?, ingredients_json=?, steps_json=?, nutritional_info_json=? WHERE id=?`,
            [title, description, cuisine, category, cooking_time, servings, image_url, youtube_url,
                typeof ingredients_json === 'string' ? ingredients_json : JSON.stringify(ingredients_json),
                typeof steps_json === 'string' ? steps_json : JSON.stringify(steps_json),
                typeof nutritional_info_json === 'string' ? nutritional_info_json : JSON.stringify(nutritional_info_json),
                req.params.id]
        );

        res.json({ message: 'Recipe updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
});

// --- New Admin Moderation Endpoints (ERD Alignment) ---

// Get All Reviews (Moderation)
app.get('/api/admin/reviews', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [reviews] = await db.promise().query(`
            SELECT r.*, u.username, rec.title as recipe_title 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN recipes rec ON r.recipe_id = rec.id
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Delete Review (Moderation)
app.delete('/api/admin/reviews/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

// Get Catalog Metadata (Unique Cuisines, Categories)
app.get('/api/admin/catalog', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [cuisines] = await db.promise().query('SELECT DISTINCT cuisine FROM recipes');
        const [categories] = await db.promise().query('SELECT DISTINCT category FROM recipes');

        res.json({
            cuisines: cuisines.map(c => c.cuisine),
            categories: categories.map(c => c.category)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
});

// Update User Role
app.put('/api/admin/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        await db.promise().query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ message: 'User role updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Delete User Account
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
    console.log(`[ADMIN] Request to delete user ID: ${req.params.id} from Admin ID: ${req.user.id}`);
    try {
        // Prevention: Admin cannot delete themselves
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({ error: 'Cannot delete your own admin account' });
        }
        await db.promise().query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User account terminated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// --- End Admin Endpoints ---

// Database Connection Check (Non-blocking)
const checkDbConnection = async () => {
    try {
        const promisePool = db.promise();
        await promisePool.query('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.warn('⚠️  Database connection failed. The server is running, but database features will not work.');
        console.warn('   Error:', err.message);
    }
};

checkDbConnection();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});

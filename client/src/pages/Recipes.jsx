import React, { useState, useEffect } from 'react';
import { Search, Filter, Flame, RotateCcw, Heart } from 'lucide-react';
import axios from 'axios';
import API_URL from '../api';
import RecipeCard from '../components/RecipeCard';
import ReviewModal from '../components/ReviewModal';
import RecipeDetailsModal from '../components/RecipeDetailsModal';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [reviewRecipe, setReviewRecipe] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        fetchRecipes();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${API_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(res.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const handleToggleFavorite = async (recipeId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to favorite recipes');
                return;
            }
            const res = await axios.post(`${API_URL}/api/favorites`, { recipeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.isFavorite) {
                setFavorites([...favorites, recipeId]);
            } else {
                setFavorites(favorites.filter(id => id !== recipeId));
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const fetchRecipes = async (searchTerm = '') => {
        try {
            const url = searchTerm ? `${API_URL}/api/recipes?search=${searchTerm}` : `${API_URL}/api/recipes`;
            const res = await axios.get(url);

            // API returns DB fields. RecipeCard expects image_url, title, etc.
            const mappedRecipes = res.data.map(r => {
                let rawNutrition = {};
                try {
                    rawNutrition = typeof r.nutritional_info_json === 'string'
                        ? JSON.parse(r.nutritional_info_json)
                        : (r.nutritional_info_json || {});
                } catch (e) {
                    console.error("Failed to parse nutrition for", r.id);
                }

                // Smart Macro Estimator
                const cals = parseInt(rawNutrition.calories) || 450;

                const getMacro = (key, percentage, divisor) => {
                    const val = rawNutrition[key];
                    if (val) return parseInt(String(val).replace(/[^\d]/g, ''));
                    return Math.round((cals * percentage) / divisor);
                };

                const protein = getMacro('protein', 0.3, 4);
                const carbs = getMacro('carbs', 0.45, 4);
                const fat = getMacro('fat', 0.25, 9);

                return {
                    ...r,
                    time: r.cooking_time || '30m',
                    servings: r.servings || 4,
                    calories: cals,
                    nutrition: {
                        calories: cals,
                        protein: protein,
                        carbs: carbs,
                        fat: fat
                    }
                };
            });

            setRecipes(mappedRecipes);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setLoading(false);
        }
    };

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        maxCalories: 1000,
        vegetarian: false,
        favoritesOnly: false
    });

    const filteredRecipes = recipes.filter(recipe => {
        // 1. Calorie Filter
        if (recipe.calories > filters.maxCalories) return false;

        // 2. Vegetarian Filter (Simple keyword check on title/ingredients)
        if (filters.vegetarian) {
            const nonVegKeywords = ['chicken', 'beef', 'pork', 'bacon', 'ham', 'meat', 'fish', 'salmon', 'shrimp', 'crab', 'lobser', 'steak', 'lamb', 'pepperoni', 'sausage'];
            const content = (recipe.title + ' ' + (recipe.description || '')).toLowerCase();
            // Also check ingredients if available
            const ingredients = recipe.ingredients ? recipe.ingredients.map(i => typeof i === 'string' ? i : i.name).join(' ').toLowerCase() : '';

            if (nonVegKeywords.some(kw => content.includes(kw) || ingredients.includes(kw))) {
                return false;
            }
        }

        // 3. Favorites Only Filter
        if (filters.favoritesOnly && !favorites.includes(recipe.id)) return false;

        return true;
    });

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (e.key === 'Enter') {
            fetchRecipes(val);
        }
    };

    return (
        <div className="min-h-screen pt-28 px-6 pb-20">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Discover Recipes</h1>
                        <p className="text-gray-400">Find your next favorite meal from our curated collection.</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search meals... (Press Enter)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 border backdrop-blur-md ${showFilters
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,51,102,0.4)]'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-cyan-500/10'
                                }`}
                        >
                            <Filter size={18} className={showFilters ? "animate-pulse" : ""} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="glass-panel p-8 mb-10 animate-fade-in border-t border-t-primary/20 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                            {/* Calorie Slider */}
                            <div className="flex-1 w-full max-w-xs space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Flame size={16} className="text-primary" />
                                        Max Calories
                                    </label>
                                    <span className="text-gradient font-mono font-bold bg-white/5 px-3 py-1 rounded-lg border border-primary/20 shadow-[0_0_10px_rgba(255,51,102,0.15)]">{filters.maxCalories} kcal</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="1500"
                                    step="50"
                                    value={filters.maxCalories}
                                    onChange={(e) => setFilters({ ...filters, maxCalories: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            {/* Separator for mobile/desktop */}
                            <div className="hidden md:block w-px h-16 bg-white/10"></div>

                            {/* Vegetarian Toggle */}
                            <label className="flex items-center gap-4 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.vegetarian}
                                        onChange={(e) => setFilters({ ...filters, vegetarian: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <div className="toggle-switch"></div>
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="font-medium text-white group-hover:text-primary transition-colors">Vegetarian Only</div>
                                    <div className="text-xs text-gray-400">Exclude meat</div>
                                </div>
                            </label>

                            <div className="hidden md:block w-px h-16 bg-white/10"></div>

                            {/* Favorites Toggle */}
                            <label className="flex items-center gap-4 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.favoritesOnly}
                                        onChange={(e) => setFilters({ ...filters, favoritesOnly: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-6 rounded-full transition-all duration-300 border ${filters.favoritesOnly ? 'bg-primary/30 border-primary' : 'bg-white/5 border-white/20'}`}>
                                        <div className={`w-4 h-4 rounded-full m-1 transition-all duration-300 ${filters.favoritesOnly ? 'bg-primary translate-x-6' : 'bg-gray-500'}`}></div>
                                    </div>
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="font-medium text-white group-hover:text-primary transition-colors flex items-center gap-2">
                                        <Heart size={16} className={filters.favoritesOnly ? "text-primary fill-primary" : "text-gray-400"} />
                                        My Favorites
                                    </div>
                                    <div className="text-xs text-gray-400">Show only loved</div>
                                </div>
                            </label>

                            <div className="hidden md:block w-px h-16 bg-white/10"></div>

                            {/* Reset Button */}
                            <button
                                onClick={() => setFilters({ maxCalories: 1000, vegetarian: false, favoritesOnly: false })}
                                className="group relative px-6 py-3 rounded-full bg-white/5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 border border-primary/30 hover:border-primary/60 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative font-medium text-gray-300 group-hover:text-white transition-all duration-300 text-sm flex items-center gap-2">
                                    <RotateCcw size={16} className="text-primary group-hover:text-cyan-400 group-hover:-rotate-180 transition-all duration-500" />
                                    Reset
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading tasty recipes...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.map((recipe, index) => (
                            <div key={recipe.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <RecipeCard
                                    recipe={recipe}
                                    isFavorite={favorites.includes(recipe.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    onRate={(r) => setReviewRecipe(r)}
                                    onClick={(r) => setSelectedRecipe(r)}
                                />
                            </div>
                        ))}
                        {filteredRecipes.length === 0 && (
                            <div className="col-span-full text-center text-gray-400 py-10 animate-fade-in">
                                No recipes found matching your filters.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <RecipeDetailsModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}

            {/* Review Modal */}
            {reviewRecipe && (
                <ReviewModal
                    recipeId={reviewRecipe.id}
                    onClose={() => setReviewRecipe(null)}
                    onReviewAdded={() => {
                        alert('Thanks for your review!');
                        setReviewRecipe(null);
                    }}
                />
            )}
        </div>
    );
};

export default Recipes;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Search, ChefHat, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailsModal from '../components/RecipeDetailsModal';

const Pantry = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [smartRecipes, setSmartRecipes] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        fetchPantry();
    }, []);

    const fetchPantry = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:5000/api/pantry', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!newItem.trim() || !token) return;

        try {
            await axios.post('http://localhost:5000/api/pantry',
                { name: newItem },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewItem('');
            fetchPantry();
        } catch (err) {
            console.error(err);
            alert('Failed to add item: ' + (err.response?.data?.error || err.message));
        }
    };

    const deleteItem = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/pantry/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const findRecipes = async () => {
        setSearching(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/recipes/search/smart', {
                headers: { Authorization: `Bearer ${token}` }
            });

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
                const cals = parseInt(rawNutrition.calories) || 550;

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
                    time: r.cooking_time || '35m',
                    servings: r.servings || 2,
                    calories: cals,
                    nutrition: {
                        calories: cals,
                        protein: protein,
                        carbs: carbs,
                        fat: fat
                    }
                };
            });
            setSmartRecipes(mappedRecipes);
            setSearching(false);
        } catch (err) {
            console.error(err);
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 px-6 pb-20">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left: Pantry Manager */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-panel p-6 relative overflow-visible">
                        {/* Decorative Floating Ingredients - Left Panel */}
                        <img
                            src="https://www.themealdb.com/images/ingredients/Garlic.png"
                            alt="Garlic"
                            className="absolute -top-12 -right-12 w-24 h-24 object-contain opacity-40 pointer-events-none animate-float drop-shadow-2xl z-0"
                            style={{ animationDelay: '0s' }}
                        />
                        <img
                            src="https://www.themealdb.com/images/ingredients/Egg.png"
                            alt="Egg"
                            className="absolute bottom-32 -left-12 w-20 h-20 object-contain opacity-30 pointer-events-none animate-float drop-shadow-xl z-0"
                            style={{ animationDelay: '2s' }}
                        />
                        <img
                            src="https://www.themealdb.com/images/ingredients/Lemon.png"
                            alt="Lemon"
                            className="absolute top-1/2 -right-16 w-32 h-32 object-contain opacity-25 pointer-events-none animate-float drop-shadow-2xl z-0"
                            style={{ animationDelay: '1.5s' }}
                        />
                        <img
                            src="https://www.themealdb.com/images/ingredients/Tomato.png"
                            alt="Tomato"
                            className="absolute -bottom-12 -left-4 w-32 h-32 object-contain opacity-25 pointer-events-none animate-float drop-shadow-2xl blur-[1px] z-0"
                            style={{ animationDelay: '3s' }}
                        />

                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <ChefHat className="text-primary" /> My Pantry
                        </h2>

                        <form onSubmit={addItem} className="flex gap-3 mb-8 relative z-10">
                            <div className="relative flex-grow group">
                                <input
                                    type="text"
                                    placeholder="Add ingredient (e.g. Eggs)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder-gray-500 shadow-inner"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                />
                                <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-primary/20"></div>
                            </div>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary/80 text-white px-5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 ease-out group"
                            >
                                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span>Add</span>
                            </button>
                        </form>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {items.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl backdrop-blur-sm bg-black/20">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ChefHat size={20} className="text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 font-medium">Your pantry is empty</p>
                                    <p className="text-xs text-gray-500 mt-1">Add items to find matching recipes</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition-all p-3 rounded-xl border border-white/5 hover:border-white/10 group animate-fade-in backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            {/* Ingredient Image */}
                                            <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                <img
                                                    src={`https://www.themealdb.com/images/ingredients/${item.name}.png`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-full h-full hidden items-center justify-center bg-white/5 text-gray-500">
                                                    <ChefHat size={16} />
                                                </div>
                                            </div>

                                            <span className="capitalize font-medium text-gray-200 group-hover:text-white transition-colors text-shadow-sm">{item.name}</span>
                                        </div>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                            <button
                                onClick={findRecipes}
                                disabled={items.length === 0}
                                className="btn-secondary w-full flex items-center justify-center gap-2 group shadow-lg"
                            >
                                <Search size={18} className="group-hover:scale-110 transition-transform" />
                                What can I cook?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Smart Search Results */}
                <div className="md:col-span-2 space-y-6 relative">
                    {/* Decorative Floating Ingredients - Right Panel */}
                    <img
                        src="https://www.themealdb.com/images/ingredients/Broccoli.png"
                        alt="Broccoli"
                        className="absolute -top-16 right-10 w-40 h-40 object-contain opacity-20 pointer-events-none animate-float drop-shadow-2xl blur-[2px] z-0"
                        style={{ animationDelay: '4s' }}
                    />
                    <img
                        src="https://www.themealdb.com/images/ingredients/Chilli.png"
                        alt="Chili"
                        className="absolute top-1/4 -right-12 w-28 h-28 object-contain opacity-30 pointer-events-none animate-float drop-shadow-2xl rotate-45 z-0"
                        style={{ animationDelay: '1s' }}
                    />
                    <img
                        src="https://www.themealdb.com/images/ingredients/Onion.png"
                        alt="Onion"
                        className="absolute bottom-20 -left-12 w-32 h-32 object-contain opacity-15 pointer-events-none animate-float drop-shadow-2xl blur-[1px] z-0"
                        style={{ animationDelay: '2.5s' }}
                    />
                    <img
                        src="https://www.themealdb.com/images/ingredients/Lime.png"
                        alt="Lime"
                        className="absolute -bottom-10 right-1/4 w-24 h-24 object-contain opacity-20 pointer-events-none animate-float drop-shadow-2xl z-0"
                        style={{ animationDelay: '3.5s' }}
                    />

                    <div className="flex items-end justify-between border-b border-white/10 pb-4 relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <span className="text-gradient">Suggested Recipes</span>
                                <Sparkles className="text-secondary animate-pulse" size={24} />
                            </h2>
                            <p className="text-gray-400">Recipes you can cook right now with your ingredients.</p>
                        </div>
                    </div>

                    {searching ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
                            {[1, 2].map(i => (
                                <div key={i} className="h-64 glass-panel animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : smartRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            {smartRecipes.map((recipe, index) => (
                                <div key={recipe.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                                    <RecipeCard
                                        recipe={recipe}
                                        showMatchInfo={true}
                                        onClick={(r) => setSelectedRecipe(r)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel p-12 text-center border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-bounce-slow">
                                <ChefHat size={40} className="text-primary opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ready to Cook?</h3>
                            <p className="text-gray-400 max-w-md">
                                Add at least 3 ingredients to your pantry, then click <span className="text-secondary font-bold">"What can I cook?"</span> to discover recipes.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <RecipeDetailsModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
};

export default Pantry;

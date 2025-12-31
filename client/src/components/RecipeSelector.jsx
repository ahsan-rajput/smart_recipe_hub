import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Check } from 'lucide-react';

const RecipeSelector = ({ onSelect, onClose }) => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [customServings, setCustomServings] = useState(4);

    useEffect(() => {
        fetchRecipes();
    }, [search]); // Re-fetch when search changes (debounce would be better, but keeping simple)

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/recipes?search=${search}`);
            setRecipes(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch recipes', err);
            setLoading(false);
        }
    };

    const handleSelectClick = (recipe) => {
        setSelectedRecipe(recipe);
        setCustomServings(recipe.servings || 4);
    };

    const handleConfirm = () => {
        if (selectedRecipe) {
            onSelect({ ...selectedRecipe, userServings: customServings });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel max-w-2xl w-full p-6 relative flex flex-col max-h-[80vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">{selectedRecipe ? 'Adjust Servings' : 'Select a Meal'}</h2>

                {!selectedRecipe ? (
                    <>
                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Recipe List */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-2">
                            {loading ? (
                                <p className="text-center text-gray-400 py-10">Loading recipes...</p>
                            ) : recipes.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">No recipes found.</p>
                            ) : (
                                recipes.map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => handleSelectClick(recipe)}
                                        className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors group text-left"
                                    >
                                        <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                            {recipe.image_url ? (
                                                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{recipe.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">{recipe.description}</p>
                                            <div className="text-xs text-primary mt-1">
                                                {recipe.nutrition?.calories} kcal • {recipe.cooking_time || 20} min
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                            <Check />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-0 pb-2 text-center animate-fade-in h-full">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-2xl shadow-primary/20">
                            <img src={selectedRecipe.image_url} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-white">{selectedRecipe.title}</h3>
                        <p className="text-xs text-gray-400 mb-6 max-w-sm">{selectedRecipe.description}</p>

                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full max-w-xs mb-6">
                            <label className="block text-sm font-bold text-primary mb-4 uppercase tracking-wider">Number of Servings</label>
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => setCustomServings(Math.max(1, customServings - 1))}
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
                                >
                                    -
                                </button>
                                <span className="text-4xl font-black text-white">{customServings}</span>
                                <button
                                    onClick={() => setCustomServings(customServings + 1)}
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition-all font-medium"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/25 transition-all font-bold"
                            >
                                Add to Plan
                            </button>
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default RecipeSelector;

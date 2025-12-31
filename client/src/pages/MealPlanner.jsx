import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ShoppingCart, Save, Coffee, Sun, Moon, CalendarHeart, ShoppingBag, ChevronLeft, ChevronRight, Calendar, X, ChefHat } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeSelector from '../components/RecipeSelector';

const MealPlanner = () => {
    const navigate = useNavigate();
    const [weekPlan, setWeekPlan] = useState({
        Monday: { breakfast: [], lunch: [], dinner: [] },
        Tuesday: { breakfast: [], lunch: [], dinner: [] },
        Wednesday: { breakfast: [], lunch: [], dinner: [] },
        Thursday: { breakfast: [], lunch: [], dinner: [] },
        Friday: { breakfast: [], lunch: [], dinner: [] },
        Saturday: { breakfast: [], lunch: [], dinner: [] },
        Sunday: { breakfast: [], lunch: [], dinner: [] },
    });
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [shoppingList, setShoppingList] = useState([]);
    const [customIngredients, setCustomIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });
    // Date State: Always points to the Monday of the selected week
    const getMonday = (d) => {
        let date = new Date(d);
        // If string date, handle local timezone to avoid UTC shifting
        if (typeof d === 'string' && d.includes('-')) {
            const [y, m, day] = d.split('-').map(Number);
            date = new Date(y, m - 1, day);
        }

        const day = date.getDay(); // Sun=0, Mon=1...
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const result = new Date(date.getFullYear(), date.getMonth(), diff);

        const year = result.getFullYear();
        const month = String(result.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(result.getDate()).padStart(2, '0');
        return `${year}-${month}-${dayOfMonth}`;
    };

    const [selectedDate, setSelectedDate] = useState(getMonday(new Date()));
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showSelector, setShowSelector] = useState(false);
    const [activeSlot, setActiveSlot] = useState({ day: null, meal: null });
    const dateInputRef = useRef(null);

    const days = Object.keys(weekPlan);
    const meals = ['breakfast', 'lunch', 'dinner'];

    useEffect(() => {
        fetchMealPlan(selectedDate);
    }, [selectedDate]);



    const formatDisplayDate = (mondayStr) => {
        const [y, m, d] = mondayStr.split('-').map(Number);
        const start = new Date(y, m - 1, d);
        const end = new Date(y, m - 1, d + 6);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
    };

    const getDayWithDate = (mondayStr, dayName) => {
        const dayMap = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };
        const [y, m, d] = mondayStr.split('-').map(Number);
        const date = new Date(y, m - 1, d + dayMap[dayName]);
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    };

    const [isSaving, setIsSaving] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : null;
    };

    const fetchMealPlan = async (date) => {
        const emptyPlan = {
            Monday: { breakfast: [], lunch: [], dinner: [] },
            Tuesday: { breakfast: [], lunch: [], dinner: [] },
            Wednesday: { breakfast: [], lunch: [], dinner: [] },
            Thursday: { breakfast: [], lunch: [], dinner: [] },
            Friday: { breakfast: [], lunch: [], dinner: [] },
            Saturday: { breakfast: [], lunch: [], dinner: [] },
            Sunday: { breakfast: [], lunch: [], dinner: [] },
        };

        const headers = getAuthHeader();
        if (!headers) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/meal-plan?weekStart=${date}`, { headers });

            if (res.data && res.data.plan_json) {
                const fullPlan = JSON.parse(JSON.stringify(emptyPlan)); // Clone template
                const rawPlan = res.data.plan_json;

                Object.keys(rawPlan).forEach(day => {
                    if (fullPlan[day]) {
                        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
                            const slot = rawPlan[day][meal];
                            if (slot && Array.isArray(slot)) {
                                fullPlan[day][meal] = slot;
                            } else if (slot) {
                                fullPlan[day][meal] = [slot];
                            }
                        });
                    }
                });

                setWeekPlan(fullPlan);
            } else {
                setWeekPlan(emptyPlan);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch plan', err);
            setWeekPlan(emptyPlan);
            setLoading(false);
        }
    };

    const saveMealPlan = async (passedPlan = null) => {
        const headers = getAuthHeader();
        if (!headers) {
            navigate('/login');
            return;
        }

        setIsSaving(true);
        try {
            await axios.post('http://localhost:5000/api/meal-plan', {
                plan_json: passedPlan || weekPlan,
                weekStart: selectedDate
            }, { headers });
            setIsSaving(false);
        } catch (err) {
            console.error('Failed to save plan', err);
            setIsSaving(false);
            throw err; // Propagate for navigation guard
        }
    };

    const handleNavigation = async (newTarget) => {
        // If it's a direction number (-1 or 1)
        let finalDate = newTarget;
        if (typeof newTarget === 'number') {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            date.setDate(date.getDate() + (newTarget * 7));
            finalDate = getMonday(date);
        }

        try {
            // Optimistic auto-save current week before leaving
            await saveMealPlan();
        } catch (e) {
            console.log("Auto-save failed, but navigating anyway...");
        }
        setSelectedDate(finalDate);
    };

    const generateShoppingList = async () => {
        const headers = getAuthHeader();
        if (!headers) {
            navigate('/login');
            return;
        }

        try {
            console.log('[Shopping List] Starting generation process...');
            console.log('[Shopping List] Current meal plan:', weekPlan);
            console.log('[Shopping List] Week start:', selectedDate);

            // Auto-save first and wait for completion
            console.log('[Shopping List] Saving meal plan...');
            await saveMealPlan();
            console.log('[Shopping List] Meal plan saved successfully');

            // Small delay to ensure database write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('[Shopping List] Fetching shopping list from API...');
            const res = await axios.get(`http://localhost:5000/api/shopping-list?weekStart=${selectedDate}`, { headers });
            console.log('[Shopping List] Received response:', res.data);

            if (!res.data || res.data.length === 0) {
                console.warn('[Shopping List] Empty response received. This might mean:');
                console.warn('  - No recipes in the meal plan');
                console.warn('  - Meal plan not saved correctly');
                console.warn('  - Recipe IDs not found in database');
            }

            setShoppingList(res.data);
            setShowShoppingList(true);
        } catch (err) {
            console.error('[Shopping List] Error occurred:', err);
            console.error('[Shopping List] Error details:', err.response?.data || err.message);
            alert(`Failed to generate shopping list: ${err.response?.data?.error || err.message}`);
        }
    };

    const addIngredient = () => {
        if (newIngredient.name.trim()) {
            setCustomIngredients(prev => [...prev, { ...newIngredient }]);
            setNewIngredient({ name: '', quantity: '', unit: '' });
        }
    };

    const removeCustomIngredient = (index) => {
        setCustomIngredients(prev => prev.filter((_, idx) => idx !== index));
    };

    const updateIngredientQuantity = (recipeIndex, ingIndex, newQty) => {
        const newList = [...shoppingList];
        newList[recipeIndex].ingredients[ingIndex].quantity = newQty;
        setShoppingList(newList);
    };

    const removeRecipeIngredient = (recipeIndex, ingIndex) => {
        const newList = [...shoppingList];
        newList[recipeIndex].ingredients.splice(ingIndex, 1);
        setShoppingList(newList);
    };

    const openSelector = (day, meal) => {
        setActiveSlot({ day, meal });
        setShowSelector(true);
    };

    const handleRecipeSelect = (recipe) => {
        const { day, meal } = activeSlot;
        if (day && meal) {
            setWeekPlan(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [meal]: [
                        ...(prev[day][meal] || []), // Keep existing items
                        {
                            id: recipe.id,
                            title: recipe.title,
                            calories: recipe.nutrition?.calories,
                            userServings: recipe.userServings // Store custom servings
                        }
                    ]
                }
            }));
        }
        setShowSelector(false);
        setActiveSlot({ day: null, meal: null });
    };

    const clearSlot = (day, meal, indexToRemove) => {
        setWeekPlan(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [meal]: prev[day][meal].filter((_, idx) => idx !== indexToRemove)
            }
        }));
    };

    return (
        <div className="min-h-screen pt-28 px-6 pb-20 relative">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-6">
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <span className="text-gradient">Weekly Meal Planner</span>
                            <CalendarHeart className="text-secondary animate-pulse" size={32} />
                        </h1>
                        <p className="text-gray-400">Plan your nutritous meals and generate your shopping list instantly.</p>

                        {/* Week Navigator */}
                        <div className="flex items-center gap-4 mt-6 bg-white/5 p-2 rounded-2xl w-fit border border-white/5 backdrop-blur-sm shadow-inner shadow-black/20">
                            <button
                                onClick={() => handleNavigation(-1)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all hover:text-primary active:scale-90"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div
                                className="relative group/date cursor-pointer"
                                onClick={() => {
                                    if (dateInputRef.current) {
                                        try {
                                            dateInputRef.current.showPicker();
                                        } catch (e) {
                                            // Fallback for browsers without showPicker
                                            dateInputRef.current.click();
                                        }
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl border border-white/5 min-w-[200px] justify-center group-hover/date:border-primary/50 group-hover/date:bg-primary/5 transition-all">
                                    <Calendar size={16} className="text-primary/70" />
                                    <span className="text-sm font-bold text-white tracking-tight">
                                        {formatDisplayDate(selectedDate)}
                                    </span>
                                </div>
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    className="absolute inset-0 opacity-0 pointer-events-none"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleNavigation(getMonday(e.target.value));
                                        }
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => handleNavigation(1)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all hover:text-primary active:scale-90"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="w-px h-6 bg-white/10 mx-1"></div>

                            {isSaving && (
                                <div className="flex items-center gap-2 px-3 animate-fade-in">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                                    <span className="text-[10px] uppercase font-bold text-primary/70 tracking-widest">Saving</span>
                                </div>
                            )}

                            <button
                                onClick={() => handleNavigation(getMonday(new Date()))}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                Today
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <button
                            onClick={() => saveMealPlan()}
                            disabled={isSaving}
                            className={`bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 group ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Save size={20} className={`text-gray-400 group-hover:text-primary transition-colors ${isSaving ? 'animate-spin' : ''}`} />
                            <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
                        </button>
                        <button
                            onClick={generateShoppingList}
                            className="bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 group"
                        >
                            <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Shopping List</span>
                        </button>
                    </div>
                </div>

                {loading ? <div className="text-center text-gray-400 py-20 animate-pulse">Loading your plan...</div> : (
                    <div className="flex xl:grid xl:grid-cols-7 gap-4 overflow-x-auto pb-8 custom-scrollbar-hide xl:overflow-visible">
                        {days.map((day, dayIndex) => (
                            <div
                                key={day}
                                className="flex flex-col gap-6 animate-fade-in min-w-[280px] xl:min-w-0"
                                style={{ animationDelay: `${dayIndex * 100}ms` }}
                            >
                                {/* Day Header */}
                                <div className="text-center mb-2">
                                    <div className="inline-block font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-0 uppercase tracking-tighter">
                                        {day}
                                    </div>
                                    <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">
                                        {getDayWithDate(selectedDate, day)}
                                    </div>
                                    <div className="h-0.5 w-8 mx-auto bg-primary/20 rounded-full"></div>
                                </div>

                                {meals.map(meal => {
                                    let items = weekPlan[day][meal];
                                    if (!Array.isArray(items)) {
                                        items = items ? [items] : [];
                                    }

                                    // Icons for each meal type
                                    const MealIcon = meal === 'breakfast' ? Coffee : meal === 'lunch' ? Sun : Moon;
                                    const iconColor = meal === 'breakfast' ? 'text-orange-400' : meal === 'lunch' ? 'text-yellow-400' : 'text-indigo-400';

                                    return (
                                        <div key={`${day}-${meal}`} className="group relative">
                                            {/* Label */}
                                            <div className={`absolute -top-3 left-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md uppercase tracking-wider ${iconColor} shadow-lg shadow-black/20`}>
                                                {meal}
                                            </div>

                                            <div className="glass-panel p-4 min-h-[160px] flex flex-col gap-3 hover:border-white/30 hover:bg-white/5 transition-all duration-300">

                                                {/* Render List of Items */}
                                                <div className="flex-grow space-y-2 pt-2">
                                                    {items.map((item, idx) => (
                                                        <div key={idx} className="bg-white/5 p-2 rounded-lg border border-white/5 flex justify-between items-start group/item hover:bg-white/10 transition-colors cursor-default">
                                                            <div>
                                                                <div className="text-xs font-medium text-white line-clamp-2">{item.title}</div>
                                                                {item.calories && (
                                                                    <div className="text-[10px] text-gray-400">
                                                                        {item.calories} kcal • {item.userServings || '?'} svgs
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    clearSlot(day, meal, idx);
                                                                }}
                                                                className="text-white/20 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add Button (Always visible) */}
                                                <button
                                                    onClick={() => openSelector(day, meal)}
                                                    className={`w-full py-2 rounded-lg border-2 border-dashed border-white/10 text-white/20 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 ${items.length === 0 ? 'flex-grow' : 'mt-auto'}`}
                                                >
                                                    {items.length === 0 ? <MealIcon size={20} /> : <Plus size={14} />}
                                                    <span className="text-xs font-medium">{items.length === 0 ? 'Add' : 'Add More'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recipe Selector Modal */}
            {showSelector && (
                <RecipeSelector
                    onSelect={handleRecipeSelect}
                    onClose={() => setShowSelector(false)}
                />
            )}

            {/* Shopping List Modal */}
            {showShoppingList && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="shopping-list-modal">
                    <div className="glass-panel max-w-2xl w-full p-8 relative border border-primary/20 shadow-[0_0_50px_rgba(255,51,102,0.15)] max-h-[90vh] flex flex-col" id="shopping-list-content">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <ShoppingCart size={24} />
                            </div>
                            <span className="text-white">Shopping List</span>
                        </h2>

                        <button
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            onClick={() => setShowShoppingList(false)}
                        >
                            <X size={20} />
                        </button>

                        {/* Add Ingredient Form */}
                        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Add Custom Ingredient</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ingredient name"
                                    value={newIngredient.name}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Qty"
                                    value={newIngredient.quantity}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Unit"
                                    value={newIngredient.unit}
                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <button
                                    onClick={addIngredient}
                                    className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg font-medium transition-all flex items-center gap-2 text-white"
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {!shoppingList || shoppingList.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <ShoppingBag size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>Your list is empty.</p>
                                    <p className="text-sm">Add recipes to your plan or add custom ingredients above.</p>
                                </div>
                            ) : (
                                shoppingList.map((recipeGroup, groupIdx) => {
                                    // Safety check
                                    if (!recipeGroup || !recipeGroup.ingredients) return null;

                                    return (
                                        <div key={groupIdx} className="bg-white/5 rounded-xl border border-white/10 p-4">
                                            {/* Recipe Header */}
                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                                                <ChefHat size={18} className="text-primary" />
                                                <h4 className="font-bold text-white">{recipeGroup.recipeTitle || 'Recipe'}</h4>
                                                <span className="ml-auto text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                                                    {recipeGroup.servings || 0} servings
                                                </span>
                                            </div>

                                            {/* Ingredients List */}
                                            <div className="space-y-2">
                                                {recipeGroup.ingredients.map((item, idx) => {
                                                    if (!item) return null; // Safety check for bad data
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2 text-sm group">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></div>
                                                            <span className="capitalize text-gray-200 flex-grow">{item.name || item}</span>

                                                            <div className="flex items-center gap-2">
                                                                {item.unit && (
                                                                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-2 py-1">
                                                                        <input
                                                                            type="text"
                                                                            className="w-8 bg-transparent text-right text-xs text-primary outline-none"
                                                                            value={item.quantity || ''}
                                                                            onChange={(e) => updateIngredientQuantity(groupIdx, idx, e.target.value)}
                                                                        />
                                                                        <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                                                                    </div>
                                                                )}

                                                                <button
                                                                    onClick={() => removeRecipeIngredient(groupIdx, idx)}
                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-all"
                                                                    title="Remove from list"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Custom Ingredients Section */}
                            {customIngredients.length > 0 && (
                                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                                        <Plus size={18} className="text-secondary" />
                                        <h4 className="font-bold text-white">Custom Items</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {customIngredients.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary/50"></div>
                                                <span className="capitalize text-gray-200">{item.name}</span>
                                                {item.quantity && item.unit && (
                                                    <span className="text-xs text-secondary/70">
                                                        {item.quantity} {item.unit}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => removeCustomIngredient(idx)}
                                                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <button className="btn-primary w-full py-3 shadow-lg shadow-primary/25" onClick={() => window.print()}>
                                Print List
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;

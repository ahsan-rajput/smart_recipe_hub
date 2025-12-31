import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Shield,
    Database,
    ListTree,
    Users,
    MessageSquare,
    Trash2,
    Activity,
    Server,
    RefreshCw,
    AlertCircle,
    Utensils,
    UserPlus,
    UserMinus,
    Tag,
    Globe,
    Edit3,
    Save,
    X,
    ChevronRight,
    Plus
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('system');
    const [stats, setStats] = useState({ recipeCount: 0, userCount: 0, planCount: 0 });
    const [recipes, setRecipes] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [catalog, setCatalog] = useState({ cuisines: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [systemStatus, setSystemStatus] = useState('Checking...');
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isAddingRecipe, setIsAddingRecipe] = useState(false);
    const [addFormData, setAddFormData] = useState({
        title: '',
        cuisine: '',
        category: '',
        cooking_time: '',
        servings: '',
        image_url: '',
        youtube_url: '',
        description: '',
        ingredients_json: [],
        steps_json: [],
        nutritional_info_json: {}
    });

    useEffect(() => {
        fetchSystemData();
    }, []);

    const fetchSystemData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [statsRes, recipesRes, usersRes, reviewsRes, catalogRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', { headers }),
                axios.get('http://localhost:5000/api/recipes'),
                axios.get('http://localhost:5000/api/admin/users', { headers }),
                axios.get('http://localhost:5000/api/admin/reviews', { headers }),
                axios.get('http://localhost:5000/api/admin/catalog', { headers })
            ]);

            setStats(statsRes.data);
            setRecipes(recipesRes.data);
            setUsers(usersRes.data);
            setReviews(reviewsRes.data);
            setCatalog(catalogRes.data);
            setSystemStatus('Active & Secure');
            setLoading(false);
        } catch (err) {
            console.error('System synchronization failed', err);
            setSystemStatus('Connection Interrupted');
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Moderation: Permanently delete this review?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSystemData();
        } catch (err) {
            alert('Moderation failed');
        }
    };

    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSystemData();
        } catch (err) {
            alert('Role update failed');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`SECURITY OVERRIDE: Permanently terminate account for @${username}? This cannot be undone.`)) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSystemData();
            alert('Account terminated successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Account termination failed');
        }
    };

    const handleEditClick = (recipe) => {
        setEditingRecipe(recipe);
        setEditFormData({
            ...recipe,
            ingredients_json: typeof recipe.ingredients_json === 'string' ? JSON.parse(recipe.ingredients_json) : recipe.ingredients_json,
            steps_json: typeof recipe.steps_json === 'string' ? JSON.parse(recipe.steps_json) : recipe.steps_json,
            nutritional_info_json: typeof recipe.nutritional_info_json === 'string' ? JSON.parse(recipe.nutritional_info_json) : recipe.nutritional_info_json
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/recipes/${editingRecipe.id}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingRecipe(null);
            fetchSystemData();
            alert('Recipe node updated successfully');
        } catch (err) {
            alert('Failed to update recipe node');
        }
    };

    const handleAddRecipe = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/recipes', addFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddingRecipe(false);
            setAddFormData({
                title: '',
                cuisine: '',
                category: '',
                cooking_time: '',
                servings: '',
                image_url: '',
                youtube_url: '',
                description: '',
                ingredients_json: [],
                steps_json: [],
                nutritional_info_json: {}
            });
            fetchSystemData();
            alert('New recipe node created successfully');
        } catch (err) {
            alert('Failed to create recipe node');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
            <div className="text-center">
                <RefreshCw size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-mono">Synchronizing with System Database...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 px-6 pb-20 bg-[#0a0a0c] text-white overflow-hidden">
            <div className="container mx-auto max-w-7xl relative">

                {/* Background Decorator */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* System Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2 font-mono text-sm tracking-tighter">
                            <Shield size={16} /> [SYSTEM CONTROL CONSOLE : ROOT]
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                            System <span className="text-gradient">Console</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Environment Status</p>
                            <p className={`text-sm font-black flex items-center justify-end gap-2 ${systemStatus.includes('Active') ? 'text-green-400' : 'text-red-400'}`}>
                                <Activity size={14} className={systemStatus.includes('Active') ? 'animate-pulse' : ''} />
                                {systemStatus}
                            </p>
                        </div>
                        <button
                            onClick={fetchSystemData}
                            className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
                        >
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Console Navigation */}
                    <div className="lg:col-span-3 space-y-3">
                        <ConsoleTab
                            id="system"
                            label="System Health"
                            icon={Server}
                            active={activeTab}
                            onClick={setActiveTab}
                        />
                        <ConsoleTab
                            id="recipes"
                            label="Recipe Registry"
                            icon={Utensils}
                            active={activeTab}
                            onClick={setActiveTab}
                        />
                        <ConsoleTab
                            id="catalog"
                            label="Catalog Master"
                            icon={ListTree}
                            active={activeTab}
                            onClick={setActiveTab}
                        />
                        <ConsoleTab
                            id="users"
                            label="User & Admin Registry"
                            icon={Users}
                            active={activeTab}
                            onClick={setActiveTab}
                        />
                        <ConsoleTab
                            id="reviews"
                            label="Review Moderation"
                            icon={MessageSquare}
                            active={activeTab}
                            onClick={setActiveTab}
                        />
                    </div>

                    {/* Console Output */}
                    <div className="lg:col-span-9 animate-fade-in">

                        {/* SYSTEM HEALTH TAB */}
                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <DataNode label="Recipe Nodes" value={stats.recipeCount} sub="PLATFORM_DATA" onClick={() => setActiveTab('recipes')} />
                                    <DataNode label="Auth Sessions" value={stats.userCount} sub="USER_REGISTRY" onClick={() => setActiveTab('users')} />
                                    <DataNode label="System Plans" value={stats.planCount} sub="MEAL_PLAN_SYNC" />
                                    <DataNode label="Interactions" value={reviews.length} sub="USER_FEEDBACK" onClick={() => setActiveTab('reviews')} />
                                </div>

                                <div className="glass-panel p-8 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                        <Database className="text-primary" size={20} /> System Database Connection
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                                            <span className="text-gray-400 font-mono text-sm">Main Connection String:</span>
                                            <span className="text-secondary font-mono text-xs italic">sqlite_connector://smart_recipe_hub.db</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                                            <span className="text-gray-400 font-mono text-sm">Data Encryption:</span>
                                            <span className="text-green-400 font-bold text-xs uppercase tracking-widest">Active (Bcrypt-Hashed)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                                            <span className="text-gray-400 font-mono text-sm">Last Backup:</span>
                                            <span className="text-gray-200 font-mono text-xs">Today, {new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RECIPES TAB */}
                        {activeTab === 'recipes' && (
                            <div className="space-y-6">
                                <div className="glass-panel overflow-hidden border-white/5 bg-transparent">
                                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-sm font-bold font-mono text-primary">[RECIPE_REGISTRY_DATABASE]</h3>
                                            <button
                                                onClick={() => setIsAddingRecipe(true)}
                                                className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-sm text-[10px] font-black hover:bg-primary/20 transition-all flex items-center gap-2"
                                            >
                                                <Plus size={12} /> [ADD_NEW_NODE]
                                            </button>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono">COUNT: {stats.recipeCount}</div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left font-mono text-xs">
                                            <thead>
                                                <tr className="bg-white/5 text-gray-400 uppercase tracking-widest border-b border-white/10">
                                                    <th className="px-6 py-4">Title</th>
                                                    <th className="px-6 py-4">Cuisine</th>
                                                    <th className="px-6 py-4">Category</th>
                                                    <th className="px-6 py-4 text-right">Protection</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-gray-300">
                                                {recipes.map(recipe => (
                                                    <tr key={recipe.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4 font-bold text-white">{recipe.title}</td>
                                                        <td className="px-6 py-4 uppercase text-primary/70">{recipe.cuisine}</td>
                                                        <td className="px-6 py-4">{recipe.category}</td>
                                                        <td className="px-6 py-4 text-right overflow-hidden flex justify-end gap-3">
                                                            <button
                                                                onClick={() => handleEditClick(recipe)}
                                                                className="text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
                                                            >
                                                                <Edit3 size={14} /> [EDIT]
                                                            </button>
                                                            <button
                                                                onClick={() => { if (window.confirm('Delete node?')) axios.delete(`http://localhost:5000/api/recipes/${recipe.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(fetchSystemData) }}
                                                                className="text-red-500/50 hover:text-red-500 transition-colors flex items-center gap-1"
                                                            >
                                                                <Trash2 size={14} /> [DELETE]
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CATALOG MASTER TAB */}
                        {activeTab === 'catalog' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CatalogBox title="Global Cuisines" items={catalog.cuisines} icon={Globe} color="primary" />
                                <CatalogBox title="Dietary Categories" items={catalog.categories} icon={Tag} color="secondary" />
                            </div>
                        )}

                        {/* ACCOUNTS TAB */}
                        {activeTab === 'users' && (
                            <div className="glass-panel overflow-hidden border-white/5 bg-transparent">
                                <table className="w-full text-left font-mono text-xs">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 uppercase tracking-widest border-b border-white/10">
                                            <th className="px-6 py-4">UID</th>
                                            <th className="px-6 py-4">Account Identifier</th>
                                            <th className="px-6 py-4">Security Level</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-primary font-bold">#{user.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-bold">{user.username}</div>
                                                    <div className="text-gray-500 text-[10px]">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-0.5 rounded-sm text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-500'
                                                        }`}>
                                                        {user.role === 'admin' ? 'ADMIN' : 'USER'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleUpdateRole(user.id, user.role)}
                                                        className="text-[10px] font-bold text-primary/70 hover:text-primary border border-primary/20 hover:border-primary px-3 py-1 rounded-sm transition-all"
                                                    >
                                                        Toggle Role
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                                        className="text-[10px] font-bold text-red-500/50 hover:text-red-500 border border-red-500/20 hover:border-red-500 px-3 py-1 rounded-sm transition-all"
                                                    >
                                                        <UserMinus size={10} className="inline mr-1" /> Terminate
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 text-gray-500 font-mono italic">
                                        [ZERO_INTERACTION_NODES_FOUND]
                                    </div>
                                ) : (
                                    reviews.map(review => (
                                        <div key={review.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border-white/5 hover:border-white/10 transition-all group">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-primary font-black text-sm">@{review.username}</span>
                                                    <span className="text-gray-600 font-mono text-[10px] uppercase">On {review.recipe_title}</span>
                                                    <div className="flex text-yellow-500 text-[10px]">
                                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed italic">{review.comment}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* NODE EDITOR MODAL */}
            {editingRecipe && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-primary/20">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <div className="text-[10px] text-primary font-mono font-black tracking-[0.2em] uppercase mb-1">NODE_EDITOR_V2.0</div>
                                <h3 className="text-2xl font-black text-white italic">RECONFIGURING: <span className="text-gradient">{editingRecipe.title}</span></h3>
                            </div>
                            <button onClick={() => setEditingRecipe(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Title" value={editFormData.title} onChange={(v) => setEditFormData({ ...editFormData, title: v })} />
                                <InputField label="Cuisine" value={editFormData.cuisine} onChange={(v) => setEditFormData({ ...editFormData, cuisine: v })} />
                                <InputField label="Category" value={editFormData.category} onChange={(v) => setEditFormData({ ...editFormData, category: v })} />
                                <InputField label="Cooking Time (min)" value={editFormData.cooking_time} onChange={(v) => setEditFormData({ ...editFormData, cooking_time: v })} />
                                <InputField label="Servings" value={editFormData.servings} onChange={(v) => setEditFormData({ ...editFormData, servings: v })} />
                                <InputField label="Image URL" value={editFormData.image_url} onChange={(v) => setEditFormData({ ...editFormData, image_url: v })} />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Recipe Description</label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-primary outline-none min-h-[100px]"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <JSONArea label="Ingredients Registry" sub="ARRAY_DATA" value={editFormData.ingredients_json} onChange={(v) => setEditFormData({ ...editFormData, ingredients_json: v })} />
                                <JSONArea label="Preparation Steps" sub="SEQ_DATA" value={editFormData.steps_json} onChange={(v) => setEditFormData({ ...editFormData, steps_json: v })} />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/5">
                            <button
                                onClick={() => setEditingRecipe(null)}
                                className="px-6 py-3 font-mono text-sm font-bold text-gray-400 hover:text-white transition-all uppercase"
                            >
                                [CANCEL_OVERRIDE]
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="btn-primary px-8 py-3 flex items-center gap-2"
                            >
                                <Save size={18} /> [COMMIT_CHANGES]
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD NEW NODE MODAL */}
            {isAddingRecipe && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-primary/20">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <div className="text-[10px] text-primary font-mono font-black tracking-[0.2em] uppercase mb-1">NODE_CREATOR_V1.0</div>
                                <h3 className="text-2xl font-black text-white italic">INITIALIZING: <span className="text-gradient">NEW_RECIPE_NODE</span></h3>
                            </div>
                            <button onClick={() => setIsAddingRecipe(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Title" value={addFormData.title} onChange={(v) => setAddFormData({ ...addFormData, title: v })} />
                                <InputField label="Cuisine" value={addFormData.cuisine} onChange={(v) => setAddFormData({ ...addFormData, cuisine: v })} />
                                <InputField label="Category" value={addFormData.category} onChange={(v) => setAddFormData({ ...addFormData, category: v })} />
                                <InputField label="Cooking Time (min)" value={addFormData.cooking_time} onChange={(v) => setAddFormData({ ...addFormData, cooking_time: v })} />
                                <InputField label="Servings" value={addFormData.servings} onChange={(v) => setAddFormData({ ...addFormData, servings: v })} />
                                <InputField label="Image URL" value={addFormData.image_url} onChange={(v) => setAddFormData({ ...addFormData, image_url: v })} />
                                <InputField label="YouTube URL" value={addFormData.youtube_url} onChange={(v) => setAddFormData({ ...addFormData, youtube_url: v })} />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Recipe Description</label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-primary outline-none min-h-[100px]"
                                    value={addFormData.description}
                                    placeholder="Enter recipe description here..."
                                    onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <JSONArea label="Ingredients Registry" sub="ARRAY_DATA" value={addFormData.ingredients_json} onChange={(v) => setAddFormData({ ...addFormData, ingredients_json: v })} />
                                <JSONArea label="Preparation Steps" sub="SEQ_DATA" value={addFormData.steps_json} onChange={(v) => setAddFormData({ ...addFormData, steps_json: v })} />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/5">
                            <button
                                onClick={() => setIsAddingRecipe(false)}
                                className="px-6 py-3 font-mono text-sm font-bold text-gray-400 hover:text-white transition-all uppercase"
                            >
                                [ABORT_CREATION]
                            </button>
                            <button
                                onClick={handleAddRecipe}
                                className="btn-primary px-8 py-3 flex items-center gap-2"
                            >
                                <Plus size={18} /> [COMMIT_NEW_NODE]
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{label}</label>
        <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary outline-none"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const JSONArea = ({ label, sub, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
            {label} <span className="text-primary/50 ml-2">[{sub}]</span>
        </label>
        <textarea
            className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-[10px] font-mono focus:border-primary outline-none min-h-[200px] text-primary"
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
                try {
                    onChange(JSON.parse(e.target.value));
                } catch (err) {
                    // Temporarily store string if it's invalid JSON while typing
                    onChange(e.target.value);
                }
            }}
        />
    </div>
);

// UI Components
const ConsoleTab = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border-l-[3px] ${active === id
            ? 'bg-primary/10 text-primary border-primary shadow-[0_0_20px_rgba(255,51,102,0.1)]'
            : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
            }`}
    >
        <Icon size={20} />
        <span className="font-bold text-sm tracking-widest uppercase">{label}</span>
    </button>
);

const DataNode = ({ label, value, sub, onClick }) => (
    <div
        onClick={onClick}
        className={`glass-panel p-6 bg-black/40 border-white/5 border hover:border-primary/20 transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''}`}
    >
        <div className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1">{sub}</div>
        <div className="text-3xl font-black text-white mb-2">{value}</div>
        <div className="text-xs text-gray-400 font-bold uppercase">{label}</div>
    </div>
);

const CatalogBox = ({ title, items, icon: Icon, color }) => (
    <div className="glass-panel p-8 border-white/5">
        <h3 className={`text-xl font-black mb-6 flex items-center gap-3 text-${color}`}>
            <Icon size={22} /> {title}
        </h3>
        <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-mono text-gray-300 hover:border-primary/50 cursor-default transition-all">
                    {item}
                </span>
            ))}
            {items.length === 0 && <span className="text-gray-600 italic text-xs">[NO_DATA_SYNCED]</span>}
        </div>
    </div>
);

export default AdminDashboard;

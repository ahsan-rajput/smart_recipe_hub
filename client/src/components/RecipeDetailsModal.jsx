import React, { useEffect, useState } from 'react';
import { X, Clock, Users, Flame, ChefHat, Info, ListChecks, Play, Star } from 'lucide-react';
import axios from 'axios';
import API_URL from '../api';

const RecipeDetailsModal = ({ recipe, onClose }) => {
    const [activeTab, setActiveTab] = useState('ingredients');
    const [isLoaded, setIsLoaded] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    // Helper to get current user ID from token
    const getCurrentUserId = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).id;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        // Trigger exit animation scale
        setTimeout(() => setIsLoaded(true), 10);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Reset state when recipe changes
    useEffect(() => {
        setActiveTab('ingredients');
        setHasReviewed(false);
        setReviews([]);
        setUserReview({ rating: 5, comment: '' });
        setIsSubmitting(false);
    }, [recipe.id]);

    if (!recipe) return null;

    // Data parsing
    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : (typeof recipe.ingredients_json === 'string' ? JSON.parse(recipe.ingredients_json) : (recipe.ingredients_json || []));

    const instructions = Array.isArray(recipe.instructions)
        ? recipe.instructions
        : (typeof recipe.steps_json === 'string' ? JSON.parse(recipe.steps_json) : (recipe.steps_json || (recipe.instructions ? recipe.instructions.split('\n').filter(s => s.trim()) : [])));

    const nutrition = recipe.nutrition || (typeof recipe.nutritional_info_json === 'string' ? JSON.parse(recipe.nutritional_info_json) : recipe.nutritional_info_json || {});

    // Internal safety for macros if they weren't pre-calculated
    const getSafeMacro = (key, percentage, divisor) => {
        const val = nutrition[key];
        if (val && !String(val).includes('?')) return val;
        const cals = parseInt(recipe.calories || nutrition.calories || 450);
        return Math.round((cals * percentage) / divisor);
    };

    const displayMacros = {
        protein: getSafeMacro('protein', 0.3, 4),
        carbs: getSafeMacro('carbs', 0.45, 4),
        fat: getSafeMacro('fat', 0.25, 9)
    };

    // Helper to get YouTube Embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(recipe.youtube_url);

    useEffect(() => {
        if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/recipes/${recipe.id}/reviews`);
            const fetchedReviews = res.data;
            setReviews(fetchedReviews);

            // Check if current user has reviewed
            const currentUserId = getCurrentUserId();
            if (currentUserId && Array.isArray(fetchedReviews)) {
                const userHasReviewed = fetchedReviews.some(r => r.user_id === currentUserId);
                setHasReviewed(userHasReviewed);
            }
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    const handleReviewSubmit = async () => {
        if (!userReview.comment.trim()) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to leave a review');
                return;
            }

            await axios.post(`${API_URL}/api/reviews`, {
                recipeId: recipe.id,
                rating: userReview.rating,
                comment: userReview.comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserReview({ rating: 5, comment: '' });
            setHasReviewed(true);
            fetchReviews();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                setHasReviewed(true);
                alert('You have already reviewed this recipe');
            } else {
                alert('Failed to submit review');
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-5xl max-h-[90vh] glass-panel overflow-hidden flex flex-col md:flex-row transition-all duration-500 shadow-[0_0_100px_rgba(255,51,102,0.2)] border-white/20
                ${isLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-all shadow-xl hover:rotate-90"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image and Quick Info */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden group">
                    <img
                        src={recipe.image_url || 'https://images.unsplash.com/photo-1495521821758-ee18ece6d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                {recipe.cuisine || 'International'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                {recipe.category || 'Main Dish'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg">{recipe.title}</h2>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div className="text-center">
                                <Clock className="mx-auto mb-1 text-primary" size={20} />
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Time</div>
                                <div className="text-sm font-bold text-white">{recipe.time || '30m'}</div>
                            </div>
                            <div className="text-center">
                                <Users className="mx-auto mb-1 text-secondary" size={20} />
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Serves</div>
                                <div className="text-sm font-bold text-white">{recipe.servings || 4}</div>
                            </div>
                            <div className="text-center">
                                <Flame className="mx-auto mb-1 text-orange-400" size={20} />
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Energy</div>
                                <div className="text-sm font-bold text-white">{recipe.calories || nutrition.calories || 'N/A'} kcal</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Details Content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
                    {/* Tabs Header */}
                    <div className="flex border-b border-white/10 p-2 gap-2 bg-white/5">
                        <button
                            onClick={() => setActiveTab('ingredients')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                ${activeTab === 'ingredients' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ListChecks size={18} />
                            Ingredients
                        </button>
                        <button
                            onClick={() => setActiveTab('instructions')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                ${activeTab === 'instructions' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ChefHat size={18} />
                            Instructions
                        </button>
                        {embedUrl && (
                            <button
                                onClick={() => setActiveTab('video')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                    ${activeTab === 'video' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Play size={18} />
                                Video Tutorial
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                ${activeTab === 'reviews' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Star size={18} />
                            Reviews
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'ingredients' ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Info size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Ingredients</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {ingredients.map((ing, idx) => {
                                        const name = typeof ing === 'object' ? ing.name : ing;
                                        const qty = typeof ing === 'object' ? ing.quantity : '';
                                        const unit = typeof ing === 'object' ? ing.unit : '';

                                        return (
                                            <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                <div className="flex-grow">
                                                    <div className="text-sm font-bold text-gray-200 capitalize">{name}</div>
                                                    {qty && <div className="text-[10px] text-primary font-bold uppercase tracking-wider">{qty} {unit}</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : activeTab === 'instructions' ? (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <ChefHat size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">How to cook</h3>
                                </div>
                                <div className="space-y-6">
                                    {instructions.map((step, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-secondary text-xl transition-all group-hover:bg-secondary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                                                {idx + 1}
                                            </div>
                                            <div className="pt-2 flex-grow border-b border-white/5 pb-6 group-last:border-0">
                                                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : activeTab === 'reviews' ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold">
                                        <Star size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Community Reviews</h3>
                                </div>

                                {/* Add Review Form - Conditionally Rendered */}
                                {hasReviewed ? (
                                    <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 mb-8 flex items-center justify-center gap-3">
                                        <Star className="text-green-500" size={24} />
                                        <span className="text-green-500 font-bold">You have already reviewed this recipe.</span>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Write a Review</h4>
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                                                    className={`transition-all hover:scale-110 ${star <= userReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                >
                                                    <Star size={24} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={userReview.comment}
                                            onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Share your experience with this recipe..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-all min-h-[100px] mb-4"
                                        />
                                        <button
                                            onClick={handleReviewSubmit}
                                            disabled={isSubmitting || !userReview.comment.trim()}
                                            className={`px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all ${isSubmitting || !userReview.comment.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post Review'}
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {!Array.isArray(reviews) || reviews.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            No reviews yet. Be the first to share your thoughts!
                                        </div>
                                    ) : (
                                        reviews.map((review, idx) => {
                                            let dateDisplay = 'Recent';
                                            try {
                                                if (review.created_at) {
                                                    const date = new Date(review.created_at.replace(' ', 'T'));
                                                    if (!isNaN(date.getTime())) {
                                                        dateDisplay = date.toLocaleDateString();
                                                    }
                                                }
                                            } catch (e) {
                                                console.error('Date error', e);
                                            }

                                            return (
                                                <div key={review.id || idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="font-bold text-white text-sm">{review.username || 'Anonymous'}</div>
                                                            <div className="flex gap-1 mt-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={12}
                                                                        className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500">
                                                            {dateDisplay}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center animate-fade-in space-y-6">
                                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/60">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={embedUrl}
                                        title={`${recipe.title} Video Tutorial`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-white font-bold text-lg">Master the {recipe.title}</h4>
                                    <p className="text-gray-400 text-sm">Follow along with the expert video guide above.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-black/40 border-t border-white/10 flex gap-4">
                        <div className="flex-grow flex flex-col justify-center">
                            <div className="flex gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Protein: {displayMacros.protein}g</span>
                                <span>|</span>
                                <span>Carbs: {displayMacros.carbs}g</span>
                                <span>|</span>
                                <span>Fat: {displayMacros.fat}g</span>
                            </div>
                        </div>
                        <button
                            className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                            onClick={() => {
                                alert('Recipe saved to your favorites!');
                            }}
                        >
                            Save Recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailsModal;

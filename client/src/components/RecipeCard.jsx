import React from 'react';
import { Clock, Users, Flame, CheckCircle, AlertCircle, Heart } from 'lucide-react';

const RecipeCard = ({ recipe, showMatchInfo, onRate, onClick, isFavorite, onToggleFavorite }) => {
    // Parse JSON if needed (should be handled by parent, but safe check)
    const matches = recipe.matches || [];
    const missingCount = recipe.missingCount || 0;

    return (
        <div
            onClick={() => onClick && onClick(recipe)}
            className="glass-panel group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,51,102,0.2)] hover:border-primary/40 hover:-translate-y-2 flex flex-col h-full relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative h-52 overflow-hidden flex-shrink-0">
                <img
                    src={recipe.image_url || 'https://images.unsplash.com/photo-1495521821758-ee18ece6d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite && onToggleFavorite(recipe.id);
                    }}
                    className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-md transition-all z-20 shadow-lg border ${isFavorite
                        ? 'bg-primary border-primary text-white scale-110'
                        : 'bg-black/50 border-white/10 text-white/70 hover:text-white hover:scale-110'
                        }`}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                {/* View Details Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Recipe
                    </span>
                </div>

                {onRate && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRate(recipe); }}
                        className="absolute top-3 right-3 bg-black/50 hover:bg-primary text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"
                        title="Rate this recipe"
                    >
                        <Flame size={18} />
                    </button>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-1">{recipe.title}</h3>

                {/* Description or Match Info */}
                {showMatchInfo ? (
                    <div className="mb-4 space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                            <CheckCircle size={16} />
                            <span>{matches.length} matching ingredients</span>
                        </div>
                        {missingCount > 0 && (
                            <div className="text-primary text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                <span>Missing {missingCount} items</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                            Match: <span className="text-gray-400">{matches.join(', ')}</span>
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{recipe.description}</p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-400 mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{recipe.time || '30m'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Flame size={16} />
                        <span>{recipe.nutrition?.calories || recipe.nutritional_info_json?.calories || 'N/A'} kcal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;

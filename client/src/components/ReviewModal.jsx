import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ recipeId, onClose, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${API_URL}/api/reviews`,
                { recipe_id: recipeId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onReviewAdded();
            onClose();
        } catch (err) {
            console.error('Failed to submit review', err);
            setSubmitting(false);
            alert('Failed to submit review. Are you logged in?');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Rate this Recipe</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            >
                                <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary min-h-[100px]"
                        placeholder="Write a comment (optional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;

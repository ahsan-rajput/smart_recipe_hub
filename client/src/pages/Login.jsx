import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${API_URL}/api/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage')); // Notify Navbar
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="glass-panel p-8 w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 pl-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-white placeholder-gray-400"
                            placeholder="you@example.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 pl-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-white placeholder-gray-400"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 mt-4">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-300 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

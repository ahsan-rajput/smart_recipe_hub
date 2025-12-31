import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-food.png';
import iconSalad from '../assets/icon-salad.png';
import iconCalendar from '../assets/icon-calendar.png';
import iconCart from '../assets/icon-cart.png';
import iconAvocado from '../assets/icon-avocado.png';

// 3D Icons
import icon3dSearch from '../assets/3d_smart_search.png';
import icon3dPlanner from '../assets/3d_weekly_planner.png';
import icon3dShopping from '../assets/3d_shopping_list.png';

const Home = () => {
    return (
        <div className="relative min-h-screen pt-24 pb-12 px-6">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-secondary/10 to-transparent opacity-50 blur-3xl"></div>
            </div>

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mt-10 lg:mt-20">

                    {/* Text Section */}
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left animate-fade-in">
                        <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                            <span className="text-secondary font-semibold tracking-wider text-sm">✨ AI-POWERED KITCHEN ASSISTANT</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white">
                            Cook <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Smarter</span>,<br />
                            Eat <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Better</span>.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Your personalized culinary genius transforming how you plan, shop, and cook with intelligent recipes tailored just for you.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4">
                            <Link to="/recipes" className="btn-primary text-lg group">
                                Explore Recipes
                                <span className="hidden group-hover:inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                            <Link to="/planner" className="btn-secondary text-lg">
                                Start Planning
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-gray-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                10k+ Recipes
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
                                Smart AI
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"></span>
                                Weekly Plans
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="lg:w-1/2 relative lg:h-[600px] flex items-center justify-center">
                        <div className="relative w-full max-w-lg lg:max-w-xl aspect-square animate-float">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-20 blur-[100px] animate-pulse"></div>
                            <img
                                src={heroImage}
                                alt="Healthy delicious meal"
                                className="relative rounded-3xl shadow-2xl shadow-primary/20 object-cover w-full h-full rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105 border border-white/10"
                            />

                            {/* Floating Card 1 */}
                            <div className="absolute -left-8 top-20 glass-panel p-4 flex items-center gap-4 animate-float" style={{ animationDelay: '1s' }}>
                                <img src={iconAvocado} alt="Avocado" className="w-12 h-12 object-contain drop-shadow-xl" />
                                <div>
                                    <div className="text-sm font-bold text-white">Fresh Ingredients</div>
                                    <div className="text-xs text-gray-400">Tracked daily</div>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute -right-4 bottom-20 glass-panel p-4 flex items-center gap-4 animate-float" style={{ animationDelay: '2s' }}>
                                <img src={iconSalad} alt="Kcal" className="w-12 h-12 object-contain drop-shadow-xl" />
                                <div>
                                    <div className="text-sm font-bold text-white">350 kcal</div>
                                    <div className="text-xs text-gray-400">Perfectly balanced</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left pb-20">
                    <Link to="/pantry" className="glass-panel p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer border-t-4 border-t-transparent hover:border-t-primary block hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src={icon3dSearch} alt="Smart Search" className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Smart Search</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Find recipes by ingredients you already have. Stop wasting food and money.</p>
                    </Link>

                    <Link to="/planner" className="glass-panel p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer border-t-4 border-t-transparent hover:border-t-accent block hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src={icon3dPlanner} alt="Weekly Planner" className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Weekly Planner</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Organize your meals for the week effortlessly with AI-driven suggestions.</p>
                    </Link>

                    <Link to="/planner" className="glass-panel p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer border-t-4 border-t-transparent hover:border-t-secondary block hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/20">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-secondary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src={icon3dShopping} alt="Shopping Lists" className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Shopping Lists</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Generate smart shopping lists automatically from your meal plan.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Home;

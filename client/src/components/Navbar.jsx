import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Simple verification check by presence of token
    const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

    // Listen for storage events (login/logout updates)
    React.useEffect(() => {
        const handleStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`
                relative px-5 py-2 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300
                ${isActive(to)
                    ? 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(255,51,102,0.4)] scale-105 border border-primary/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'}
            `}
        >
            {children}
            {isActive(to) && (
                <span className="absolute inset-0 rounded-full animate-pulse bg-primary/5 pointer-events-none"></span>
            )}
        </Link>
    );

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass-panel border-b border-white/5 px-6 py-4 mt-4 mx-4 rounded-xl max-w-[calc(100%-2rem)]">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-tight transform hover:scale-105 transition-transform duration-300">
                    <span className="text-gradient">SmartRecipe</span>
                    <span className="text-white ml-2">Hub</span>
                </Link>
                <div className="hidden md:flex space-x-4 items-center">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/recipes">Recipes</NavLink>
                    <NavLink to="/planner">Meal Planner</NavLink>
                    <NavLink to="/pantry">My Pantry</NavLink>

                    <div className="w-px h-8 bg-white/10 mx-4"></div>

                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors hover:text-primary">Login</Link>
                            <Link to="/register" className="btn-primary text-sm shadow-lg shadow-primary/20">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { ToggleLeft } from "./ToggleLeft";
import { useTheme } from "./ThemeProvider";
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuthStore } from '../store/useAuthStore';

const Header = () => {
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { authUser, logout } = useAuthStore();

    // Log the current theme to debug
    console.log("Current theme:", theme);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        console.log("Switching theme to:", newTheme);
        setTheme(newTheme);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header
            className={`top-0 left-0 right-0 z-50 w-full transition-all shadow-lg duration-300 h-[5vh] flex items-center border-b border-slate-200 dark:border-slate-800 ${
                isScrolled
                    ? 'bg-slate-50 dark:bg-slate-900/95 backdrop-blur-sm shadow-md'
                    : 'bg-white dark:bg-slate-900'
            }`}
        >
            <div className="container mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
                <Link to='/'>
                    <Logo size={8} />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/problems">Problems</NavLink>
                    <NavLink to="/sheets">Sheets</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </nav>

                {/* Desktop Right Side */}
                <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                    <button 
                        onClick={toggleTheme} 
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        <ToggleLeft isActive={theme === "dark"} />
                    </button>
                    
                    {authUser ? (
                        <button
                            onClick={handleLogout}
                            className="text-xs sm:text-sm cursor-pointer font-bold bg-red-700 text-white hover:text-white hover:bg-red-800 px-3 py-1 rounded"
                        >
                            <div className="flex items-center">
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </div>
                        </button>
                    ) : (
                        <div className='flex gap-1 lg:gap-2'>
                            <Link to="/login">
                                <button
                                    className="text-xs sm:text-sm cursor-pointer font-bold bg-blue-700 text-white hover:text-white hover:bg-blue-800 px-3 py-1 rounded"
                                >
                                    Log In
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button
                                    className="text-xs sm:text-sm cursor-pointer font-bold bg-red-700 text-white hover:text-white hover:bg-red-800 px-3 py-1 rounded"
                                >
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu button */}
                <div className="md:hidden flex items-center space-x-1">
                    <button 
                        onClick={toggleTheme} 
                        className="cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        <ToggleLeft isActive={theme === "dark"} width={24} height={24} />
                    </button>
                    <button
                        className="p-1 text-gray-700 dark:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 top-[5vh] bg-slate-50 dark:bg-slate-900 z-40 transform ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out md:hidden`}
            >
                <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                    <MobileNavLink
                        to="/problems"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Problems
                    </MobileNavLink>
                    <MobileNavLink
                        to="/sheets"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Sheets
                    </MobileNavLink>
                    <MobileNavLink
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Profile
                    </MobileNavLink>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
                        {authUser ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full cursor-pointer font-bold bg-red-700 text-white hover:bg-red-800 py-2 rounded flex items-center justify-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full cursor-pointer font-bold bg-blue-700 text-white hover:bg-blue-800 py-2 rounded">
                                        Log In
                                    </button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full cursor-pointer font-bold bg-red-700 text-white hover:bg-red-800 py-2 rounded">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium text-lg py-2"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

export default Header;

import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Code, ChevronDown, Sun, Moon, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from "./ThemeProvider";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { authUser, logout } = useAuthStore();

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <header
            className={`z-50 transition-all duration-500 ease-in-out ${
                isScrolled 
                    ? 'fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] lg:w-[70%] xl:w-[60%] h-10 bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl' 
                    : 'w-full h-10 bg-gradient-to-r bg-slate-100/80 dark:bg-slate-950/80 dark:to-gray-800 border-b border-gray-200/30 dark:border-gray-700/30 shadow-sm'
            }`}
        >
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to='/' className="flex items-center space-x-2 group">
                    <Logo size={isScrolled ? 7 : 8} />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                    <NavLink to="/problems">Problems</NavLink>
                    <NavLink to="/sheets">Sheets</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </nav>

                {/* Desktop Right Side */}
                <div className="hidden md:flex items-center space-x-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        <div className="relative w-5 h-5">
                            <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                            <Moon className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                        </div>
                    </button>

                    {authUser ? (
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                            >
                                <div className="relative">
                                    <img
                                        src={authUser.avatar || "/default-avatar.png"}
                                        alt={authUser.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in slide-in-from-top-2 duration-200">
                                    {/* User Info */}
                                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={authUser.avatar || "/default-avatar.png"}
                                                alt={authUser.name}
                                                className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {authUser?.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                                    {authUser?.email}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {authUser?.league || 'Bronze'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <DropdownItem
                                            to="/profile"
                                            icon={User}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Profile
                                        </DropdownItem>
                                        
                                        {authUser?.role === "ADMIN" && (
                                            <DropdownItem
                                                to="/admin/add-problem"
                                                icon={Code}
                                                onClick={() => setDropdownOpen(false)}
                                                className="text-purple-600 dark:text-purple-400"
                                            >
                                                Add Problem
                                            </DropdownItem>
                                        )}
                                        
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Right Side */}
                <div className="md:hidden flex items-center space-x-2">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        <div className="relative w-5 h-5">
                            <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                            <Moon className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                        </div>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className="relative w-5 h-5">
                            <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                            <X className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Menu Panel */}
                <div className={`absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Info */}
                        {authUser && (
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <img
                                            src={authUser.avatar || "/default-avatar.png"}
                                            alt={authUser.name}
                                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {authUser?.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {authUser?.email}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {authUser?.league || 'Bronze'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="flex-1 p-6 space-y-2">
                            <MobileNavLink to="/problems" onClick={() => setMobileMenuOpen(false)}>
                                Problems
                            </MobileNavLink>
                            <MobileNavLink to="/sheets" onClick={() => setMobileMenuOpen(false)}>
                                Sheets
                            </MobileNavLink>
                            <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                Profile
                            </MobileNavLink>
                            
                            {authUser?.role === "ADMIN" && (
                                <MobileNavLink
                                    to="/admin/add-problem"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
                                >
                                    <Code className="w-5 h-5 mr-3" />
                                    Add Problem
                                </MobileNavLink>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            {authUser ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Desktop Navigation Link Component
function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
        >
            {children}
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
        </Link>
    );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, onClick, children, className = "" }) {
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 ${className}`}
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

// Dropdown Item Component
function DropdownItem({ to, icon: Icon, children, onClick, className = "" }) {
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
            onClick={onClick}
        >
            <Icon className="w-4 h-4 mr-3" />
            {children}
        </Link>
    );
}

export default Header;
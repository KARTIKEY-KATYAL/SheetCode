import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Code } from 'lucide-react';
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

    const LogoutButton = ({ children, className }) => (
        <button
            onClick={handleLogout}
            className={`w-full text-left flex items-center px-4 py-2 text-base font-semibold ${className}`}
        >
            {children}
        </button>
    );

    return (
   <header
  className={`z-50 h-[6vh] flex items-center border-b
    border-slate-200 dark:border-slate-800 bg-[#CBE4DE] dark:bg-[#03001C] shadow-lg
    scale-down-bottom-normal duration-300 ease-linear
    ${isScrolled 
      ? 'fixed top-4 left-1/2 border-black border-2  -translate-x-1/2 w-[95%] h-[8vh] md:w-[80%] lg:w-[60%]  rounded-2xl text-white backdrop-blur-sm shadow-md'
      : 'w-full top-0 left-0 translate-x-0 bg-white dark:bg-neutral-950 shadow-lg border-b-2 rounded-none'}
  `}>

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
                        /* User Profile and Dropdown */
                        <div className="dropdown dropdown-end text-white">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={
                                            authUser?.image ||
                                            "https://avatar.iran.liara.run/public/boy"
                                        }
                                        alt="User Avatar"
                                        className="object-cover"
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
                            >
                                <li>
                                    <p className="text-base font-semibold">
                                        {authUser?.name}
                                    </p>
                                    <hr className="border-gray-200/10" />
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="hover:bg-primary hover:text-white text-base font-semibold"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        My Profile
                                    </Link>
                                </li>
                                {authUser?.role === "ADMIN" && (
                                    <li>
                                        <Link
                                            to="/admin/add-problem"
                                            className="hover:bg-primary hover:text-white text-base font-semibold"
                                        >
                                            <Code className="w-4 h-4 mr-1" />
                                            Add Problem
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <LogoutButton className="hover:bg-primary hover:text-white">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </LogoutButton>
                                </li>
                            </ul>
                        </div>
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
                    {authUser ? (
                        <div className="dropdown dropdown-end mx-2">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex-shrink-0">
                                <div className="w-8 h-8 rounded-full">
                                    <img
                                        src={
                                            authUser?.image ||
                                            "https://avatar.iran.liara.run/public/boy"
                                        }
                                        alt="User Avatar"
                                        className="object-cover"
                                    />
                                </div>
                            </label>
                        </div>
                    ) : null}
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
                    {authUser && (
                        <div className="flex items-center mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                <img
                                    src={
                                        authUser?.image ||
                                        "https://avatar.iran.liara.run/public/boy"
                                    }
                                    alt="User Avatar"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{authUser?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{authUser?.email}</p>
                            </div>
                        </div>
                    )}
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
                    
                    {/* Admin link for mobile */}
                    {authUser && authUser.role === "ADMIN" && (
                        <MobileNavLink
                            to="/admin/add-problem"
                            onClick={() => setMobileMenuOpen(false)}
                            className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-md"
                        >
                            <span className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                Add Problem
                            </span>
                        </MobileNavLink>
                    )}
                    
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

function MobileNavLink({ to, onClick, children, className = "" }) {
    return (
        <Link
            to={to}
            className={`text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium text-lg py-2 ${className}`}
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

export default Header;
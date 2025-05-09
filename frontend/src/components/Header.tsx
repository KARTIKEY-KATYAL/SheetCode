import React, { useState, useEffect } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import { ToggleLeft } from "./ToggleLeft";
import { useTheme } from "./ThemeProvider";
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

type Props = {};

const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all shadow-lg duration-300 min-h-[5vh] flex items-center ${
        isScrolled
          ? 'bg-slate-50 dark:bg-slate-900/95 backdrop-blur-sm shadow-md'
          : 'bg-white dark:bg-slate-900'
      }`}
    >
      <div className="container mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
      <Link to='/'>
        <div className="flex gap-1 items-center text-base sm:text-xl font-bold">
          <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 dark:text-red-700" />
          <span className="text-red-600 dark:text-red-700">Sheet</span>
          <span className="text-blue-800 dark:text-blue-600">Code</span>
        </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/problems">Problems</NavLink>
          <NavLink href="/sheets">Sheets</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <div onClick={toggleTheme} className="cursor-pointer">
            <ToggleLeft isActive={theme === "dark"} />
          </div>
          <div className='flex gap-1 lg:gap-2'>
            <Button size="sm" className="text-xs sm:text-sm cursor-pointer font-bold bg-blue-700 text-white hover:text-white hover:bg-blue-800">
            <Link to="/login">
              Log In
            </Link>
            </Button>
            <Button size="sm" className="text-xs sm:text-sm cursor-pointer font-bold bg-red-700 text-white hover:text-white hover:bg-red-800">
            <Link to="/signup">
              Sign Up
            </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-1">
          <div onClick={toggleTheme} className="cursor-pointer">
            <ToggleLeft isActive={theme === "dark"} width={24} height={24} />
          </div>
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
            href="/problems"
            onClick={() => setMobileMenuOpen(false)}
          >
            Problems
          </MobileNavLink>
          <MobileNavLink
            href="/sheets"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sheets
          </MobileNavLink>
          <MobileNavLink
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </MobileNavLink>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
            <Button className="w-full">Log In</Button>
            <Button variant="destructive" className="w-full">Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium"
    >
      {children}
    </a>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium text-lg py-2"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default Header;

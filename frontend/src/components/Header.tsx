import React, { useState, useEffect } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import { ToggleLeft } from "./ToggleLeft";
import { useTheme } from "./ThemeProvider";
import { Button } from './ui/button';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[5vh] flex items-center ${
        isScrolled
          ? 'bg-slate-50 dark:bg-slate-900/95 backdrop-blur-sm shadow-md'
          : 'bg-white dark:bg-slate-900'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex gap-1 items-center text-xl font-bold">
          <Code2 className="h-5 w-5 text-red-500 dark:text-red-700" />
          <span className="text-red-600 dark:text-red-700">Sheet</span>
          <span className="text-blue-800 dark:text-blue-600">Code</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/problems">Problems</NavLink>
          <NavLink href="/sheets">Sheets</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <div onClick={toggleTheme} className="cursor-pointer">
            <ToggleLeft isActive={theme === "dark"} />
          </div>
          <div className='flex gap-1 '>
          <Button className="px-4 py-2 cursor-pointer font-bold bg-blue-700 text-white hover:text-blu ">
            Log In
          </Button>
          <Button className="px-4 py-2 cursor-pointer font-bold bg-red-700 text-white hover:text-blu">
            Sign Up
          </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <div className="flex items-center mr-4">
            <div onClick={toggleTheme} className="cursor-pointer">
              <ToggleLeft isActive={theme === "dark"} />
            </div>
          </div>
          <button
            className="text-gray-700 dark:text-white"
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
        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
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
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 w-full">
              Log In
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 w-full">
              Sign Up
            </button>
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
      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium"
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

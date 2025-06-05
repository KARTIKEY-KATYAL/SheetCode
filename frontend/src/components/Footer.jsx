import React from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  Heart,
  ArrowUp,
  Code,
  BookOpen,
  Users,
  Zap
} from 'lucide-react';

import Logo from "./Logo"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Logo size={10} />
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                Master Data Structures & Algorithms with AI-powered personalized learning. 
                Join thousands of developers preparing for technical interviews.
              </p>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-slate-800 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Problem Sets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Interview Prep
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    AI Tutor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Progress Tracker
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Leaderboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>hello@sheetcode.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3 text-slate-300 text-sm">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>San Francisco, CA<br />United States</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>© 2024 SheetCode. Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for developers worldwide</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <button 
                onClick={scrollToTop}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-all duration-300 hover:scale-105 group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:animate-bounce" />
                <span className="hidden sm:inline">Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
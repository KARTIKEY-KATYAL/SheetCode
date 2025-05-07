import React from 'react';
import { ArrowRight, Code2 } from 'lucide-react';

type Props = {};

function Hero({}: Props) {
  return (
    <div className="h-[100vh] pt-[5vh] bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155] flex flex-col items-center justify-center text-gray-900 dark:text-white px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex flex-wrap gap-2 items-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 justify-center lg:justify-start">
              <Code2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500 dark:text-red-600" />
              <span className="text-red-600 dark:text-red-500">Sheet</span>
              <span className="text-blue-800 dark:text-blue-500">Code</span>
            </div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Personalized Practice, Real Results.
            </h3>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Master coding challenges, prepare for interviews, and track your progress with personalized problem sets tailored to your skill level.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base font-semibold rounded-lg shadow-md inline-flex items-center justify-center transition-all">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-white/80 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-white/40 dark:border-slate-700/50 transform hover:-translate-y-1 transition-all">
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-primary dark:text-sky-400">1000+ Coding Problems</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Access a vast library of coding challenges across different difficulty levels and domains.</p>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-white/40 dark:border-slate-700/50 transform hover:-translate-y-1 transition-all">
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-primary dark:text-sky-400">20+ Curated Sheets</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Follow expert-crafted problem sheets that progressively build your skills.</p>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-white/40 dark:border-slate-700/50 transform hover:-translate-y-1 transition-all">
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-primary dark:text-sky-400">Track Your Progress</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitor your performance with detailed analytics and see how you improve over time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
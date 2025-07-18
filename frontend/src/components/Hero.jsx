<<<<<<< HEAD
import { ArrowRight, BrainCircuit, Code, Sparkles, Zap, Star } from 'lucide-react';
import Logo from './Logo';
import CodeSnippet from './CodeSnippet';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-40 md:pb-24 overflow-hidden relative bg-slate-950 dark:bg-slate-950 min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Code Symbols */}
        <div className="absolute top-20 left-10 text-red-500 opacity-30 animate-float">
          <Code size={24} />
        </div>
        <div className="absolute top-40 right-20 text-blue-500 opacity-30 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles size={28} />
        </div>
        <div className="absolute bottom-32 left-20 text-red-400 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
          <Zap size={32} />
        </div>
        <div className="absolute top-60 left-1/3 text-blue-400 opacity-30 animate-float" style={{ animationDelay: '3s' }}>
          <Star size={20} />
        </div>
        <div className="absolute bottom-20 right-1/4 text-red-600 opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
          <Code size={26} />
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-red-500 animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Moving Dots */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            
            <div className="animate-slideInLeft">
              <Logo size={30} />
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white animate-fadeInUp">
                Master <span className="text-red-500 animate-pulse">DSA</span>, 
                <br />
                Ace <span className="text-blue-500 animate-pulse">Interviews</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              Personalized coding practice with AI-powered problem recommendations,
              curated learning paths, and real-time progress tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideInLeft" style={{ animationDelay: '0.6s' }}>
              <Link 
                to="/problems" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 hover:border-blue-500 text-slate-300 hover:text-blue-400 font-semibold rounded-xl transition-all duration-300 hover:bg-blue-900/20 transform hover:scale-105"
              >
                Explore Features
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm text-slate-400 animate-slideInLeft" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center gap-2 animate-bounce" style={{ animationDelay: '1s' }}>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                1000+ Coding Problems
              </div>
              <div className="flex items-center gap-2 animate-bounce" style={{ animationDelay: '1.2s' }}>
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                20+ Curated Sheets
              </div>
              <div className="flex items-center gap-2 animate-bounce" style={{ animationDelay: '1.4s' }}>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                AI-Powered Learning
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-slideInRight" style={{ animationDelay: '0.5s' }}>
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 blur-3xl opacity-30 rounded-full bg-red-500/20 animate-pulse"></div>
            <div className="absolute inset-0 blur-2xl opacity-20 rounded-full bg-blue-500/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-slate-900 border border-slate-700 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
              {/* Animated Terminal Header */}
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <span className="text-xs font-mono text-slate-400 animate-fadeIn">problem.js</span>
                
                {/* Typing Indicator */}
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
                  <span className="text-xs text-slate-400">Live Coding...</span>
                </div>
              </div>
              
              <div className="relative">
                <CodeSnippet />
                
                {/* Overlay Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute -top-4 -right-4 space-y-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-4 -left-4 bg-black border border-red-500 rounded-lg p-3 animate-fadeInUp" style={{ animationDelay: '1.5s' }}>
              <div className="text-red-500 font-bold text-lg">99%</div>
              <div className="text-slate-400 text-xs">Success Rate</div>
            </div>
=======
import React from 'react';
import { ArrowRight, Code2, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function Hero() {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 dark:bg-grid-slate-800/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 dark:from-red-500/5 dark:to-blue-500/5 animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-blue-500/10 dark:from-red-500/20 dark:to-blue-500/20 border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                The Next Generation Coding Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Master Coding.
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                Achieve Excellence.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Join thousands of developers mastering algorithms and data structures through our curated problem sets and intelligent learning system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {authUser ? (
                <Link to="/problems" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Start Solving
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <Link to="/signup" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
              <Link to="/sheets" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Explore Sheets
              </Link>
            </div>
          </div>

          {/* Right Column - Stats & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatsCard
              icon={<Trophy className="w-8 h-8 text-yellow-500" />}
              title="1000+"
              description="Coding Problems"
              gradient="from-yellow-500/20 to-orange-500/20"
            />
            <StatsCard
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="50K+"
              description="Active Users"
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <StatsCard
              icon={<Code2 className="w-8 h-8 text-red-500" />}
              title="20+"
              description="Curated Sheets"
              gradient="from-red-500/20 to-pink-500/20"
            />
            <StatsCard
              icon={<Zap className="w-8 h-8 text-purple-500" />}
              title="24/7"
              description="AI Support"
              gradient="from-purple-500/20 to-indigo-500/20"
            />
>>>>>>> 67475c78d7d2ae30590ce59a98f8187dd6b63e55
          </div>
        </div>
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="fill-slate-50 dark:fill-slate-900 w-full h-16">
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"></path>
          <animate attributeName="d" dur="10s" repeatCount="indefinite" 
            values="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z;
                    M0,40L48,45C96,50,192,60,288,65C384,70,480,70,576,65C672,60,768,50,864,47C960,50,1056,60,1152,65C1248,70,1344,70,1392,70L1440,70L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z;
                    M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" />
        </svg>
      </div>
    </section>
  );
};

function StatsCard({ icon, title, description, gradient }) {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-200`}>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg">
        {icon}
        <h3 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default Hero;
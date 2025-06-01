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
          </div>
        </div>
      </div>
    </div>
  );
}

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
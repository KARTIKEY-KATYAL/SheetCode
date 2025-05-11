import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="min-h-[100vh] py-12 sm:py-16 md:py-20 bg-gray-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background Code Lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-primary/30 dark:bg-sky-500/30"
            style={{ 
              top: `${(i * 100) / 15}%`,
              opacity: 0.1 + (i % 3) * 0.1
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-primary/70 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent flex flex-wrap items-center justify-center gap-2">
            <span>How</span> <Logo size={12} /> <span>Works</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-slate-300 max-w-2xl mx-auto">
            A simple yet effective process to help you master coding skills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6 sm:space-y-8">
              <Step 
                number="01" 
                title="Create Your Profile" 
                description="Sign up and complete a skill assessment to get personalized problem recommendations."
              />
              <Step 
                number="02" 
                title="Practice Daily Challenges" 
                description="Solve daily coding problems tailored to your skill level and learning goals."
              />
              <Step 
                number="03" 
                title="Track Your Progress" 
                description="Monitor your performance with detailed analytics and see how you improve over time."
              />
              <Step 
                number="04" 
                title="Join Competitions" 
                description="Test your skills against others in weekly coding competitions and challenges."
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 shadow-2xl shadow-primary/5 dark:shadow-sky-500/5 max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="bg-gray-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                <div className="flex items-center bg-gray-200 dark:bg-slate-800 px-3 sm:px-4 py-1 sm:py-2 space-x-1 sm:space-x-2">
                  <div className="h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-red-500"></div>
                  <div className="h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-gray-600 dark:text-slate-400">problem.js</div>
                </div>
                <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm">
                  <p className="text-gray-500 dark:text-slate-400">// Two Sum Problem</p>
                  <p className="text-gray-500 dark:text-slate-400">// Find two numbers that add up to target</p>
                  <p className="text-gray-800 dark:text-slate-300">
                    <span className="text-purple-600 dark:text-purple-400">function</span> <span className="text-blue-600 dark:text-sky-300">twoSum</span><span className="text-yellow-600 dark:text-yellow-300">(</span><span className="text-orange-600 dark:text-orange-300">nums</span>, <span className="text-orange-600 dark:text-orange-300">target</span><span className="text-yellow-600 dark:text-yellow-300">)</span> <span className="text-yellow-600 dark:text-yellow-300">{'{'}</span>
                  </p>
                  <p className="text-gray-800 dark:text-slate-300 pl-2 sm:pl-4">
                    <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-blue-600 dark:text-blue-300">map</span> <span className="text-gray-800 dark:text-white">=</span> <span className="text-purple-600 dark:text-purple-400">new</span> <span className="text-green-600 dark:text-green-300">Map</span><span className="text-yellow-600 dark:text-yellow-300">()</span><span className="text-gray-800 dark:text-white">;</span>
                  </p>
                  <p className="text-gray-800 dark:text-slate-300 pl-2 sm:pl-4">
                    <span className="text-purple-600 dark:text-purple-400">for</span><span className="text-yellow-600 dark:text-yellow-300">(</span><span className="text-purple-600 dark:text-purple-400">let</span> <span className="text-blue-600 dark:text-blue-300">i</span> <span className="text-gray-800 dark:text-white">=</span> <span className="text-orange-600 dark:text-orange-300">0</span><span className="text-gray-800 dark:text-white">;</span> <span className="text-blue-600 dark:text-blue-300">i</span> <span className="text-gray-800 dark:text-white">&lt;</span> <span className="text-blue-600 dark:text-blue-300">nums</span><span className="text-gray-800 dark:text-white">.</span><span className="text-blue-600 dark:text-blue-300">length</span><span className="text-gray-800 dark:text-white">;</span> <span className="text-blue-600 dark:text-blue-300">i</span><span className="text-gray-800 dark:text-white">++</span><span className="text-yellow-600 dark:text-yellow-300">)</span> <span className="text-yellow-600 dark:text-yellow-300">{'{'}</span>
                  </p>
                  <p className="text-gray-800 dark:text-slate-300 pl-4 sm:pl-8">
                    <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-blue-600 dark:text-blue-300">complement</span> <span className="text-gray-800 dark:text-white">=</span> <span className="text-blue-600 dark:text-blue-300">target</span> <span className="text-gray-800 dark:text-white">-</span> <span className="text-blue-600 dark:text-blue-300">nums</span><span className="text-gray-800 dark:text-white">[</span><span className="text-blue-600 dark:text-blue-300">i</span><span className="text-gray-800 dark:text-white">]</span><span className="text-gray-800 dark:text-white">;</span>
                  </p>
                  <p className="animate-pulse text-gray-900 dark:text-white">
                    <span className="pl-4 sm:pl-8">
                      <span className="text-purple-600 dark:text-purple-400">if</span><span className="text-yellow-600 dark:text-yellow-300">(</span><span className="text-blue-600 dark:text-blue-300">map</span><span className="text-gray-800 dark:text-white">.</span><span className="text-cyan-600 dark:text-cyan-300">has</span><span className="text-yellow-600 dark:text-yellow-300">(</span><span className="text-blue-600 dark:text-blue-300">complement</span><span className="text-yellow-600 dark:text-yellow-300">)</span><span className="text-yellow-600 dark:text-yellow-300">)</span> <span className="text-yellow-600 dark:text-yellow-300">{'{'}</span>
                    </span>
                  </p>
                  <p className="text-gray-800 dark:text-slate-300 pl-6 sm:pl-12">
                    <span className="text-green-600 dark:text-green-300">...</span>
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-200/50 dark:bg-slate-800/50 mt-2 sm:mt-4 border-t border-gray-300 dark:border-slate-700">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <div className="text-gray-600 dark:text-slate-400">Time Complexity: O(n)</div>
                    <div className="text-green-600 dark:text-green-400 flex items-center"><CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Tests Passed: 36/36</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({number, title, description} ) {
  return (
    <div className="flex items-start">
      <div className="bg-primary/10 text-primary dark:bg-sky-500/10 dark:text-sky-400 font-bold text-base sm:text-lg h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 shrink-0">
        {number}
      </div>
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
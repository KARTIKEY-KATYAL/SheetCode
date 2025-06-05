import React from 'react';
import { 
  Brain, 
  Target, 
  BarChart3, 
  Users, 
  Code, 
  BookOpen,
  Zap,
  Trophy,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized problem suggestions based on your skill level and learning patterns.",
      iconBg: "bg-red-600",
      cardBg: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      icon: Target,
      title: "Curated Problem Sets",
      description: "Access expertly designed problem collections for systematic skill development.",
      iconBg: "bg-blue-600",
      cardBg: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and performance insights.",
      iconBg: "bg-slate-600",
      cardBg: "bg-slate-50 dark:bg-slate-800/50",
      textColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Code,
      title: "Multiple Languages",
      description: "Practice in your preferred programming language with comprehensive support.",
      iconBg: "bg-red-600",
      cardBg: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      icon: BookOpen,
      title: "Study Sheets",
      description: "Create and share custom problem collections for focused learning sessions.",
      iconBg: "bg-blue-600",
      cardBg: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Learn from others with shared solutions and collaborative problem-solving.",
      iconBg: "bg-slate-600",
      cardBg: "bg-slate-50 dark:bg-slate-800/50",
      textColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Zap,
      title: "Real-time Feedback",
      description: "Get instant feedback on your solutions with automated testing and hints.",
      iconBg: "bg-red-600",
      cardBg: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges and climb leagues as you master different programming concepts.",
      iconBg: "bg-blue-600",
      cardBg: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm mb-6 shadow-sm">
            <Zap size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Everything You Need to 
            <br />
            <span className="text-red-600 dark:text-red-400">
              Excel in Coding
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need 
            to master data structures, algorithms, and ace your technical interviews.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-xl p-6 h-full border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-lg ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${feature.textColor}`}>
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have improved their coding skills and landed their dream jobs with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg">
                Start Learning Now
              </button>
              <button className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-semibold rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
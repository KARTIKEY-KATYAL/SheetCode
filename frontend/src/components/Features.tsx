import React from 'react';
import { 
  BookOpen, 
  Code, 
  BarChart, 
  Clock, 
  Users, 
  Award, 
  Globe, 
  Laptop, 
  Cpu
} from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-sky-400" />,
    title: "Comprehensive Library",
    description: "Access over 1,000 coding problems across different difficulty levels and domains."
  },
  {
    icon: <Code className="h-6 w-6 text-sky-400" />,
    title: "Syntax Highlighting",
    description: "Write code with full support for syntax highlighting across multiple languages."
  },
  {
    icon: <BarChart className="h-6 w-6 text-sky-400" />,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics on problem-solving speed and accuracy."
  },
  {
    icon: <Clock className="h-6 w-6 text-sky-400" />,
    title: "Timed Challenges",
    description: "Prepare for coding interviews with timed challenges that simulate real-world pressure."
  },
  {
    icon: <Users className="h-6 w-6 text-sky-400" />,
    title: "Community Solutions",
    description: "Learn from others by exploring community solutions after solving problems."
  },
  {
    icon: <Award className="h-6 w-6 text-sky-400" />,
    title: "Achievement System",
    description: "Stay motivated with badges and achievements as you improve your skills."
  },
  {
    icon: <Globe className="h-6 w-6 text-sky-400" />,
    title: "Global Leaderboards",
    description: "Compare your performance with other coders around the world."
  },
  {
    icon: <Laptop className="h-6 w-6 text-sky-400" />,
    title: "Multiple Languages",
    description: "Practice in your preferred language with support for Python, JavaScript, Java, C++, and more."
  },
  {
    icon: <Cpu className="h-6 w-6 text-sky-400" />,
    title: "Intelligent Test Cases",
    description: "Verify your solutions against comprehensive test cases that catch edge cases."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Powerful Features for Effective Learning
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            SheetCode provides everything you need to improve your coding skills and prepare for technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-3 bg-slate-700/50 rounded-lg inline-block mb-4 group-hover:bg-sky-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
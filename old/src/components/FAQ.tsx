import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is SheetCode?",
    answer: "SheetCode is an interactive platform for learning and practicing coding skills through personalized challenges. We offer a comprehensive library of problems, advanced analytics, and a supportive community to help you become a better programmer."
  },
  {
    question: "What programming languages are supported?",
    answer: "SheetCode supports all major programming languages including JavaScript, Python, Java, C++, Ruby, Go, and many more. You can switch between languages at any time to practice your skills across different environments."
  },
  {
    question: "How does the adaptive learning system work?",
    answer: "Our adaptive learning system analyzes your performance on problems to identify your strengths and weaknesses. Based on this analysis, we recommend problems that will challenge you appropriately and focus on areas where you need improvement."
  },
  {
    question: "Can I prepare for coding interviews with SheetCode?",
    answer: "Absolutely! SheetCode is designed to help you prepare for technical interviews with companies like Google, Amazon, and Microsoft. Our problems cover common interview topics, and we offer mock interview simulations to help you practice under realistic conditions."
  },
  {
    question: "Is SheetCode suitable for beginners?",
    answer: "Yes, SheetCode is suitable for programmers of all levels. Beginners can start with our introductory problems and tutorials, while more experienced programmers can dive into challenging algorithm questions and specialized topics."
  },
  {
    question: "How does billing work for subscription plans?",
    answer: "For monthly plans, you'll be billed every month on the date you signed up. For annual plans, you'll be billed once per year. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-100 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-700 dark:text-slate-300 max-w-2xl mx-auto">
            Have questions about SheetCode? We have answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`mb-4 bg-white dark:bg-slate-900/50 border ${
                openIndex === index 
                  ? 'border-primary dark:border-sky-500' 
                  : 'border-gray-200 dark:border-slate-800'
              } rounded-lg overflow-hidden transition-all duration-200 shadow-sm`}
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-primary dark:text-sky-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400 dark:text-slate-400" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 dark:text-slate-400">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <a href="#" className="text-primary hover:text-primary-dark dark:text-sky-400 dark:hover:text-sky-300 font-medium">
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
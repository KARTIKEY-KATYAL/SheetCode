import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Zap, Code, Award, Target, MemoryStick, Brain, TrendingUp, Lightbulb, Loader2, Bot, BarChart3, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const SubmissionResults = ({ submission }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!submission) return null;

  const allPassed = submission.testCases?.every(tc => tc.passed) || false;
  const passedTestCases = submission.testCases?.filter(tc => tc.passed).length || 0;
  const totalTestCases = submission.testCases?.length || 0;

  // Helper function to safely parse JSON data
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Get time and memory arrays
  const timeArray = safeParse(submission.time || "[]");
  const memoryArray = safeParse(submission.memory || "[]");

  // Calculate average time
  const calculateAverageTime = () => {
    if (!timeArray || timeArray.length === 0) return 'N/A';
    
    const timeValues = timeArray.map(time => {
      if (typeof time === 'string') {
        return parseFloat(time.split(' ')[0]) * 1000;
      }
      return parseFloat(time) * 1000;
    }).filter(time => !isNaN(time));
    
    if (timeValues.length === 0) return 'N/A';
    
    const avgTime = timeValues.reduce((acc, curr) => acc + curr, 0) / timeValues.length;
    return avgTime.toFixed(2);
  };

  // Calculate average memory
  const calculateAverageMemory = () => {
    if (!memoryArray || memoryArray.length === 0) return 'N/A';
    
    const memoryValues = memoryArray.map(memory => {
      if (typeof memory === 'string') {
        return parseFloat(memory.split(' ')[0]);
      }
      return parseFloat(memory);
    }).filter(memory => !isNaN(memory));
    
    if (memoryValues.length === 0) return 'N/A';
    
    const avgMemory = memoryValues.reduce((acc, curr) => acc + curr, 0) / memoryValues.length;
    return avgMemory.toFixed(2);
  };

  // Generate AI Analysis
  const generateAIAnalysis = async () => {
    if (isLoadingAnalysis || aiAnalysis) return;

    setIsLoadingAnalysis(true);
    setShowAnalysis(true);
    
    try {
      const response = await axiosInstance.post('/chat/analyze-submission', {
        submissionId: submission.id,
        sourceCode: submission.sourceCode?.code || '',
        language: submission.language,
        status: submission.status,
        testCases: submission.testCases,
        averageTime: calculateAverageTime(),
        averageMemory: calculateAverageMemory(),
        problemId: submission.problemId
      });

      setAiAnalysis(response.data.data.analysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setAiAnalysis({
        performance: "Unable to generate analysis at this time. Please try again later.",
        timeComplexity: "O(?)",
        spaceComplexity: "O(?)",
        suggestions: ["Try running the analysis again later"],
        strengths: ["Code executed successfully"],
        codeQuality: "Good"
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const toggleAnalysis = () => {
    if (!aiAnalysis && !isLoadingAnalysis) {
      generateAIAnalysis();
    } else {
      setShowAnalysis(!showAnalysis);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <div className={`rounded-xl p-6 text-white shadow-lg border-2 transition-all duration-300 ${
        allPassed 
          ? 'bg-blue-600 border-blue-700' 
          : 'bg-red-600 border-red-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {allPassed ? (
              <Award className="w-8 h-8 animate-pulse" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {allPassed ? "Accepted" : "Failed"}
              </h2>
              <p className="opacity-90">
                {allPassed ? "Great job! All test cases passed." : "Some test cases failed. Keep trying!"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{passedTestCases}/{totalTestCases}</div>
            <div className="text-sm opacity-90">Test Cases</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Only 3 columns now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              allPassed ? 'bg-blue-600' : 'bg-red-600'
            }`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className={`text-lg font-bold ${
                allPassed ? 'text-blue-400' : 'text-red-400'
              }`}>
                {submission.status}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Runtime</p>
              <p className="text-lg font-bold text-blue-400">
                {calculateAverageTime()} ms
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-600">
              <MemoryStick className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Memory</p>
              <p className="text-lg font-bold text-red-400">
                {calculateAverageMemory()} KB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="bg-gray-800 rounded-xl shadow-lg border-2 border-gray-700 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Test Case Results
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="text-gray-300 font-semibold">Test Case</th>
                <th className="text-gray-300 font-semibold">Status</th>
                <th className="text-gray-300 font-semibold">Runtime</th>
                <th className="text-gray-300 font-semibold">Memory</th>
                <th className="text-gray-300 font-semibold">Input</th>
                <th className="text-gray-300 font-semibold">Expected Output</th>
                <th className="text-gray-300 font-semibold">Your Output</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCases?.map((testCase, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 border-l-4 ${
                    testCase.passed
                      ? "border-blue-500 bg-blue-900/10 hover:bg-blue-900/20"
                      : "border-red-500 bg-red-900/10 hover:bg-red-900/20"
                  }`}
                >
                  <td className="font-semibold text-gray-300">
                    #{testCase.testCase || index + 1}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-blue-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Passed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Failed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {timeArray[index] || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-red-400">
                      <MemoryStick className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {memoryArray[index] || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300 overflow-x-auto">
                        {testCase.input || "N/A"}
                      </pre>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300 overflow-x-auto">
                        {testCase.expected || "N/A"}
                      </pre>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                      <pre className={`text-sm font-mono whitespace-pre-wrap overflow-x-auto ${
                        !testCase.passed ? "text-red-400" : "text-gray-300"
                      }`}>
                        {testCase.stdout || "N/A"}
                      </pre>
                      {testCase.stderr && (
                        <pre className="text-red-400 mt-2 text-sm">
                          Error: {testCase.stderr}
                        </pre>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compilation Errors */}
      {submission.testCases?.some(tc => tc.compileOutput) && (
        <div className="bg-red-900/20 border-2 border-red-600 rounded-xl p-6">
          <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Compilation Errors
          </h4>
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-600">
            <pre className="whitespace-pre-wrap text-red-300 text-sm font-mono overflow-x-auto">
              {submission.testCases.find(tc => tc.compileOutput)?.compileOutput}
            </pre>
          </div>
        </div>
      )}

      {/* AI Analysis Button - Now at Bottom */}
      <div className="flex justify-center">
        <button
          onClick={toggleAnalysis}
          disabled={isLoadingAnalysis}
          className="group relative overflow-hidden bg-gradient-to-r bg-red-700 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            {isLoadingAnalysis ? (
              <>
                <div className="relative">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <div className="absolute inset-0 w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <span className="text-lg">AI is Analyzing Your Code...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Brain className="w-6 h-6 group-hover:animate-pulse" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-ping text-yellow-300" />
                </div>
                <span className="text-lg">
                  {aiAnalysis ? 'View AI Analysis Report' : 'Get AI Code Analysis'}
                </span>
                {showAnalysis ? (
                  <ChevronUp className="w-5 h-5 group-hover:transform group-hover:-translate-y-1 transition-transform" />
                ) : (
                  <ChevronDown className="w-5 h-5 group-hover:transform group-hover:translate-y-1 transition-transform" />
                )}
              </>
            )}
          </div>
          
          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
          </div>
        </button>
      </div>

      {/* AI Analysis Section - Paragraph Format at Bottom */}
      {showAnalysis && (
        <div className="transform transition-all duration-700 ease-out animate-slideInUp">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-600/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="relative">
                  <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                  <Sparkles className="w-3 h-3 text-blue-400 absolute -top-1 -right-1 animate-ping" />
                </div>
                AI Code Analysis Report
              </h3>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>

            {isLoadingAnalysis ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <Brain className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="flex space-x-1 mb-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-gray-300 text-lg font-medium animate-pulse">AI is analyzing your code...</p>
                <p className="text-gray-500 text-sm mt-2">Analyzing complexity, performance, and code quality...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Single Comprehensive Analysis Paragraph */}
                <div className="bg-gradient-to-r from-gray-900/80 to-black/80 p-6 rounded-xl border border-gray-700">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-300 leading-relaxed text-base space-y-4">
                      
                      {/* Main Analysis Paragraph */}
                      <p className="animate-typewriter">
                        <span className="text-purple-400 font-semibold">🧠 AI Analysis:</span> 
                        Your code submission has been thoroughly analyzed. 
                        {aiAnalysis.performance && (
                          <span> {aiAnalysis.performance}</span>
                        )}
                        {' '}The algorithm demonstrates a time complexity of{' '}
                        <span className="text-blue-400 font-bold bg-blue-900/30 px-2 py-1 rounded">
                          {aiAnalysis.timeComplexity || 'O(?)'}
                        </span>
                        {' '}and space complexity of{' '}
                        <span className="text-red-400 font-bold bg-red-900/30 px-2 py-1 rounded">
                          {aiAnalysis.spaceComplexity || 'O(?)'}
                        </span>
                        , which provides insights into the scalability and efficiency characteristics of your implementation.
                      </p>

                      {/* Code Quality and Strengths */}
                      {aiAnalysis.codeQuality && (
                        <p className="animate-slideInLeft" style={{animationDelay: '0.3s'}}>
                          <span className="text-green-400 font-semibold">📊 Code Quality:</span> 
                          Your code receives a quality rating of{' '}
                          <span className={`font-bold ${
                            aiAnalysis.codeQuality === 'Excellent' ? 'text-green-400' :
                            aiAnalysis.codeQuality === 'Good' ? 'text-blue-400' :
                            aiAnalysis.codeQuality === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                          } bg-gray-800 px-2 py-1 rounded`}>
                            {aiAnalysis.codeQuality}
                          </span>
                          {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                            <>
                              . Key strengths include: {aiAnalysis.strengths.join(', ')}.
                              These positive aspects demonstrate your understanding of good coding practices and problem-solving approach.
                            </>
                          )}
                        </p>
                      )}

                      {/* Improvement Suggestions */}
                      {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                        <p className="animate-slideInLeft" style={{animationDelay: '0.6s'}}>
                          <span className="text-yellow-400 font-semibold">💡 Recommendations:</span> 
                          To further enhance your solution, consider the following improvements: {aiAnalysis.suggestions.join('. ')}.
                          Implementing these suggestions can help optimize your code's efficiency, readability, and maintainability.
                        </p>
                      )}

                      {/* Conclusion */}
                      <p className="animate-slideInLeft text-gray-400 italic border-l-4 border-purple-600 pl-4" style={{animationDelay: '0.9s'}}>
                        This analysis provides a comprehensive overview of your solution's performance characteristics and areas for potential improvement. 
                        Continue practicing to enhance your algorithmic thinking and coding skills! 🚀
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
                <Bot className="w-12 h-12 text-gray-400 mb-4 animate-bounce" />
                <p className="text-gray-300 text-lg mb-2">AI Analysis Not Available</p>
                <p className="text-sm text-gray-500 text-center">
                  Click the button above to get detailed insights about your code.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionResults;
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  Award,
  Target,
  Zap,
  Send,
  Bot,
  User,
  MessageCircle,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionList from "../components/SubmissionList"
import { axiosInstance } from "../lib/axios"; // Import axiosInstance

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading, getProblemStats, problemStats } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [isLoadingUserCode, setIsLoadingUserCode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [aiGeneratedHints, setAiGeneratedHints] = useState([]);

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    getUserLastSubmission,
    userLastSubmission,
    clearUserLastSubmission,
  } = useSubmissionStore()

  const { executeCode, submission, isExecuting } = useExecutionStore();
  
  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getProblemStats(id); // Fetch actual stats
    loadUserLastSubmission();
    
    // Cleanup when component unmounts
    return () => {
      clearUserLastSubmission();
    };
  }, [id]);

  // Function to load user's last submission for this problem
  const loadUserLastSubmission = async () => {
    try {
      setIsLoadingUserCode(true);
      await getUserLastSubmission(id);
    } catch (error) {
      console.error("Error loading user's last submission:", error);
    } finally {
      setIsLoadingUserCode(false);
    }
  };

  // Load code when problem, selected language changes
  useEffect(() => {
    if (problem) {
      // Set available languages and default to first available language
      const availableLanguages = Object.keys(problem.codeSnippets || {});
      if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
        setSelectedLanguage(availableLanguages[0]);
      }

      // Load the appropriate code based on user submission or starter code
      if (userLastSubmission && userLastSubmission.language === selectedLanguage) {
        // Load user's last submission code if available for this language
        setCode(userLastSubmission.code || problem.codeSnippets?.[selectedLanguage] || "");
      } else {
        // Load starter code template if no previous submission
        setCode(problem.codeSnippets?.[selectedLanguage] || "");
      }

      // Set test cases
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage, userLastSubmission]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
  };

  // Function to reset to starter code
  const resetToStarterCode = () => {
    if (problem && selectedLanguage) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
    }
  };

  // Function to toggle full screen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullScreen]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'MEDIUM':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'HARD':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const calculateSuccessRate = () => {
    if (problemStats && problemStats.totalSubmissions > 0) {
      return `${problemStats.successRate}%`;
    }
    
    // Fallback calculation if stats not available
    if (!submissionCount || submissionCount === 0) {
      return "0%";
    }
    
    // Estimate based on difficulty
    const estimatedRate = problem.difficulty === 'EASY' ? 75 : 
                         problem.difficulty === 'MEDIUM' ? 45 : 25;
    return `${estimatedRate}%`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-8">
            {/* Problem Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-4 text-white shadow-lg border-2 border-blue-700">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Difficulty</p>
                    <p className="text-lg font-bold">{problem.difficulty}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-600 dark:bg-red-700 rounded-xl p-4 text-white shadow-lg border-2 border-red-700">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Submissions</p>
                    <p className="text-lg font-bold">{submissionCount || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 dark:bg-green-700 rounded-xl p-4 text-white shadow-lg border-2 border-green-700">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Success Rate</p>
                    <p className="text-lg font-bold">{calculateSuccessRate()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Problem Description
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{problem.description}</p>
              </div>
            </div>

            {/* Examples */}
            {problem.examples && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Examples
                </h3>
                <div className="space-y-6">
                  {Object.entries(problem.examples).map(([lang, example], idx) => (
                    <div key={lang} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border-l-4 border-blue-500">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            Input:
                          </label>
                          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-600">
                            {example.input}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                            Output:
                          </label>
                          <div className="bg-black text-yellow-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-600">
                            {example.output}
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              Explanation:
                            </label>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Constraints
                </h3>
                <div className="bg-gray-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                  <pre className="text-gray-700 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600 hover:bg-red-600 text-white text-sm font-medium rounded-full shadow-sm transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "submissions":
        return <SubmissionList submissions={submissions} isLoading={isSubmissionsLoading} />;
      case "discussion":
        // Initialize chat when discussion tab is opened
        if (activeTab === "discussion" && !chatInitialized) {
          initializeChat();
        }
        
        return (
          <div className="h-full flex flex-col bg-red-500 rounded-xl shadow-2xl border-2 border-gray-800 overflow-hidden">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 bg-black">
              {/* Reset Button - Floating */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearChat}
                  className="btn btn-circle bg-red-600 border-2 border-red-700 text-white hover:bg-red-700 hover:border-red-800 transition-all duration-300 shadow-lg"
                  title="Clear chat"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4 tracking-wide">
                    🤖 AI Discussion Assistant
                  </h4>
                  <p className="text-gray-300 max-w-md text-lg leading-relaxed">
                    Start a conversation about <span className="text-red-400 font-semibold">"{problem?.title}"</span>. 
                    I can help with understanding the problem, discussing approaches, explaining algorithms, and more!
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
                    <div className="bg-blue-800 p-4 rounded-lg border border-blue-600">
                      <h5 className="text-blue-300 font-semibold mb-2">💡 What I can help with:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Problem explanation</li>
                        <li>• Algorithm approaches</li>
                        <li>• Code optimization</li>
                      </ul>
                    </div>
                    <div className="bg-red-800 p-4 rounded-lg border border-red-600">
                      <h5 className="text-red-300 font-semibold mb-2">🎯 Smart Features:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Progressive hints</li>
                        <li>• Context awareness</li>
                        <li>• Educational guidance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      } animate-fadeIn`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {message.type === 'ai' && (
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-blue-700">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] p-5 rounded-2xl shadow-xl border-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-gray-800 text-white border-gray-700'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-inherit">
                            {message.content}
                          </pre>
                        </div>
                        <div className={`text-xs mt-3 flex items-center gap-2 ${
                          message.type === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-400'
                        }`}>
                          <span>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.type === 'user' && (
                            <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-red-700">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Typing Indicator */}
                  {isAiTyping && (
                    <div className="flex gap-4 justify-start animate-pulse">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-blue-700">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-gray-800 p-5 rounded-2xl shadow-xl border-2 border-gray-700">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                          <span className="text-gray-300 text-sm font-medium">
                            AI is analyzing your question...
                          </span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Input Section */}
            <div className="border-t-2 border-gray-800 p-6 bg-gray-900">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full textarea bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none shadow-lg"
                    placeholder="Ask me about the problem, approach, hints, or anything else..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={3}
                    disabled={isAiTyping}
                    style={{ fontSize: '16px' }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isAiTyping}
                  className="btn btn-circle btn-lg bg-red-600 hover:bg-red-700 border-2 border-red-700 text-white disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 transition-all duration-300 shadow-xl transform hover:scale-110"
                >
                  {isAiTyping ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </button>
              </div>
              
              {/* Quick Action Buttons */}
              {!isAiTyping && chatMessages.length <= 1 && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setChatInput("Can you explain this problem in simple terms?")}
                    className="btn btn-sm bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:border-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Explain Problem
                  </button>
                  <button
                    onClick={() => setChatInput("What approach should I use to solve this?")}
                    className="btn btn-sm bg-red-600 text-white border-red-700 hover:bg-red-700 hover:border-red-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Suggest Approach
                  </button>
                  <button
                    onClick={() => setChatInput("What are the time and space complexity considerations?")}
                    className="btn btn-sm bg-purple-600 text-white border-purple-700 hover:bg-purple-700 hover:border-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Complexity Analysis
                  </button>
                </div>
              )}

              {/* Status Indicator */}
              {getCurrentCodeStatus() === "Your Last Submission" && (
                <div className="mt-4 text-sm text-blue-300 flex items-center gap-3 bg-blue-900 p-3 rounded-lg border border-blue-600">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>💡 Tip: I can help you understand your previous submission or explore alternative approaches!</span>
                </div>
              )}
            </div>
          </div>
        );
      case "hints":
        return (
          <div className="h-full bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-800 overflow-hidden flex flex-col">
            {/* Hints Header */}
            <div className="bg-black p-2 border-b-2 border-red-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Problem Hints</h3>
                    <p className="text-red-100 text-sm">Get progressive hints to solve "{problem?.title}"</p>
                  </div>
                </div>
                <button
                  onClick={generateHintWithAI}
                  disabled={isGeneratingHint}
                  className="btn bg-blue-700  text-white border-2 border-blue-600 hover:border-red-600 hover:bg-blue-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isGeneratingHint ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get AI Hint
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hints Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
              {/* Static Hints from Problem */}
              {problem?.hints && (
                <div className="bg-gray-800 border-2 border-red-600 p-6 rounded-xl shadow-md">
                  <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Problem Author Hints
                  </h4>
                  <div className="bg-gray-900 p-4 rounded-lg border border-blue-600">
                    <pre className="text-white leading-relaxed whitespace-pre-wrap font-sans">
                      {problem.hints}
                    </pre>
                  </div>
                </div>
              )}

              {/* AI Generated Hints */}
              {aiGeneratedHints.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    AI Generated Hints
                  </h4>
                  {aiGeneratedHints.map((hint, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border-2 border-blue-600 p-5 rounded-xl shadow-md animate-fadeIn"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-blue-400">
                              Hint Level {hint.level || index + 1}
                            </span>
                            <div className="flex">
                              {Array.from({ length: hint.level || index + 1 }).map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-red-500 rounded-full mx-0.5"></div>
                              ))}
                            </div>
                          </div>
                          <p className="text-white leading-relaxed">
                            {hint.hint || hint}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Hints Available */}
              {!problem?.hints && aiGeneratedHints.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Lightbulb className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    No Hints Available Yet
                  </h4>
                  <p className="text-gray-300 max-w-md leading-relaxed mb-6">
                    This problem doesn't have predefined hints, but our AI can generate personalized hints to help you solve it step by step.
                  </p>
                  <button
                    onClick={generateHintWithAI}
                    disabled={isGeneratingHint}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-2 border-red-600 hover:border-red-500 shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isGeneratingHint ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Generating Your First Hint...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate First Hint
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Hint Generation Tips */}
              {(problem?.hints || aiGeneratedHints.length > 0) && (
                <div className="bg-gray-800 border-2 border-gray-600 p-5 rounded-xl">
                  <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    💡 Hint Tips
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="bg-red-800/20 p-3 rounded-lg border border-red-600/30">
                      <p className="text-red-300">• Hints are progressive - start with the first one</p>
                      <p className="text-red-300">• Try to solve with minimal hints for better learning</p>
                    </div>
                    <div className="bg-blue-800/20 p-3 rounded-lg border border-blue-600/30">
                      <p className="text-blue-300">• AI hints are personalized to this specific problem</p>
                      <p className="text-blue-300">• Each hint builds upon the previous ones</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      if (!problem || !problem.testcases) {
        console.error("Problem data not available");
        return;
      }
      
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const getCurrentCodeStatus = () => {
    if (userLastSubmission && userLastSubmission.language === selectedLanguage) {
      return "Your Last Submission";
    }
    return "Starter Code";
  };

  // Full Screen Editor Modal
  const FullScreenEditor = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
      {/* Full Screen Header */}
      <div className="bg-gray-900 p-4 flex justify-between items-center border-b-2 border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            {problem.title} - Full Screen Editor
          </h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            getCurrentCodeStatus() === "Your Last Submission"
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-200'
          }`}>
            {getCurrentCodeStatus()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="select select-bordered bg-gray-800 border-gray-600 text-white font-bold text-sm"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline btn-sm gap-2 text-white border-gray-600 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
            onClick={resetToStarterCode}
            title="Reset to starter code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            className="btn btn-ghost btn-sm text-white hover:bg-red-600 transition-all duration-200"
            onClick={toggleFullScreen}
            title="Exit full screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full Screen Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={selectedLanguage.toLowerCase()}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: true },
            fontSize: 16,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </div>

      {/* Full Screen Footer */}
      <div className="bg-gray-900 p-4 border-t-2 border-gray-700">
        <div className="flex justify-between items-center">
          <button 
            className={`btn bg-blue-600 hover:bg-blue-700 text-white gap-2 border-0 shadow-lg transition-all duration-200 ${isExecuting ? "loading" : ""}`}
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {!isExecuting && <Play className="w-4 h-4" />}
            Run Code
          </button>
          <button 
            className="btn bg-red-600 hover:bg-red-700 text-white gap-2 border-0 shadow-lg transition-all duration-200"
          >
            Submit Solution
          </button>
        </div>
        
        {getCurrentCodeStatus() === "Your Last Submission" && (
          <div className="mt-3 text-sm text-blue-400 flex items-center gap-2 bg-blue-900/20 p-2 rounded-lg border border-blue-500/30">
            <Code2 className="w-4 h-4" />
            Loaded your previous submission. You can continue editing from here.
          </div>
        )}
      </div>
    </div>
  );

  const initializeChat = () => {
    if (!chatInitialized && problem) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Hello! I'm your AI assistant for "${problem.title}". I can help you understand the problem, discuss approaches, explain concepts, and guide you through the solution. What would you like to know?`,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
      setChatInitialized(true);
    }
  };

  // Update the sendChatMessage function
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput.trim();
    setChatInput("");
    setIsAiTyping(true);

    try {
      console.log('Sending chat message to API...');
      
      const response = await axiosInstance.post('/chat/problem-discussion', {
        problemId: id,
        problemTitle: problem.title,
        problemDescription: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags || [],
        userMessage: currentInput,
        chatHistory: chatMessages.slice(-10) // Send last 10 messages for context
      });

      console.log('Chat API response:', response.data);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.data.response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatInitialized(false);
    setTimeout(() => initializeChat(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const generateHintWithAI = async () => {
    if (!problem || isGeneratingHint) return;

    setIsGeneratingHint(true);
    try {
      console.log('Generating AI hint for problem:', problem.title);
      
      const response = await axiosInstance.post('/chat/generate-hint', {
        problemId: id,
        problemTitle: problem.title,
        problemDescription: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags || [],
        constraints: problem.constraints || '',
        existingHints: aiGeneratedHints.length, // Tell AI how many hints already generated
        currentHintLevel: aiGeneratedHints.length + 1
      });

      const newHints = response.data.data.hints;
      
      if (newHints && Array.isArray(newHints) && newHints.length > 0) {
        // Add new hints to existing ones
        setAiGeneratedHints(prev => [...prev, ...newHints]);
        
        // Show success message
        const hintCount = newHints.length;
        console.log(`Generated ${hintCount} new hint(s)`);
      } else if (typeof newHints === 'string') {
        // Handle single hint as string
        const newHint = {
          hint: newHints,
          level: aiGeneratedHints.length + 1
        };
        setAiGeneratedHints(prev => [...prev, newHint]);
      } else {
        console.warn('No valid hints generated');
      }
    } catch (error) {
      console.error('Error generating AI hint:', error);
      
      // Provide fallback hint based on difficulty and existing hints
      const fallbackHint = generateFallbackHint(problem.difficulty, aiGeneratedHints.length + 1);
      setAiGeneratedHints(prev => [...prev, fallbackHint]);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Helper function for fallback hints
  const generateFallbackHint = (difficulty, level) => {
    const hintTemplates = {
      EASY: [
        "Start by carefully reading the problem statement and understanding what is being asked.",
        "Think about the simplest approach first - sometimes the most straightforward solution works best.",
        "Consider what data structures might be helpful for storing and accessing your data.",
        "Look at the examples and try to identify patterns in the input and output."
      ],
      MEDIUM: [
        "Break down the problem into smaller, manageable subproblems.",
        "Consider the time and space complexity requirements - can you optimize your approach?",
        "Think about which algorithms or data structures are commonly used for this type of problem.",
        "Look for edge cases and make sure your solution handles them correctly."
      ],
      HARD: [
        "This problem likely requires an advanced algorithm or optimization technique.",
        "Consider dynamic programming, graph algorithms, or advanced data structures.",
        "Think about the mathematical properties of the problem - is there a pattern or formula?",
        "Break the problem down and solve smaller versions first to build intuition."
      ]
    };

    const hints = hintTemplates[difficulty] || hintTemplates.EASY;
    const hintIndex = Math.min(level - 1, hints.length - 1);
    
    return {
      hint: hints[hintIndex] || "Try approaching this problem step by step and don't hesitate to look up relevant algorithms.",
      level: level
    };
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      {/* Full Screen Editor Modal */}
      {isFullScreen && <FullScreenEditor />}

      {isProblemLoading || !problem ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading problem...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Navigation */}
          <nav className="bg-white dark:bg-gray-900 shadow-xl px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link to={'/'} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <Home className="w-6 h-6" />
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {problem.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(problem.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{submissionCount} Submissions</span>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className={`btn btn-circle border-0 transition-all duration-200 ${
                    isBookmarked 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="btn btn-circle bg-gray-100 dark:bg-gray-800 border-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
                <select 
                  className="select select-bordered bg-blue-600 border-blue-600 text-white font-bold min-w-32 shadow-lg"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  {Object.keys(problem.codeSnippets || {}).map((lang) => (
                    <option key={lang} value={lang} className="bg-blue-600 text-white">
                      {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
              {/* Left: Description / Tabs - Updated with flex layout */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                <div className="border-b-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex">
                    {["description", "submissions", "discussion", "hints"].map(tab => (
                      <button
                        key={tab}
                        className={`flex-1 px-6 py-2 text-sm font-semibold transition-all duration-200 ${
                          activeTab === tab 
                            ? "bg-blue-600 text-white border-b-2 border-blue-700" 
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {tab === "description" && <FileText className="w-4 h-4" />}
                          {tab === "submissions" && <Code2 className="w-4 h-4" />}
                          {tab === "discussion" && <MessageSquare className="w-4 h-4" />}
                          {tab === "hints" && <Lightbulb className="w-4 h-4" />}
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Updated content area to fill remaining space */}
                <div className="flex-1 overflow-y-auto p-6">
                  {renderTabContent()}
                </div>
              </div>

              {/* Right: Code Editor - Updated with matching height */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                <div className="bg-gray-800 px-6 py-4 border-b-2 border-gray-700 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-white">Code Editor</span>
                      {isLoadingUserCode && (
                        <span className="loading loading-spinner loading-xs text-blue-400"></span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        getCurrentCodeStatus() === "Your Last Submission"
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-200'
                      }`}>
                        {getCurrentCodeStatus()}
                      </span>
                      
                      <button
                        className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-0 gap-1 shadow-lg transition-all duration-200"
                        onClick={resetToStarterCode}
                        title="Reset to starter code"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>

                      <button
                        className="btn btn-xs bg-red-600 hover:bg-red-700 text-white border-0 gap-1 shadow-lg transition-all duration-200"
                        onClick={toggleFullScreen}
                        title="Open in full screen"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Updated editor to fill remaining space */}
                <div className="flex-1 w-full">
                  <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <button 
                      className={`btn bg-blue-600 hover:bg-blue-700 text-white gap-2 border-0 shadow-lg transition-all duration-200 ${isExecuting ? "loading" : ""}`}
                      onClick={handleRunCode}
                      disabled={isExecuting}
                    >
                      {!isExecuting && <Play className="w-4 h-4" />}
                      Run Code
                    </button>
                    <button 
                      className="btn bg-red-600 hover:bg-red-700 text-white gap-2 border-0 shadow-lg transition-all duration-200"
                    >
                      Submit Solution
                    </button>
                  </div>
                  
                  {getCurrentCodeStatus() === "Your Last Submission" && (
                    <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
                      <Code2 className="w-4 h-4" />
                      Loaded your previous submission. You can continue editing from here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Submission Results / Test Cases */}
            <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {submission ? (
                    <>
                      <Award className="w-6 h-6 text-yellow-400" />
                      Submission Results
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6 text-white" />
                      Test Cases
                    </>
                  )}
                </h3>
              </div>
              
              <div className="p-6">
                {submission ? (
                  <SubmissionResults submission={submission}/>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-blue-50 dark:bg-blue-900/20">
                          <th className="text-blue-600 dark:text-blue-400 font-bold text-lg">Input</th>
                          <th className="text-red-600 dark:text-red-400 font-bold text-lg">Expected Output</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testCases.map((testCase, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {testCase.input}
                              </pre>
                            </td>
                            <td className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {testCase.output}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemPage;
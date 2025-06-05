import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";
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
  Code,
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
  Eye,
  EyeOff,
  Info
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionList from "../components/SubmissionList"
import { axiosInstance } from "../lib/axios";

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
  const [showTestCases, setShowTestCases] = useState(false);
  const [hasExecutedOrSubmitted, setHasExecutedOrSubmitted] = useState(false);
  const [showCompleteCode, setShowCompleteCode] = useState(false);

  const {
    submissions,
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
    const loadProblemData = async () => {
      if (!id) {
        console.error('No problem ID provided');
        return;
      }

      try {
        console.log('Loading problem data for ID:', id);
        
        // Load problem data first
        await getProblemById(id);
        
        // Load stats in parallel (non-blocking)
        Promise.all([
          getProblemStats(id).catch(error => {
            console.log("Stats not available:", error.message);
            return null;
          }),
          getSubmissionCountForProblem(id).catch(error => {
            console.log("Submission count not available:", error.message);
            return 0;
          })
        ]);
        
        // Load user's last submission
        loadUserLastSubmission();
        
      } catch (error) {
        console.error("Error loading problem data:", error);
        // Don't show toast here as getProblemById already handles it
      }
    };

    loadProblemData();

    return () => {
      clearUserLastSubmission();
    };
  }, [id, getProblemById, getProblemStats, getSubmissionCountForProblem, clearUserLastSubmission]);

  const loadUserLastSubmission = async () => {
    if (!id) return;

    try {
      const lastSub = await getUserLastSubmission(id);
      console.log('Loaded last submission:', lastSub);
      
      if (lastSub && lastSub.language === selectedLanguage) {
        const codeToSet = lastSub.code || lastSub.sourceCode?.code || '';
        if (codeToSet) {
          setCode(codeToSet);
          setHasExecutedOrSubmitted(true);
        }
      }
    } catch (error) {
      console.error('Error loading user last submission:', error);
      // Don't show error toast as this is not critical
    }
  };

  useEffect(() => {
    if (problem) {
      const availableLanguages = Object.keys(problem.codeSnippets || {});
      if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
        setSelectedLanguage(availableLanguages[0]);
      }

      if (userLastSubmission && userLastSubmission.language === selectedLanguage) {
        setCode(userLastSubmission.code || problem.codeSnippets?.[selectedLanguage] || "");
        setHasExecutedOrSubmitted(true);
      } else {
        // Use original starter code as-is
        const starterCode = problem.codeSnippets?.[selectedLanguage] || "";
        setCode(starterCode);
      }

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
      console.log('Loading submissions for problem:', id);
      getSubmissionForProblem(id).then(subs => {
        console.log('Loaded submissions:', subs?.length || 0);
      });
    }
  }, [activeTab, id, getSubmissionForProblem]);

  // Show test cases when execution is complete or submission is made
  useEffect(() => {
    if (submission) {
      setShowTestCases(true);
      setHasExecutedOrSubmitted(true);
    }
  }, [submission]);

  // Track when submissions are made
  useEffect(() => {
    if (submissions && submissions.length > 0) {
      setHasExecutedOrSubmitted(true);
    }
  }, [submissions]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
  };

  const resetToStarterCode = () => {
    if (problem && selectedLanguage) {
      // Use original starter code as-is
      const starterCode = problem.codeSnippets?.[selectedLanguage] || "";
      setCode(starterCode);
      toast.success('Code reset to starter template');
    }
  };

  const calculateSuccessRate = () => {
    // Enhanced success rate calculation with better fallbacks
    if (problemStats) {
      // Try different property names for success rate
      const successRate = problemStats.successRate ?? 
                         problemStats.acceptanceRate ?? 
                         problemStats.acceptedRate;
      
      if (typeof successRate === 'number' && !isNaN(successRate)) {
        return `${Math.round(successRate)}%`;
      }
      
      // Calculate from accepted/total submissions
      const accepted = problemStats.acceptedSubmissions ?? problemStats.accepted ?? 0;
      const total = problemStats.totalSubmissions ?? problemStats.total ?? 0;
      
      if (total > 0) {
        const rate = (accepted / total) * 100;
        return `${Math.round(rate)}%`;
      }
    }
    
    // Fallback to estimated rates based on difficulty
    if (submissionCount && submissionCount > 0) {
      const estimatedRate = {
        'EASY': 75,
        'MEDIUM': 45,
        'HARD': 25
      }[problem?.difficulty] || 50;
      
      return `~${estimatedRate}%`;
    }
    
    return "N/A";
  };

  // Enhanced hint generation with better error handling (SINGLE DECLARATION)
  const generateHint = async () => {
    if (!problem) {
      toast.error('Problem data not available');
      return;
    }

    setIsGeneratingHint(true);
    try {
      const response = await axiosInstance.post('/chat/generate-hints', {
        problemTitle: problem.title,
        problemDescription: problem.description || '',
        difficulty: problem.difficulty || 'MEDIUM',
        tags: Array.isArray(problem.tags) ? problem.tags : [],
        constraints: problem.constraints || '',
        existingHints: aiGeneratedHints.length,
        currentHintLevel: Math.min(aiGeneratedHints.length + 1, 5)
      });
      
      const responseData = response.data?.data || response.data;
      
      if (responseData?.hints && Array.isArray(responseData.hints) && responseData.hints.length > 0) {
        const newHints = responseData.hints.map(h => 
          typeof h === 'string' ? h : h.hint || 'Hint not available'
        );
        setAiGeneratedHints(prev => [...prev, ...newHints]);
        toast.success('New hint generated!');
      } else {
        throw new Error('No hints in response');
      }
    } catch (error) {
      console.error('Failed to generate hint:', error);
      
      // Provide intelligent fallback hints based on difficulty and existing hints
      const fallbackHints = {
        0: "Start by understanding the problem requirements and constraints carefully.",
        1: "Think about which data structures would be most suitable for this problem.",
        2: "Consider the time and space complexity requirements.",
        3: "Look for patterns or mathematical relationships in the problem.",
        4: "Try to optimize your approach - can you solve it more efficiently?"
      };
      
      const hintIndex = aiGeneratedHints.length;
      const fallbackHint = fallbackHints[hintIndex] || "Consider alternative approaches and edge cases.";
      
      setAiGeneratedHints(prev => [...prev, fallbackHint]);
      toast.error('Failed to generate AI hint, but here\'s a helpful suggestion!');
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Enhanced chat message handling
  const handleSendMessage = async () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;

    if (trimmedInput.length > 1000) {
      toast.error('Message is too long (maximum 1000 characters)');
      return;
    }

    const userMessage = { role: 'user', content: trimmedInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiTyping(true);
    setChatInitialized(true);

    try {
      const response = await axiosInstance.post('/chat/problem-discussion', {
        problemId: id,
        message: trimmedInput,
        problemContext: {
          title: problem?.title || 'Unknown Problem',
          description: problem?.description || '',
          difficulty: problem?.difficulty || 'MEDIUM',
          tags: Array.isArray(problem?.tags) ? problem.tags : []
        },
        chatHistory: chatMessages.slice(-5) // Send last 5 messages for context
      });

      const responseData = response.data?.data || response.data;
      const aiResponse = responseData?.response || responseData?.message || 
                        "I'm here to help with your question!";
      
      const aiMessage = { role: 'assistant', content: aiResponse };
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat failed:', error);
      
      // Provide intelligent fallback based on user message
      let fallbackResponse = "I'm sorry, I encountered an error. ";
      
      if (trimmedInput.toLowerCase().includes('hint')) {
        fallbackResponse += "Try the hints section for helpful suggestions!";
      } else if (trimmedInput.toLowerCase().includes('debug')) {
        fallbackResponse += "Check your code for syntax errors and edge cases.";
      } else if (trimmedInput.toLowerCase().includes('algorithm')) {
        fallbackResponse += "Consider which algorithms and data structures fit this problem.";
      } else {
        fallbackResponse += "Please try rephrasing your question.";
      }
      
      const errorMessage = { role: 'assistant', content: fallbackResponse };
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast.error('Chat temporarily unavailable, but I provided a helpful response!');
    } finally {
      setIsAiTyping(false);
    }
  };

  // Enhanced code execution with better error handling
  const handleCodeExecution = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before executing');
      return;
    }

    if (!testCases || testCases.length === 0) {
      toast.error('No test cases available for this problem');
      return;
    }

    try {
      console.log('Starting code execution...');
      const languageId = getLanguageId(selectedLanguage);
      
      if (!languageId) {
        toast.error(`Language ${selectedLanguage} is not supported`);
        return;
      }
      
      // Validate code length
      if (code.length > 50000) {
        toast.error('Code is too long (maximum 50,000 characters)');
        return;
      }
      
      console.log('Using code for execution:', code.substring(0, 200) + '...');
      
      // Format test cases correctly for the API
      const formattedTestCases = testCases.map(tc => tc.input);
      const expectedOutputs = testCases.map(tc => tc.output);
      
      console.log('Formatted data:', {
        codeLength: code.length,
        languageId,
        testCaseCount: formattedTestCases.length,
        problemId: id
      });
      
      const result = await executeCode(
        code,
        languageId, 
        formattedTestCases,
        expectedOutputs,
        id
      );
      
      if (result) {
        setHasExecutedOrSubmitted(true);
        setShowTestCases(true);
        console.log('Code execution completed successfully');
        toast.success('Code executed successfully!');
      } else {
        toast.error('Code execution failed');
      }
    } catch (error) {
      console.error("Execution failed:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Code execution failed';
      toast.error(errorMessage);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

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

  const toggleTestCases = () => {
    setShowTestCases(!showTestCases);
  };

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
                    <p className="text-lg font-bold">{problem?.difficulty || 'N/A'}</p>
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
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{problem?.description || 'No description available'}</p>
              </div>
            </div>

            {/* Examples */}
            {problem?.examples && (
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
                            {example.input || 'No input'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                            Output:
                          </label>
                          <div className="bg-black text-yellow-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-600">
                            {example.output || 'No output'}
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
            {problem?.constraints && (
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
            {problem?.tags && problem.tags.length > 0 && (
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

            {/* Test Cases Preview - Only show if user has executed or submitted */}
            {hasExecutedOrSubmitted && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Test Cases
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                      (Unlocked after execution)
                    </span>
                  </h3>
                  <button
                    onClick={toggleTestCases}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {showTestCases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showTestCases ? 'Hide' : 'Show'} Test Cases
                  </button>
                </div>
                
                {showTestCases && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Preview of test cases (showing first 3 out of {testCases.length} total)
                    </p>
                    <div className="space-y-3">
                      {testCases.slice(0, 3).map((testCase, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">Input:</span>
                              <div className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                                {testCase.input || 'No input'}
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-red-600 dark:text-red-400">Expected:</span>
                              <div className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                                {testCase.output || 'No output'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {testCases.length > 3 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                          ... and {testCases.length - 3} more test cases
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Cases Locked Message - Show when user hasn't executed yet */}
            {!hasExecutedOrSubmitted && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-gray-400" />
                    Test Cases
                  </h3>
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                    🔒 Locked
                  </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Test Cases are Hidden
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Execute your code or make a submission to unlock and view the test cases.
                  </p>
                  <button
                    onClick={handleCodeExecution}
                    disabled={isExecuting || !code.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code to Unlock
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case "hints":
        return (
          <div className="space-y-6">
            {/* AI Hint Generator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  AI-Powered Hints
                </h3>
                <button
                  onClick={generateHint}
                  disabled={isGeneratingHint}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {isGeneratingHint ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Get Hint
                    </>
                  )}
                </button>
              </div>

              {aiGeneratedHints.length > 0 ? (
                <div className="space-y-4">
                  {aiGeneratedHints.map((hint, index) => (
                    <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{hint}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Need a Hint?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Get Hint" to receive AI-powered suggestions for solving this problem.
                  </p>
                </div>
              )}
            </div>

            {/* User-Generated Hints Section */}
            {problem?.hints && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Problem Hints
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <pre className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {problem.hints}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );

      case "submissions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Your Submissions
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                Total: {submissions?.length || 0}
              </span>
            </div>

            {isSubmissionsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-lg font-medium">Loading submissions...</span>
              </div>
            ) : (
              <SubmissionList submissions={submissions} />
            )}
          </div>
        );

      case "chat":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 h-96 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  AI Assistant
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && !chatInitialized && (
                  <div className="text-center py-8">
                    <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Ask me anything about this problem! I can help with algorithms, approaches, and debugging.
                    </p>
                  </div>
                )}

                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about this problem..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isAiTyping}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab content not found</div>;
    }
  };

  if (isProblemLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Problem Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/problems" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/problems" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{problem.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>ID: {problem.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Problem Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              {[
                { id: 'description', label: 'Description', icon: FileText },
                { id: 'hints', label: 'Hints', icon: Lightbulb },
                { id: 'submissions', label: 'Submissions', icon: FileText },
                { id: 'chat', label: 'AI Chat', icon: MessageSquare }
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-60px)]">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-4">
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {problem && Object.keys(problem.codeSnippets || {}).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                
                <button
                  onClick={resetToStarterCode}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullScreen}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'h-[calc(100%-120px)]'}`}>
              {isFullScreen && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{problem.title}</h2>
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}
              
              <div className={isFullScreen ? 'h-[calc(100%-120px)]' : 'h-full'}>
                {isLoadingUserCode ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loading your code...</p>
                    </div>
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: false,
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto'
                      },
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      detectIndentation: false,
                      renderWhitespace: 'none',
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true
                      }
                    }}
                  />
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className={`flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 ${isFullScreen ? '' : ''}`}>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Terminal className="w-4 h-4" />
                  <span>Ready to code</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCodeExecution}
                    disabled={isExecuting || !code.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCodeExecution}
                    disabled={!code.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Results */}
        {submission && (
          <div className="mt-6">
            <SubmissionResults submission={submission} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
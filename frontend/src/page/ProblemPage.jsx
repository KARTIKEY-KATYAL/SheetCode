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
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionList from "../components/SubmissionList"

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [isLoadingUserCode, setIsLoadingUserCode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
                    <p className="text-lg font-bold">95%</p>
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
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-yellow-500">
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
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No discussions yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Be the first to start a discussion!</p>
          </div>
        );
      case "hints":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
            {problem?.hints ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Hints
                </h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {problem.hints}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Lightbulb className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No hints available</p>
              </div>
            )}
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
          <div className="mt-3 text-sm text-blue-400 flex items-center gap-2 bg-blue-900/20 p-2 rounded-lg">
            <Code2 className="w-4 h-4" />
            Loaded your previous submission. You can continue editing from here.
          </div>
        )}
      </div>
    </div>
  );

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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left: Description / Tabs */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="border-b-2 border-gray-200 dark:border-gray-700">
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
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {renderTabContent()}
                </div>
              </div>

              {/* Right: Code Editor */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 border-b-2 border-gray-700">
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
                        <RotateCcw className="w-5 h-5 rounded-2xl" />
                      </button>

                      <button
                        className="btn btn-xs bg-red-600 hover:bg-red-700 text-white border-0 gap-1 shadow-lg transition-all duration-200"
                        onClick={toggleFullScreen}
                        title="Open in full screen"
                      >
                        <Maximize2 className="w-5 h-5 rounded-2xl" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-[600px] w-full">
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

                <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t-2 border-gray-200 dark:border-gray-700">
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
                    <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <Code2 className="w-4 h-4" />
                      Loaded your previous submission. You can continue editing from here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Submission Results / Test Cases */}
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
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
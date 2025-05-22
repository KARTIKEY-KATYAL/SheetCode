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
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

    const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore()

  const { executeCode, submission, isExecuting } = useExecutionStore();
  
  useEffect(() => {
    getProblemById(id),
    getSubmissionCountForProblem(id)
    // console.log(getSubmissionCountForProblem(id))
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

   useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]); // Added missing dependency

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200/70 p-6 rounded-xl mb-6 font-mono shadow-sm"
                    >
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-base-300 px-4 py-2 rounded-lg font-semibold text-base-content block">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return <SubmissionList submissions={submissions} isLoading={isSubmissionsLoading} />;
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
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

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white transition-colors">
      {isProblemLoading || !problem ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="ml-3 text-lg font-medium">Loading problem...</p>
        </div>
      ) : (
        <>
          <nav className="navbar bg-gray-100  dark:bg-gray-900 shadow-lg px-4 py-3 text-black dark:text-white">
            <div className="flex-1 gap-2 container items-center">
              <Link to={'/'} className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Home className="w-6 h-6" />
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="mt-2">
                <h1 className="text-xl font-bold text-red-600">{problem.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(problem.createdAt).toLocaleString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>{submissionCount} Submissions</span>
                  <span>•</span>
                  <ThumbsUp className="w-4 h-4" />
                  <span>95% Success Rate</span>
                </div>
              </div>
            </div>
            <div className="flex-none gap-4">
              <button 
                className={`btn btn-circle ${isBookmarked ? 'text-red-500' : 'text-gray-500'} dark:text-white`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost btn-circle text-gray-500 dark:text-white">
                <Share2 className="w-5 h-5" />
              </button>
              <select 
                className="select select-bordered bg-white dark:bg-gray-800 text-black dark:text-white font-bold w-40"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {Object.keys(problem.codeSnippets || {}).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </nav>

          <div className="container mx-auto p-4 border-2 border-black rounded-lg bg-green-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Description / Tabs */}
              <div className="card text-black dark:text-white bg-gray-100 dark:bg-gray-900 shadow-xl">
                <div className="card-body p-0">
                  <div className="tabs  tabs-bordered w-full flex gap-4 bg-blue-800">
                    {["description", "submissions", "discussion", "hints"].map(tab => (
                      <button
                        key={tab}
                        className={`tab gap-2 ${activeTab === tab ? "tab-active border-blue-500 font-bold text-red-600 dark:text-blue-400" : "font-bold dark:text-gray-300"}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === "description" && <FileText className="w-4 h-4" />}
                        {tab === "submissions" && <Code2 className="w-4 h-4" />}
                        {tab === "discussion" && <MessageSquare className="w-4 h-4" />}
                        {tab === "hints" && <Lightbulb className="w-4 h-4" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px]">{renderTabContent()}</div>
                </div>
              </div>

              {/* Right: Code Editor */}
              <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl">
                <div className="card-body p-0">
                  <div className="tabs tabs-bordered">
                    <button className="tab tab-active gap-2 text-blue-600 dark:text-blue-400">
                      <Terminal className="w-4 h-4" />
                      Code Editor
                    </button>
                  </div>

                  <div className="h-[600px] w-full border border-gray-300 dark:border-gray-700">
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
                        readOnly: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <button 
                        className={`btn bg-blue-600 hover:bg-blue-700 text-white gap-2 ${isExecuting ? "loading" : ""}`}
                        onClick={handleRunCode}
                        disabled={isExecuting}
                      >
                        {!isExecuting && <Play className="w-4 h-4" />}
                        Run Code
                      </button>
                      <button className="btn bg-red-600 hover:bg-red-700 text-white gap-2">
                        Submit Solution
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Results / Test Cases */}
            <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mt-6">
              <div className="card-body">
                {submission ? (
                  <SubmissionResults submission={submission}/>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Test Cases</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full text-black dark:text-white">
                        <thead>
                          <tr>
                            <th>Input</th>
                            <th>Expected Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testCases.map((testCase, index) => (
                            <tr key={index}>
                              <td className="font-mono">{testCase.input}</td>
                              <td className="font-mono">{testCase.output}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
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
import React from "react";
import { CheckCircle, XCircle, Clock, Zap, Code, Award, Target, MemoryStick } from "lucide-react";

const SubmissionResults = ({ submission }) => {
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
      // Handle both "0.001 s" format and plain numbers
      if (typeof time === 'string') {
        return parseFloat(time.split(' ')[0]) * 1000; // Convert seconds to milliseconds
      }
      return parseFloat(time) * 1000; // Convert seconds to milliseconds
    }).filter(time => !isNaN(time));
    
    if (timeValues.length === 0) return 'N/A';
    
    const avgTime = timeValues.reduce((acc, curr) => acc + curr, 0) / timeValues.length;
    return avgTime.toFixed(2);
  };

  // Calculate average memory
  const calculateAverageMemory = () => {
    if (!memoryArray || memoryArray.length === 0) return 'N/A';
    
    const memoryValues = memoryArray.map(memory => {
      // Handle both "1024 KB" format and plain numbers
      if (typeof memory === 'string') {
        return parseFloat(memory.split(' ')[0]);
      }
      return parseFloat(memory);
    }).filter(memory => !isNaN(memory));
    
    if (memoryValues.length === 0) return 'N/A';
    
    const avgMemory = memoryValues.reduce((acc, curr) => acc + curr, 0) / memoryValues.length;
    return avgMemory.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <div className={`rounded-xl p-6 text-white shadow-lg border-2 ${
        allPassed 
          ? 'bg-blue-600 border-blue-700' 
          : 'bg-red-600 border-red-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {allPassed ? (
              <Award className="w-8 h-8" />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              allPassed ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Target className={`w-6 h-6 ${
                allPassed ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className={`text-lg font-bold ${
                allPassed ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {submission.status}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Runtime</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {calculateAverageTime()} ms
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <MemoryStick className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Memory</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {calculateAverageMemory()} KB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Test Case Results
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Test Case</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Runtime</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Memory</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Input</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Expected Output</th>
                <th className="text-gray-700 dark:text-gray-300 font-semibold">Your Output</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCases?.map((testCase, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 border-l-4 ${
                    testCase.passed
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      : "border-red-500 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  <td className="font-semibold text-gray-700 dark:text-gray-300">
                    #{testCase.testCase || index + 1}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Passed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Failed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {timeArray[index] || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <MemoryStick className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {memoryArray[index] || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-x-auto">
                        {testCase.input || "N/A"}
                      </pre>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-x-auto">
                        {testCase.expected || "N/A"}
                      </pre>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                      <pre className={`text-sm font-mono whitespace-pre-wrap overflow-x-auto ${
                        !testCase.passed ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {testCase.stdout || "N/A"}
                      </pre>
                      {testCase.stderr && (
                        <pre className="text-red-500 dark:text-red-400 mt-2 text-sm">
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
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-xl p-6">
          <h4 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Compilation Errors
          </h4>
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-600">
            <pre className="whitespace-pre-wrap text-red-600 dark:text-red-300 text-sm font-mono overflow-x-auto">
              {submission.testCases.find(tc => tc.compileOutput)?.compileOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionResults;

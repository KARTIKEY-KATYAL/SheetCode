import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const SubmissionResults = ({ submission }) => {
  if (!submission || !submission.testCases) {
    return (
      <div className="alert bg-yellow-100 dark:bg-yellow-900 text-black dark:text-white border-l-4 border-yellow-500 p-4 rounded-lg">
        <p className="font-medium">No submission results available.</p>
      </div>
    );
  }

  const totalTestCases = submission.testCases.length;
  const passedTestCases = submission.testCases.filter(tc => tc.passed).length;
  const allPassed = passedTestCases === totalTestCases;

  return (
    <div className="space-y-6 text-black dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Submission Results
        </h3>
        <div
          className={`badge px-3 py-2 rounded-lg text-white font-semibold ${
            allPassed ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {allPassed ? "Accepted" : "Failed"}
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow w-full bg-white dark:bg-gray-900 border border-blue-500 rounded-xl">
        <div className="stat">
          <div className="stat-title text-black dark:text-gray-300">Status</div>
          <div className={`stat-value text-lg ${allPassed ? "text-green-500" : "text-red-500"}`}>
            {submission.status}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-black dark:text-gray-300">Test Cases</div>
          <div className="stat-value text-blue-600 dark:text-blue-400 text-lg">
            {passedTestCases}/{totalTestCases}
          </div>
          <div className="stat-desc text-black dark:text-gray-300">Passed</div>
        </div>

        <div className="stat">
          <div className="stat-title text-black dark:text-gray-300">Language</div>
          <div className="stat-value text-blue-600 dark:text-blue-400 text-lg">
            {submission.language}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full border border-red-500 rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white">
          <thead className="bg-red-100 dark:bg-red-900 text-black dark:text-white">
            <tr>
              <th className="p-3">Test Case</th>
              <th className="p-3">Status</th>
              <th className="p-3">Input</th>
              <th className="p-3">Expected Output</th>
              <th className="p-3">Your Output</th>
            </tr>
          </thead>
          <tbody>
            {submission.testCases.map((testCase, index) => (
              <tr
                key={index}
                className={`transition-all duration-200 ${
                  testCase.passed
                    ? "hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/10 hover:bg-red-100/70"
                }`}
              >
                <td className="font-semibold px-3 py-2">#{testCase.testCase}</td>
                <td className="px-3">
                  {testCase.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </td>
                <td className="font-mono text-sm px-3 py-2 max-w-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{testCase.input || "N/A"}</pre>
                </td>
                <td className="font-mono text-sm px-3 py-2 max-w-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{testCase.expected || "N/A"}</pre>
                </td>
                <td className="font-mono text-sm px-3 py-2 max-w-xs overflow-x-auto">
                  <pre
                    className={`whitespace-pre-wrap ${
                      !testCase.passed ? "text-red-600" : ""
                    }`}
                  >
                    {testCase.stdout || "N/A"}
                  </pre>
                  {testCase.stderr && (
                    <pre className="whitespace-pre-wrap text-red-500 mt-2">
                      Error: {testCase.stderr}
                    </pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compilation Errors */}
      {submission.testCases.some(tc => tc.compileOutput) && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mt-4 border-l-4 border-red-500">
          <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">
            Compilation Errors:
          </h4>
          <pre className="whitespace-pre-wrap text-red-600 dark:text-red-300 text-sm font-mono">
            {submission.testCases.find(tc => tc.compileOutput)?.compileOutput}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SubmissionResults;

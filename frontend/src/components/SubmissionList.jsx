import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  Code,
  Trophy,
  AlertCircle,
} from "lucide-react";

const SubmissionList = ({ submissions, isLoading }) => {
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    const mem = memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length;
    return parseFloat(mem.toFixed(3));
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    const timee = timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
    return parseFloat(timee.toFixed(3));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "WRONG_ANSWER":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "TIME_LIMIT_EXCEEDED":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "COMPILATION_ERROR":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "WRONG_ANSWER":
        return <XCircle className="w-4 h-4" />;
      case "TIME_LIMIT_EXCEEDED":
        return <Clock className="w-4 h-4" />;
      case "COMPILATION_ERROR":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
        <Code className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Submissions Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Run your code to see submission history and track your progress over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Submission History
          </h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Submitted
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Language
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Runtime
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Memory className="w-4 h-4" />
                    Memory
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {submissions.map((sub, index) => {
                const avgMemory = calculateAverageMemory(sub.memory);
                const avgTime = calculateAverageTime(sub.time);
                const formatted = formatDate(sub.createdAt);

                return (
                  <tr 
                    key={sub.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatted.date}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {formatted.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {sub.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        {sub.status.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <span className="font-mono text-sm">{avgTime} ms</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="font-mono text-sm">{avgMemory} KB</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {submissions.map((sub, index) => {
          const avgMemory = calculateAverageMemory(sub.memory);
          const avgTime = calculateAverageTime(sub.time);
          const formatted = formatDate(sub.createdAt);

          return (
            <div 
              key={sub.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      #{submissions.length - index}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {formatted.date}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {formatted.time}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  {sub.language}
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(sub.status)}`}>
                  {getStatusIcon(sub.status)}
                  {sub.status.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Runtime</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                    {avgTime} ms
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <Memory className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Memory</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                    {avgMemory} KB
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionList;

import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
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
    return memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length;
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No submissions found. Run your code to see results!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Time</th>
            <th>Language</th>
            <th>Status</th>
            <th>Runtime</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const avgMemory = calculateAverageMemory(sub.memory);
            const avgTime = calculateAverageTime(sub.time);

            return (
              <tr key={sub.id}>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                <td>{sub.language}</td>
                <td className={sub.status === "ACCEPTED" ? "text-success" : "text-error"}>
                  {sub.status}
                </td>
                <td>{sub.executionTime} ms</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;

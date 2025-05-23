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
      <table className="table w-full border-2 border-black">
        <thead className="text-black dark:text-slate-200  font-bold text-lg rounded-lg">
          <tr className="flex">
            <th className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Time</th>
            <th>Language</th>
            <th>Status</th>
            <th className="flex items-center gap-2"><Clock className="h-5 w-5" /> Runtime</th>
            <th className="flex items-center gap-2"><Memory className="h-5 w-5" /> Memory</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const avgMemory = calculateAverageMemory(sub.memory);
            const avgTime = calculateAverageTime(sub.time);

            return (
              <tr key={sub.id} className="flex">
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                <td>{sub.language}</td>
                <td className={sub.status === "ACCEPTED" ? "text-success" : "text-error"}>
                  <div className="flex items-center gap-2">
                    {sub.status === "ACCEPTED" ? 
                      <CheckCircle2 className="h-5 w-5" /> : 
                      <XCircle className="h-5 w-5" />
                    }
                    {sub.status}
                  </div>
                </td>
                <td>{avgTime} ms</td>
                <td>{avgMemory}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;

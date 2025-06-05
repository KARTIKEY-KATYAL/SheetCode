import React, { useEffect } from 'react';
import { useProblemStore } from '../store/useProblemStore';
import ProblemTable from '../components/ProblemTable';
import { Loader2 } from 'lucide-react';

function Problems() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    // Route: GET /problems/get-all-problems
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }

  console.log("Problems data in Problems component:", problems);

  return (
    <div className="min-h-screen">
      {/* Pass problems directly - the store already extracts .data */}
      <ProblemTable problems={problems} />
    </div>
  );
}

export default Problems;

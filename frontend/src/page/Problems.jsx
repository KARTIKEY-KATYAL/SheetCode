import React, { useEffect } from 'react';
import { useProblemStore } from '../store/useProblemStore';
import ProblemTable from '../components/ProblemTable';

function Problems() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, []);

  return (
    <div>
      {/* Handle loading state */}
      {isProblemsLoading ? (
        <p className="text-center mt-10">Loading problems...</p>
      ) : (
        <ProblemTable problems={problems.data} />
      )}
    </div>
  );
}

export default Problems;

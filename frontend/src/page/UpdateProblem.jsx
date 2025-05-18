import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProblemStore } from '../store/useProblemStore';
import CreateProblemForm from '../components/CreateProblemForm';

const UpdateProblem = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  useEffect(() => {
    getProblemById(id);
  }, [id]);

  if (isProblemLoading) {
    return <div className="text-center mt-10">Loading problem details...</div>;
  }

  if (!problem) {
    return <div className="text-center mt-10">Problem not found</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-center my-6">Update Problem</h1>
      <CreateProblemForm isUpdate={true} initialData={problem} problemId={id} />
    </div>
  );
};

export default UpdateProblem;
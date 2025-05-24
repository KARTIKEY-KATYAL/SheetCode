import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblemStore } from '../store/useProblemStore';
import CreateProblemForm from '../components/CreateProblemForm';

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  
  useEffect(() => {
    if (id) {
      getProblemById(id);
    }
  }, [id, getProblemById]);
  
  if (isProblemLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
        <p className="ml-3 text-lg font-medium">Loading problem details...</p>
      </div>
    );
  }
  
  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h3 className="text-2xl font-bold text-red-600 mb-4">Problem Not Found</h3>
        <p className="text-gray-600 mb-6">The problem you're trying to edit doesn't exist.</p>
        <button 
          onClick={() => navigate('/problems')} 
          className="btn bg-blue-600 hover:bg-blue-700 text-white"
        >
          Back to Problems
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white dark:bg-slate-900">
      <CreateProblemForm isEditing={true} problemData={problem} />
    </div>
  );
};

export default UpdateProblem;
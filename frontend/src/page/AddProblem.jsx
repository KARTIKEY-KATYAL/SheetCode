import React from 'react';
import CreateProblemForm from '../components/CreateProblemForm';

const AddProblem = () => {
  console.log("AddProblem component rendered");
  
  return (
    <div className="w-full min-h-[calc(100vh-5vh)] bg-white dark:bg-slate-900 p-4 md:p-6">
      <CreateProblemForm />
    </div>
  );
}

export default AddProblem;
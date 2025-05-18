import React from 'react';
import CreateProblemForm from '../components/CreateProblemForm';

const AddProblem = () => {
  console.log("AddProblem component rendered");
  
  return (
    <div className="w-full  bg-white dark:bg-slate-900">
      <CreateProblemForm />
    </div>
  );
}

export default AddProblem;
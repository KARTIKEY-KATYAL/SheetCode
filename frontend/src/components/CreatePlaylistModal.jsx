import React from 'react'
import {useForm} from "react-hook-form";
import {X} from "lucide-react";

const CreatePlaylistModal = ({isOpen, onClose, onSubmit}) => {
  const {register, handleSubmit, formState:{errors}, reset} = useForm();

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
      // Maybe show an error message in the modal
    }
  }

  if(!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Create New Playlist</h3>
      <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
      <X className="w-5 h-5" />
      </button>
    </div>

    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
      <div className="form-control">
      <label className="label">
        <span className="label-text font-medium text-gray-700 dark:text-gray-300">Playlist Name</span>
      </label>
      <input
        type="text"
        className="input bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
        placeholder="Enter playlist name"
        {...register('name', { required: 'Playlist name is required' })}
      />
      {errors.name && (
        <label className="label">
        <span className="label-text-alt text-red-500 dark:text-red-400">{errors.name.message}</span>
        </label>
      )}
      </div>

      <div className="form-control">
      <label className="label">
        <span className="label-text font-medium text-gray-700 dark:text-gray-300">Description</span>
      </label>
      <textarea
        className="textarea bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full h-24 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
        placeholder="Enter playlist description"
        {...register('description')}
      />
      </div>

      <div className="flex justify-end gap-2 mt-6">
      <button 
        type="button" 
        onClick={onClose} 
        className="btn px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className="btn px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        Create Playlist
      </button>
      </div>
    </form>
    </div>
  </div>
  )
}

export default CreatePlaylistModal
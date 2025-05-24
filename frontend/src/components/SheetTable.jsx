import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Bookmark, 
  PencilIcon, 
  TrashIcon, 
  Plus, 
  BookOpen, 
  ChevronRight, 
  Search, 
  User,
  Calendar,
  Clock,
  Filter
} from "lucide-react";
import ProblemTable from "./ProblemTable";
import CreatePlaylistModal from "./CreatePlaylistModal";

const SheetTable = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { playlists, getAllPlaylists, deletePlaylist, getPlaylistById } = usePlaylistStore();
  const { problems, getAllProblems } = useProblemStore();
  
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [sheetProblems, setSheetProblems] = useState([]);
  
  // Fetch playlists when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllPlaylists();
        await getAllProblems();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [getAllPlaylists, getAllProblems]);
  
  // Filter playlists based on search
  const filteredPlaylists = useMemo(() => {
    if (!playlists) return [];
    
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(search.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [playlists, search]);
  
  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredPlaylists.length / itemsPerPage);
  
  const paginatedPlaylists = useMemo(() => {
    return filteredPlaylists.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredPlaylists, currentPage]);
  
  const handleCreateSheet = async (data) => {
    try {
      await createPlaylist(data);
      await getAllPlaylists();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating sheet:", error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sheet? This action cannot be undone.")) {
      try {
        await deletePlaylist(id);
        await getAllPlaylists();
      } catch (error) {
        console.error("Error deleting sheet:", error);
      }
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/edit-sheet/${id}`);
  };
  
  const handleSheetClick = async (id) => {
    try {
      const sheet = await getPlaylistById(id);
      setSelectedSheet(sheet);
      
      // Get problems from the sheet
      if (sheet && sheet.problems) {
        setSheetProblems(sheet.problems);
      }
    } catch (error) {
      console.error("Error loading sheet details:", error);
    }
  };
  
  const handleBackToSheets = () => {
    setSelectedSheet(null);
    setSheetProblems([]);
  };
  
  // If a sheet is selected, show its problems
  if (selectedSheet) {
    return (
      <div className="w-full min-h-screen p-10 mx-auto bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <button 
              onClick={handleBackToSheets}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 hover:underline"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Back to All Sheets
            </button>
            <h1 className="text-3xl font-bold flex items-center text-red-600">
              {selectedSheet.name}
            </h1>
            {selectedSheet.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                {selectedSheet.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleEdit(selectedSheet.id)} 
              className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <PencilIcon className="w-5 h-5 mr-1" /> 
              Edit Sheet
            </button>
            <button 
              onClick={() => handleDelete(selectedSheet.id)} 
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              <TrashIcon className="w-5 h-5 mr-1" /> 
              Delete Sheet
            </button>
          </div>
        </div>
        
        <div className="flex items-center bg-blue-600/10 dark:bg-blue-900/20 rounded-lg p-4 mt-4 mb-6">
          <div className="mr-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">Created on</span>
            <div className="font-medium text-black dark:text-white">
              {new Date(selectedSheet.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Problems</span>
            <div className="font-medium text-black dark:text-white">
              {sheetProblems.length} problem{sheetProblems.length !== 1 && 's'}
            </div>
          </div>
        </div>
        
        {/* Show problem table with filtered problems */}
        {sheetProblems.length > 0 ? (
          <ProblemTable problems={sheetProblems} />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center shadow-md">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No problems in this sheet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              This sheet doesn't contain any problems yet. Add problems to build your study collection.
            </p>
            <Link 
              to="/problems" 
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Problems to Add
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen p-10 mx-auto bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold flex items-center text-red-600">
          <BookOpen className="w-8 h-8 mr-2 text-red-600" />
          Study Sheets
        </h2>
        <button 
          className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Create New Sheet
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by sheet name or description..."
            className="input input-bordered w-full pl-10 rounded-md font-bold border-2 border-black bg-white dark:bg-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="ml-3 text-lg font-medium">Loading sheets...</p>
        </div>
      ) : paginatedPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPlaylists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleSheetClick(playlist.id)}
            >
              {/* Sheet header with gradient */}
              <div className="h-24 bg-gradient-to-r from-red-500 to-blue-700 dark:from-red-600 dark:to-blue-800 relative">
                <div className="absolute top-4 right-4">
                  {authUser?.id === playlist.userId && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(playlist.id);
                        }}
                        className="btn btn-sm btn-circle bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(playlist.id);
                        }}
                        className="btn btn-sm btn-circle bg-red-600 hover:bg-red-700 text-white"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-black/60 text-white px-3 py-1 text-sm font-semibold rounded-tl-lg">
                  {playlist.problems?.length || 0} Problems
                </div>
              </div>
              
              {/* Sheet content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                    {playlist.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {playlist.description || "No description available"}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {playlist.problems?.slice(0, 3).map((problem, idx) => (
                    <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
                      {problem.title?.substring(0, 15)}{problem.title?.length > 15 ? "..." : ""}
                    </span>
                  ))}
                  {(playlist.problems?.length || 0) > 3 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
                      +{playlist.problems.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Footer with date and author */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {playlist.user?.name || "Anonymous"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center shadow-md">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No study sheets found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {search ? 
              "No sheets match your search criteria." : 
              "Create your first study sheet to organize problems by topics."
            }
          </p>
          {search ? (
            <button 
              onClick={() => setSearch("")} 
              className="btn bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Search
            </button>
          ) : (
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="btn bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Sheet
            </button>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {filteredPlaylists.length > 0 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="btn btn-sm bg-gray-200 text-black dark:bg-gray-700 dark:text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="btn btn-sm pointer-events-none select-none">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            className="btn btn-sm bg-gray-200 text-black dark:bg-gray-700 dark:text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
      
      {/* Create sheet modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSheet}
      />
    </div>
  );
};

export default SheetTable;
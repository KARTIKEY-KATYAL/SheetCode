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
  Filter,
  Check,
  CheckCircle
} from "lucide-react";
import ProblemTable from "./ProblemTable";
import CreatePlaylistModal from "./CreateSheetModal";

const SheetTable = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { 
    playlists, 
    getAllPlaylists, 
    deletePlaylist,
    getPlaylistDetails,
    createPlaylist,
    updatePlaylist // Add this to use the update function
  } = usePlaylistStore();
  const { problems, getAllProblems } = useProblemStore();
  
  // Add state for the modal
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [sheetProblems, setSheetProblems] = useState([]);
  const [editingPlaylist, setEditingPlaylist] = useState(null); // Track which playlist is being edited
  
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
  
  // Fetch user details for playlists
  useEffect(() => {
    const fetchUsers = async () => {
      if (!playlists || playlists.length === 0) return;
      
      // Create a map to store user data by ID
      const userMap = {};
      
      // First add the current user to the map if available
      if (authUser) {
        userMap[authUser.id] = authUser;
      }
      
      // Fetch user details for each unique user ID not already in the map
      const userIds = new Set();
      playlists.forEach(playlist => {
        if (playlist.userId && !userMap[playlist.userId]) {
          userIds.add(playlist.userId);
        }
      });
      
      try {
        // Use the auth API to get user details
        for (const userId of userIds) {
          try {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
              const userData = await response.json();
              userMap[userId] = userData.data;
            }
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
          }
        }
        
        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    
    fetchUsers();
  }, [playlists, authUser]);
  
  // Helper function to get user name
  const getUserName = (userId) => {
    // If it's the current user, use their name
    if (authUser && userId === authUser.id) {
      return authUser.name;
    }
    
    // Check if we have the user in our map
    if (users[userId]) {
      return users[userId].name;
    }
    
    // If the playlist has user data, use that
    if (playlists) {
      const playlist = playlists.find(p => p.userId === userId);
      if (playlist?.user?.name) {
        return playlist.user.name;
      }
    }
    
    // If we don't have the user data yet, show "Loading..."
    return "Loading...";
  };
  
  // Filter playlists based on search
  const filteredPlaylists = useMemo(() => {
    if (!playlists) return [];
    
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(search.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [playlists, search]);
  
  // Pagination
  const itemsPerPage = 10;
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
  
  // New function to handle playlist updates
  const handleUpdateSheet = async (data) => {
    try {
      if (!editingPlaylist) return;
      
      // Include the ID in the data object
      const updatedData = {
        ...data,
        id: editingPlaylist.id
      };
      
      await updatePlaylist(updatedData);
      await getAllPlaylists();
      setIsCreateModalOpen(false);
      setEditingPlaylist(null); // Clear the editing state
    } catch (error) {
      console.error("Error updating sheet:", error);
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
    // Find the playlist to be edited
    const playlistToEdit = playlists.find(p => p.id === id);
    if (playlistToEdit) {
      setEditingPlaylist(playlistToEdit);
      setIsCreateModalOpen(true); // Open the modal with this playlist data
    }
  };
  
  const handleSheetClick = async (id) => {
    try {
      await getPlaylistDetails(id); // Use getPlaylistDetails instead of getPlaylistById
      
      // Get the current playlist from the store after it's been fetched
      const sheet = usePlaylistStore.getState().currentPlaylist;
      setSelectedSheet(sheet);
      
      // Get problems from the sheet - extract the actual problem objects
      if (sheet && sheet.problems) {
        // Map through the problems array to extract the problem data
        const extractedProblems = sheet.problems.map(item => item.problem);
        setSheetProblems(extractedProblems);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center text-red-600">
          <BookOpen className="w-8 h-8 mr-2" />
          Study Sheets
        </h2>
        <button 
          className="btn bg-red-700 text-white font-bold gap-2 hover:bg-red-800 transition"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Create New Sheet
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by sheet name or description..."
          className="input input-bordered w-full md:w-1/3 rounded-md font-bold border-2 border-black bg-white dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="btn bg-blue-700 text-white rounded-md flex items-center gap-2 hover:bg-blue-800"
          >
            <Filter className="w-4 h-4" />
            Clear Search
          </button>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="ml-3 text-lg font-medium">Loading sheets...</p>
        </div>
      ) : paginatedPlaylists.length > 0 ? (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="table table-zebra table-lg bg-base-200 text-white">
            <thead className="bg-base-300 text-base font-semibold">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Problems</th>
                <th>Created</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlaylists.map((playlist) => (
                <tr key={playlist.id} className="hover:bg-base-100">
                  <td className="font-medium cursor-pointer" onClick={(e) => handleSheetClick(playlist.id)}>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      {playlist.name}
                    </div>
                  </td>
                  <td className="max-w-xs truncate">
                    {playlist.description || "No description available"}
                  </td>
                  <td>
                    <span className="badge bg-blue-600 text-white border-none px-3 py-2">
                      {playlist.problems?.length || 0} problems
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {playlist.user?.name || getUserName(playlist.userId) || "Anonymous"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex gap-2 justify-end">
                      {authUser?.id === playlist.userId && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(playlist.id);
                            }}
                            className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Edit Sheet"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(playlist.id);
                            }}
                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                            title="Delete Sheet"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <div className="flex justify-center mt-6 gap-2">
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
      
      {/* Create/Edit sheet modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPlaylist(null); // Clear editing state when modal is closed
        }}
        onSubmit={editingPlaylist ? handleUpdateSheet : handleCreateSheet}
        initialData={editingPlaylist} // Pass the playlist data if editing
        isEditing={!!editingPlaylist} // Tell the modal if we're editing
      />
    </div>
  );
};

export default SheetTable;
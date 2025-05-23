import React, { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { Bookmark, PencilIcon, TrashIcon, Plus, Code, CheckCircle, CircleDashed } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal"
import { useActions } from "../store/useActionStore";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { solvedProblems, getSolvedProblemByUser } = useProblemStore();
  
  // Fetch solved problems when component mounts
  useEffect(() => {
    getSolvedProblemByUser();
  }, [getSolvedProblemByUser]);
  
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
      currentPage * itemsPerPage // 1 * 5  = (0 , 10)
    );
  }, [filteredProblems, currentPage]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        // Get the DeleteProblembyId function from the store
        const { DeleteProblembyId, getAllProblems } = useProblemStore.getState();
        
        // Call the delete function
        await DeleteProblembyId(id);
        
        // Refresh the problems list after successful deletion
        getAllProblems();
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    }
  };
   const handleEdit = (id) => {
    // Navigate to the edit problem page
    navigate(`/update-problem/${id}`);
  };

   const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

   const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  // Create a set of solved problem IDs for quick lookup
  const solvedProblemIds = useMemo(() => {
    if (!Array.isArray(solvedProblems)) return new Set();
    return new Set(solvedProblems.map(item => item.problemId));
  }, [solvedProblems]);

  return (
  <div className="w-full min-h-screen p-10 mx-auto bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1]  dark:bg-gradient-to-r dark:from-[#0f172a]  dark:to-[#334155]">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold flex items-center text-red-600 ">Problems</h2>
      <button className="btn bg-red-700 text-white font-bold gap-2 hover:bg-red-800 transition" onClick={() => setIsCreateModalOpen(true)}>
        <Plus className="w-5 h-5" aria-hidden="true" />
        Create Playlist
      </button>
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
      <input
        type="text"
        placeholder="Search by title"
        className="input input-bordered w-full md:w-1/3 rounded-md font-bold border-2 border-black bg-white dark:bg-gray-700 dark:text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="select select-bordered rounded-md font-bold bg-blue-700 text-white dark:bg-blue-800"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="ALL">All Difficulties</option>
        {difficulties.map((diff) => (
          <option key={diff} value={diff}>
            {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered rounded-md font-bold bg-blue-700 text-white dark:bg-blue-800"
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
      >
        <option value="ALL">All Tags</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>

    {/* Problems Table */}
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="table table-zebra table-lg bg-base-200 text-white">
        <thead className="bg-base-300 text-base font-semibold">
          <tr>
            <th>Solved</th>
            <th>Title</th>
            <th>Tags</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem) => {
              // Check if this problem is solved
              const isSolved = solvedProblemIds.has(problem.id);
              
              return (
                <tr key={problem.id}>
                  <td>
                    {isSolved ? (
                      <div className="flex justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                      <CircleDashed className="w-5 h-5 text-yellow-300"/>
                      </div>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/problem/${problem.id}`}
                      className="font-semibold text-lg hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(problem.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className=" text-xs badge font-bold px-3 py-1 bg-red-600 text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge font-semibold text-xs px-3 py-1 text-white ${
                        problem.difficulty === "EASY"
                          ? "badge-success"
                          : problem.difficulty === "MEDIUM"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                      {authUser?.role === "ADMIN" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="btn btn-sm btn-error text-white"
                          >
                            <TrashIcon className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button onClick={()=>handleEdit(problem.id)} className="btn btn-sm btn-warning text-white">
                            <PencilIcon className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                      <button
                        className="btn btn-sm btn-outline flex gap-2 items-center"
                        onClick={() => handleAddToPlaylist(problem.id)}
                      >
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Save to Playlist</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No problems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="flex justify-center mt-6 gap-2">
      <button
        className="btn btn-sm bg-gray-200 text-black dark:bg-gray-700 dark:text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Prev
      </button>
      <span className="btn btn-sm pointer-events-none select-none">
        {currentPage} / {totalPages}
      </span>
      <button
        className="btn btn-sm bg-gray-200 text-black dark:bg-gray-700 dark:text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>

    {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
  </div>
);

};

export default ProblemTable;

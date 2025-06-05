import React, { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { Bookmark, PencilIcon, TrashIcon, Plus, Code, CheckCircle, CircleDashed, Building2, AlertCircle } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylistModal from "./AddToSheet";
import CreatePlaylistModal from "./CreateSheetModal"
import { useActions } from "../store/useActionStore";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { solvedProblems, getSolvedProblemByUser, deleteProblem } = useProblemStore();
  
  // Debug logging
  useEffect(() => {
    console.log("ProblemTable received problems:", problems);
    console.log("Problems type:", typeof problems);
    console.log("Is array:", Array.isArray(problems));
    console.log("Problems length:", problems?.length);
  }, [problems]);

  // Fetch solved problems when component mounts
  useEffect(() => {
    // Only call getSolvedProblemByUser if solvedProblems is empty
    if (solvedProblems.length === 0) {
      getSolvedProblemByUser();
    }
  }, []); // Empty dependency array to call only once

  // State for filters and pagination
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const { createPlaylist } = usePlaylistStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Ensure problems is an array
  const safeProblems = useMemo(() => {
    if (!problems) {
      console.log("Problems is null/undefined");
      return [];
    }
    if (!Array.isArray(problems)) {
      console.log("Problems is not an array:", typeof problems);
      return [];
    }
    console.log("Safe problems:", problems.length);
    return problems;
  }, [problems]);

  // Extract unique tags and companies
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    safeProblems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [safeProblems]);

  const allCompanies = useMemo(() => {
    const companiesSet = new Set();
    safeProblems.forEach((p) => p.companies?.forEach((c) => companiesSet.add(c)));
    return Array.from(companiesSet);
  }, [safeProblems]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return safeProblems
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      )
      .filter((problem) =>
        selectedCompany === "ALL" 
          ? true 
          : problem.companies?.includes(selectedCompany)
      );
  }, [safeProblems, search, difficulty, selectedTag, selectedCompany]);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Event handlers
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        // Route: DELETE /problems/delete-problem/:id
        await deleteProblem(id);
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    }
  };

  const handleEdit = (id) => {
    // Navigate to edit form which will use: PUT /problems/update-problem/:id
    navigate(`/admin/edit-problem/${id}`);
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

  // Show error if no problems
  if (!safeProblems || safeProblems.length === 0) {
    return (
      <div className="w-full min-h-screen p-10 mx-auto bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center text-red-600">Problems</h2>
          {authUser?.role === "ADMIN" && (
            <Link 
              to="/admin/add-problem" 
              className="btn bg-red-700 text-white font-bold gap-2 hover:bg-red-800 transition"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Create Problem
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center shadow-md">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            No Problems Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            There are no problems to display. Please check your connection or try refreshing the page.
          </p>
          {authUser?.role === "ADMIN" && (
            <Link
              to="/admin/add-problem"
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create First Problem
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
  <div className="w-full min-h-screen p-10 mx-auto bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1]  dark:bg-gradient-to-r dark:from-[#0f172a]  dark:to-[#334155]">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold flex items-center text-red-600">
        Problems ({safeProblems.length})
      </h2>
      {authUser?.role === "ADMIN" && (
        <Link 
          to="/admin/add-problem" 
          className="btn bg-red-700 text-white font-bold gap-2 hover:bg-red-800 transition"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Create Problem
        </Link>
      )}
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

      <div className="flex gap-2">
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

        <select
          className="select select-bordered rounded-md font-bold bg-blue-700 text-white dark:bg-blue-800"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="ALL">All Companies</option>
          {allCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>
    </div>
    {/* Problems Table */}
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="table table-zebra table-lg bg-base-200 text-white">
        <thead className="bg-base-300 text-base font-semibold">
          <tr>
            <th>Solved</th>
            <th>Title</th>
            <th>Tags</th>
            <th>Companies</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem) => {
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
                          className="text-xs badge font-bold px-3 py-1 bg-red-600 text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(problem.companies || []).map((company, idx) => (
                        <span
                          key={idx}
                          className="text-xs badge font-bold px-3 py-1 bg-green-600 text-white flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3" />
                          {company}
                        </span>
                      ))}
                      {(!problem.companies || problem.companies.length === 0) && (
                        <span className="text-xs text-gray-500">None</span>
                      )}
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
                          <button 
                            onClick={() => handleEdit(problem.id)} 
                            className="btn btn-sm btn-warning text-white"
                          >
                            <PencilIcon className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                      <button
                        className="btn btn-sm btn-outline flex gap-2 items-center"
                        onClick={() => handleAddToPlaylist(problem.id)}
                      >
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Save to Sheet</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No problems found matching your filters.
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

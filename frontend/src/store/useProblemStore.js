import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set, get) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  currentProblem: null,
  problemStats: null,
  error: null,

  // Helper function to handle errors consistently
  handleError: (error, defaultMessage, showToast = true) => {
    console.error(defaultMessage, error);
    const errorMessage = error.response?.data?.message || error.message || defaultMessage;
    set({ error: errorMessage });
    if (showToast) {
      toast.error(errorMessage);
    }
    return null;
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },

  // Route: GET /problems/get-all-problems
  getAllProblems: async () => {
    try {
      console.log("Starting to fetch all problems...");
      set({ isProblemsLoading: true, error: null });
      
      const res = await axiosInstance.get("/problems/get-all-problems");
      console.log("Raw API response:", res.data);
      
      const problems = res.data.data || res.data.problems || res.data || [];
      console.log("Extracted problems:", problems);
      console.log("Problems count:", Array.isArray(problems) ? problems.length : 'Not an array');
      
      if (!Array.isArray(problems)) {
        throw new Error('Invalid response format: expected array of problems');
      }
      
      set({ problems, isProblemsLoading: false });
      return problems;
    } catch (error) {
      get().handleError(error, "Error fetching problems");
      set({ problems: [], isProblemsLoading: false });
      return [];
    }
  },

  // Route: GET /problems/get-problems/:id
  getProblemById: async (id) => {
    if (!id || typeof id !== 'string') {
      const error = new Error('Valid problem ID is required');
      get().handleError(error, "Invalid problem ID");
      return null;
    }

    try {
      set({ isProblemLoading: true, error: null });
      console.log("Fetching problem with ID:", id);
      
      const response = await axiosInstance.get(`/problems/get-problems/${id}`);
      console.log("Problem API response:", response.data);
      
      const problem = response.data.data || response.data;
      
      if (!problem) {
        throw new Error('Problem not found');
      }

      // Validate problem structure
      if (!problem.id || !problem.title) {
        throw new Error('Invalid problem data structure');
      }
      
      set({ 
        currentProblem: problem, 
        problem: problem, 
        isProblemLoading: false,
        error: null 
      });
      
      return problem;
    } catch (error) {
      get().handleError(error, "Problem not found");
      set({ 
        currentProblem: null, 
        problem: null, 
        isProblemLoading: false 
      });
      throw error;
    }
  },

  // Route: GET /problems/get-solved
  getSolvedProblemByUser: async () => {
    try {
      set({ error: null });
      const res = await axiosInstance.get("/problems/get-solved");
      const solvedProblems = res.data.data || res.data || [];
      
      if (!Array.isArray(solvedProblems)) {
        console.warn("Solved problems response is not an array:", solvedProblems);
        set({ solvedProblems: [] });
        return [];
      }
      
      console.log("Solved problems response:", solvedProblems);
      set({ solvedProblems });
      return solvedProblems;
    } catch (error) {
      get().handleError(error, "Error getting solved problems", false);
      set({ solvedProblems: [] });
      return [];
    }
  },

  // Route: POST /problems/create-problem
  createProblem: async (problemData) => {
    if (!problemData || typeof problemData !== 'object') {
      const error = new Error('Valid problem data is required');
      get().handleError(error, "Invalid problem data");
      return null;
    }

    try {
      set({ isProblemLoading: true, error: null });
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'difficulty'];
      for (const field of requiredFields) {
        if (!problemData[field]) {
          throw new Error(`${field} is required`);
        }
      }
      
      const response = await axiosInstance.post('/problems/create-problem', problemData);
      
      // Refresh the problems list after creation
      await get().getAllProblems();
      toast.success("Problem created successfully");
      return response.data;
    } catch (error) {
      get().handleError(error, "Error creating problem");
      throw error;
    } finally {
      set({ isProblemLoading: false });
    }
  },

  // Route: PUT /problems/update-problem/:id
  updateProblem: async (id, problemData) => {
    if (!id || !problemData) {
      const error = new Error('Problem ID and data are required');
      get().handleError(error, "Invalid update parameters");
      return null;
    }

    try {
      set({ isProblemLoading: true, error: null });
      const response = await axiosInstance.put(`/problems/update-problem/${id}`, problemData);
      
      // Refresh the problems list after update
      await get().getAllProblems();
      set({ currentProblem: null });
      toast.success("Problem updated successfully");
      return response.data;
    } catch (error) {
      get().handleError(error, "Error updating problem");
      throw error;
    } finally {
      set({ isProblemLoading: false });
    }
  },

  // Route: DELETE /problems/delete-problem/:id
  deleteProblem: async (id) => {
    if (!id) {
      const error = new Error('Problem ID is required');
      get().handleError(error, "Invalid problem ID");
      return false;
    }

    try {
      set({ error: null });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      toast.success(res.data.message || "Problem deleted successfully");
      
      // Refresh problems list
      await get().getAllProblems();
      return true;
    } catch (error) {
      get().handleError(error, "Error deleting problem");
      return false;
    }
  },

  // Route: GET /problems/:problemId/stats
  getProblemStats: async (problemId) => {
    if (!problemId) {
      console.warn('Problem ID is required for stats');
      return null;
    }

    try {
      set({ error: null });
      console.log('Fetching stats for problem:', problemId);
      
      const response = await axiosInstance.get(`/problems/${problemId}/stats`);
      const stats = response.data.data || response.data;
      
      console.log('Problem stats response:', stats);
      
      // Validate stats structure
      if (stats && typeof stats === 'object') {
        // Normalize stats structure
        const normalizedStats = {
          problemId: stats.problemId || problemId,
          title: stats.title,
          difficulty: stats.difficulty,
          totalSubmissions: stats.totalSubmissions || 0,
          acceptedSubmissions: stats.acceptedSubmissions || 0,
          acceptanceRate: stats.acceptanceRate || stats.successRate || 0,
          successRate: stats.successRate || stats.acceptanceRate || 0,
          uniqueSolvers: stats.uniqueSolvers || 0
        };
        
        set({ problemStats: normalizedStats });
        return normalizedStats;
      } else {
        console.warn('Invalid stats response structure:', stats);
        set({ problemStats: null });
        return null;
      }
    } catch (error) {
      console.error("Error fetching problem stats:", error);
      // Don't show toast for stats errors as they're not critical
      set({ problemStats: null });
      return null;
    }
  },

  // Reset store to initial state
  resetStore: () => {
    set({
      problems: [],
      problem: null,
      solvedProblems: [],
      isProblemsLoading: false,
      isProblemLoading: false,
      currentProblem: null,
      problemStats: null,
      error: null
    });
  }
}));

// Update your ProblemPage component
const ProblemPage = () => {
  // ... existing code
  const { getProblemById, problem, isProblemLoading, getProblemStats, problemStats } = useProblemStore();
  
  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getProblemStats(id); // Fetch actual stats
    loadUserLastSubmission();
    
    return () => {
      clearUserLastSubmission();
    };
  }, [id]);
  
  // Updated success rate calculation with real data
  const calculateSuccessRate = () => {
    if (problemStats && problemStats.totalSubmissions > 0) {
      return `${problemStats.successRate}%`;
    }
    
    // Fallback calculation if stats not available
    if (!submissionCount || submissionCount === 0) {
      return "0%";
    }
    
    // Estimate based on difficulty
    const estimatedRate = problem.difficulty === 'EASY' ? 75 : 
                         problem.difficulty === 'MEDIUM' ? 45 : 25;
    return `${estimatedRate}%`;
  };
}
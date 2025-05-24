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

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data });
      
      await get().getSolvedProblemByUser();
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      console.log("Fetching problem with ID:", id);
      set({ isProblemLoading: true });
      
      const response = await axiosInstance.get(`/problems/get-problems/${id}`);
      console.log("API response:", response.data);
      
      const problem = response.data.data || response.data;
      set({ currentProblem: problem, problem: problem });
      return problem;
    } catch (error) {
      console.error("Error fetching problem:", error);
      throw error;
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved");
      set({ solvedProblems: res.data.data || [] });
      console.log("Solved problems:", res.data.data);
    } catch (error) {
      console.log("Error getting solved problems", error);
    }
  },

  UpdateProblembyId: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.put(`/problems/update-problem/${id}`);
      set({ problem: res.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error Updating problem", error);
      toast.error("Error in Updating problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  DeleteProblembyId: async (id) => {
    try {
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log(`Error in deleting problem ${error}`);
      toast.error("Error in deleting problem");
    }
  },

  updateProblem: async (id, problemData) => {
    try {
      const response = await axiosInstance.put(`/problems/update-problem/${id}`, problemData);
      
      // Refresh the problems list after update
      get().getAllProblems();
      set({ currentProblem: null });
      return response.data;
    } catch (error) {
      console.error("Error updating problem:", error);
      throw error;
    }
  },

  clearCurrentProblem: () => set({ currentProblem: null }),
}));
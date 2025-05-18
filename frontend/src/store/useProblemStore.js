import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problems/${id}`);
      set({ problem: res.data.data });
      // console.log(res.data)
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error in getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");

      set({ solvedProblems: res.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
  UpdateProblembyId:async (id) => {
    try {
      set({isProblemLoading:true})

      const res = await axiosInstance.put(`/problems/update-problem/${id}`)
      set({ problem: res.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error Updateing problem", error);
      toast.error("Error in Updateing problem");
    } finally{
      set({ isProblemLoading: false });
    }
  },
  DeleteProblembyId: async(id)=>{
    try {
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`)
      toast.success(res.message)
    } catch (error) {
      console.log(`Error in deleting problem ${error}`)
      toast.error("Error in deleting problem")
    } 
  }
}));
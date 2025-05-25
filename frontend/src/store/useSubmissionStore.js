import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,
  userLastSubmission: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");

      set({ submissions: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );

      // Set submissions directly from response data
      set({ submission: res.data.data });
      return res.data.data; // Return for any components that want to use the data directly
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
      return []; // Return empty array on error
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );
      set({ submissionCount: res.data.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },

  getUserLastSubmission: async (problemId) => {
    try {
      // Fix the API endpoint to match your backend routes
      const response = await axiosInstance.get(
        `/submission/get-user-last-submission/${problemId}`
      );
      const lastSubmission = response.data.data || response.data;
      set({ userLastSubmission: lastSubmission });
      return lastSubmission;
    } catch (error) {
      console.error("Error fetching user's last submission:", error);
      set({ userLastSubmission: null });
      return null;
    }
  },

  clearUserLastSubmission: () => set({ userLastSubmission: null }),
}));
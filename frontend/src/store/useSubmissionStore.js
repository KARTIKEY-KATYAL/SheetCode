import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  // State
  submissions: [],
  isLoading: false,
  submissionCount: 0,
  lastSubmission: null,
  userLastSubmission: null,
  currentSubmission: null,
  error: null,

  // Helper function to handle API responses consistently
  handleApiResponse: (response) => {
    return response.data?.data || response.data || null;
  },

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

  // Get all submissions for current user
  getAllSubmissions: async (options = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const { page = 1, limit = 20, status, problemId, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (status) params.append('status', status);
      if (problemId) params.append('problemId', problemId);
      
      const response = await axiosInstance.get(`/submissions?${params}`);
      const data = get().handleApiResponse(response);
      
      if (!data) {
        throw new Error('Invalid response format');
      }
      
      const submissions = Array.isArray(data.submissions) ? data.submissions : 
                         Array.isArray(data) ? data : [];
      
      set({ 
        submissions, 
        isLoading: false,
        error: null 
      });
      
      return {
        submissions,
        pagination: data.pagination || null,
        stats: data.stats || null
      };
    } catch (error) {
      get().handleError(error, "Failed to load submissions");
      set({ submissions: [], isLoading: false });
      return { submissions: [], pagination: null, stats: null };
    }
  },

  // Get submissions for a specific problem - FIXED ROUTE
  getSubmissionForProblem: async (problemId) => {
    if (!problemId) {
      get().handleError(new Error('Problem ID is required'), "Invalid problem ID");
      return [];
    }

    try {
      set({ isLoading: true, error: null });
      
      // Use the correct route that matches backend
      const response = await axiosInstance.get(`/submissions/problem/${problemId}`);
      const data = get().handleApiResponse(response);
      
      // Handle different response formats
      const submissions = Array.isArray(data?.submissions) ? data.submissions : 
                         Array.isArray(data) ? data : [];
      
      console.log('Fetched problem submissions:', {
        problemId,
        count: submissions.length,
        route: `/submissions/problem/${problemId}`
      });
      
      set({ 
        submissions, 
        isLoading: false,
        error: null 
      });
      
      return submissions;
    } catch (error) {
      console.error('Failed to load problem submissions:', error);
      get().handleError(error, "Failed to load problem submissions");
      set({ submissions: [], isLoading: false });
      return [];
    }
  },

  // Get submission count for a problem - FIXED ROUTE
  getSubmissionCountForProblem: async (problemId) => {
    if (!problemId) {
      console.warn('Problem ID is required for submission count');
      return 0;
    }

    try {
      set({ error: null });
      
      // Use the correct route that matches backend
      const response = await axiosInstance.get(`/submissions/problem/${problemId}/count`);
      const data = get().handleApiResponse(response);
      
      const count = typeof data === 'number' ? data : 
                   typeof data?.count === 'number' ? data.count : 0;
      
      console.log('Fetched submission count:', {
        problemId,
        count,
        route: `/submissions/problem/${problemId}/count`
      });
      
      set({ submissionCount: count });
      return count;
    } catch (error) {
      console.error("Failed to get submission count:", error);
      set({ submissionCount: 0 });
      return 0;
    }
  },

  // Get user's last submission for a problem - FIXED ROUTE
  getUserLastSubmission: async (problemId) => {
    if (!problemId) {
      get().handleError(new Error('Problem ID is required'), "Invalid problem ID");
      return null;
    }

    try {
      set({ error: null });
      
      // Use the correct route that matches backend
      const response = await axiosInstance.get(`/submissions/problem/${problemId}/last`);
      const submission = get().handleApiResponse(response);
      
      if (submission) {
        // Normalize submission data
        const normalizedSubmission = {
          ...submission,
          code: submission.code || submission.sourceCode?.code || '',
          language: submission.language || 'JAVASCRIPT'
        };
        
        console.log('Fetched last submission:', {
          problemId,
          hasSubmission: true,
          language: normalizedSubmission.language,
          route: `/submissions/problem/${problemId}/last`
        });
        
        set({ userLastSubmission: normalizedSubmission });
        return normalizedSubmission;
      }
      
      set({ userLastSubmission: null });
      return null;
    } catch (error) {
      // Don't show error toast for missing last submission
      console.log("No last submission found:", error.response?.status === 404 ? "Not found" : error.message);
      set({ userLastSubmission: null });
      return null;
    }
  },

  // Clear user's last submission
  clearUserLastSubmission: () => {
    set({ userLastSubmission: null });
  },

  // Get submission details by ID
  getSubmissionDetails: async (submissionId) => {
    if (!submissionId) {
      get().handleError(new Error('Submission ID is required'), "Invalid submission ID");
      return null;
    }

    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get(`/submissions/${submissionId}`);
      const submission = get().handleApiResponse(response);
      
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      set({ 
        currentSubmission: submission, 
        isLoading: false,
        error: null 
      });
      
      return submission;
    } catch (error) {
      get().handleError(error, "Failed to load submission details");
      set({ currentSubmission: null, isLoading: false });
      return null;
    }
  },

  // Delete submissions
  deleteSubmissions: async (submissionIds) => {
    if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
      get().handleError(new Error('Valid submission IDs are required'), "Invalid submission IDs");
      return false;
    }

    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.delete('/submissions', {
        data: { submissionIds }
      });
      
      const result = get().handleApiResponse(response);
      
      toast.success(`${result?.deletedCount || submissionIds.length} submissions deleted successfully`);
      
      // Refresh submissions
      await get().getAllSubmissions();
      
      return true;
    } catch (error) {
      get().handleError(error, "Failed to delete submissions");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get submission statistics
  getSubmissionStats: async (timeframe = 30) => {
    try {
      set({ error: null });
      
      const response = await axiosInstance.get(`/submissions/stats?timeframe=${timeframe}`);
      const stats = get().handleApiResponse(response);
      
      return stats || {
        total: 0,
        recent: 0,
        passed: 0,
        failed: 0,
        successRate: 0,
        timeframe: `${timeframe} days`
      };
    } catch (error) {
      console.error("Failed to get submission stats:", error);
      return {
        total: 0,
        recent: 0,
        passed: 0,
        failed: 0,
        successRate: 0,
        timeframe: `${timeframe} days`
      };
    }
  },

  // Calculate success rate from submissions
  calculateSuccessRate: () => {
    const submissions = get().submissions;
    if (!Array.isArray(submissions) || submissions.length === 0) {
      return { total: 0, passed: 0, failed: 0, successRate: 0 };
    }

    const totalSubmissions = submissions.length;
    const passedSubmissions = submissions.filter(sub => 
      sub.status === 'ACCEPTED' || sub.status === 'Accepted' ||
      (sub.testCases && sub.testCases.every(tc => tc.passed === true))
    ).length;
    
    const failedSubmissions = totalSubmissions - passedSubmissions;
    const successRate = totalSubmissions > 0 ? 
      parseFloat(((passedSubmissions / totalSubmissions) * 100).toFixed(1)) : 0;

    return {
      total: totalSubmissions,
      passed: passedSubmissions,
      failed: failedSubmissions,
      successRate
    };
  },

  // Filter submissions by status
  getSubmissionsByStatus: (status) => {
    const submissions = get().submissions;
    if (!status || !Array.isArray(submissions)) return submissions;
    
    return submissions.filter(sub => 
      sub.status?.toLowerCase() === status.toLowerCase()
    );
  },

  // Get submissions for date range
  getSubmissionsInDateRange: (startDate, endDate) => {
    const submissions = get().submissions;
    if (!startDate || !endDate || !Array.isArray(submissions)) return submissions;

    return submissions.filter(sub => {
      if (!sub.createdAt) return false;
      const submissionDate = new Date(sub.createdAt);
      return submissionDate >= new Date(startDate) && submissionDate <= new Date(endDate);
    });
  },

  // Reset store to initial state
  resetStore: () => {
    set({
      submissions: [],
      isLoading: false,
      submissionCount: 0,
      lastSubmission: null,
      userLastSubmission: null,
      currentSubmission: null,
      error: null
    });
  }
}));
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false, // Fixed naming consistency
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);

      // Check if the response has the expected structure
      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
        console.log("Auth user set:", res.data.data);
      } else {
        console.log("Invalid auth data format", res.data);
        set({ authUser: null });
      }
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true }); // Fixed naming consistency
    try {
      const res = await axiosInstance.post("/auth/register", data);

      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
        toast.success(res.data.message || "Signup successful");
      } else {
        console.log("Invalid signup response format", res.data);
        toast.error("Signup failed");
      }
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigningUp: false }); // Fixed naming consistency
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
        toast.success(res.data.message || "Login successful");
      } else {
        console.log("Invalid login response format", res.data);
        toast.error("Login failed");
      }
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      // Check if this should be a POST request instead of GET
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

  // Add or modify the updateProfile function
  updateProfile: (userData) => {
    try {
      // Get current user data
      const currentUser = get().authUser;

      if (!currentUser) return;

      // Update only the provided fields
      set({
        authUser: {
          ...currentUser,
          ...userData,
        },
      });
    } catch (error) {
      console.log("Error updating profile in store", error);
      toast.error("Error updating profile");
    }
  },
}));

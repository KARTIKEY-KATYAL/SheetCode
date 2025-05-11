import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Define user type
export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string; // Added role for AdminRoute checks
}

// Define authentication state
interface AuthState {
  authUser: User | null;
  isSigningUp: boolean; // Fixed typo from isSigninUp to isSigningUp
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  
  // Define actions with proper types
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

// Define input data types
interface SignupData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false, // Fixed typo
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      
      // Debug the response first to see what's coming back
      console.log("Auth check response:", res.data);
      
      // Make sure we're extracting the user correctly
      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.error("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true }); // Fixed typo
    try {
      const res = await axiosInstance.post("/auth/register", data);
      // Make sure we're extracting the user correctly
      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
        toast.success(res.data.message || "Signup successful");
      }
    } catch (error) {
      console.error("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigningUp: false }); // Fixed typo
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      // Make sure we're extracting the user correctly
      if (res.data && res.data.data) {
        set({ authUser: res.data.data });
        toast.success(res.data.message || "Login successful");
      }
    } catch (error) {
      console.error("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Error logging out");
    }
  }
}));
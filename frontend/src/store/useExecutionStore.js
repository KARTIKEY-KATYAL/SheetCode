import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
    isExecuting: false,
    submission: null,

    executeCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({isExecuting: true});
            
            // Log the data being sent to help with debugging
            console.log("Executing code with:", {
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            });
            
            const res = await axiosInstance.post("/execute-code", {
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            });

            set({submission: res.data.data.submission});
      
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            console.error("Error executing code:", error);
            
            // More detailed error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Server responded with error:", error.response.data);
                toast.error(error.response.data.message || "Error executing code");
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                toast.error("No response from server. Check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
                toast.error("Error preparing code execution");
            }
            
            return null;
        } finally {
            set({isExecuting: false});
        }
    }
}));
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set)=>({
    problems:[],
    problem:null,
    solvedProblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,

    getAllProblems : async () => {
        try {
            set({isProblemsLoading : true})
            const res = await axiosInstance("/problems/get-all-problems")
            set({problems:res.data.problems})
        } catch (error) {
            console.log("Problems fetching failed",error)
            toast.error("Problems fetching failed",error)
        }finally{
            set({isProblemsLoading : false})
        }
    },
    getProblembyId:async () =>{
        try {
            
        } catch (error) {
            
        } finally{

        }
    },
    getSolvedProblembyUser:async() =>{
        try {
            
        } catch (error) {
            
        } finally{

        }
    },

}))


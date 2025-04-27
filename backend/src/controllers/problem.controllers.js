import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';

export const createProblem = asyncHandler(async (req, res) => {
  // going to get all data from request body
  // going to check user role again
  // loop through each reference solution for each language

  const {title,description,difficulty,tags,examples,constraints,hints,editorial,testcases,codeSnippets,referenceSolutions} = req.body;
    if (!req.user || !req.user.role !== 'ADMIN'){
        return res.status(403).json(new ApiError(403,"Not Allowed to Create Account"))
    }

    try {
        for (const [language,codeSolution] of referenceSolutions){
            const languageId = getJudge0languageId(language)
        } 
    } catch (error) {
        
    }
});

export const getallProblems = asyncHandler(async (req, res) => {});
export const getallProblembyId = asyncHandler(async (req, res) => {});
export const UpdateProblembyId = asyncHandler(async (req, res) => {});
export const DeletebyId = asyncHandler(async (req, res) => {});
export const getSolvedProblems = asyncHandler(async (req, res) => {});

import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';
import { getJudge0languageId,submitBatch } from '../libs/judge0.lib.js';

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
            if (!languageId) {
                return res.status(400).json(new ApiError(400, `${language} is not supported`));
            }

            const submission = testcases.map(({input,output})=>(
                {
                    source_code: codeSolution,
                    language_id: languageId,
                    stdin: input,
                    expected_output: output,
                }
            ))

            const submissionResult = await submitBatch(submission)

            const tokens = submissionResult.map((res)=>res.token)

            const results = await poolbatchResults(tokens)

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.status.id !== 3) {
                    return res.status(400).json(new ApiError(400, `Test case ${i + 1} failed`));
                }
            }

            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    userId: req.user.id,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    hints,
                    editorial,
                    testcases,
                    codeSnippets,
                    referenceSolutions
                }
            })
            return res.status(201).json(new ApiResponse(201, newProblem, "Problem Created Successfully"));
        } 
    } catch (error) {
        
    }
});

export const getallProblems = asyncHandler(async (req, res) => {});
export const getallProblembyId = asyncHandler(async (req, res) => {});
export const UpdateProblembyId = asyncHandler(async (req, res) => {});
export const DeletebyId = asyncHandler(async (req, res) => {});
export const getSolvedProblems = asyncHandler(async (req, res) => {});

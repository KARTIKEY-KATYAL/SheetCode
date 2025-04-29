import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';
import {
  getJudge0languageId,
  submitBatch,
  poolbatchResults,
} from '../libs/judge0.lib.js';

export const createProblem = asyncHandler(async (req, res) => {
  // going to get all data from request body
  // going to check user role again
  // loop through each reference solution for each language

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (!req.user || req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json(new ApiError(403, 'Not Allowed to Create Account'));
  }

  try {
    for (const { language, codeSolution } of referenceSolutions) {
      // Check if the language is supported by Judge0
      const languageId = getJudge0languageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json(new ApiError(400, `${language} is not supported`));
      }
      // create the submission to be sent to judge0
      const submission = testcases.map(({ input, output }) => ({
        source_code: codeSolution,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      // submit the batch to judge0 you get back a token for each submission
      const submissionResult = await submitBatch(submission);

      // create a array of tokens from the submission result
      const tokens = submissionResult.map((res) => res.token);

      // check the status of each submission using the tokens
      // this will keep checking the status of the submission until all are done
      const results = await poolbatchResults(tokens);

      // check if all the results are successful
      // if not return an error response
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log('Result....', result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json(new ApiError(400, `Test case ${i + 1} failed`));
        }
      }
      // if all the results are successful, create the problem in the database
      // create the problem in the database
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
          referenceSolutions,
        },
      });
      return res
        .status(201)
        .json(new ApiResponse(201, newProblem, 'Problem Created Successfully'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
});

export const getallProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();

  if (!problems) {
    return res.status(404).json({
      error: 'No problems Found',
    });
  }
  res
    .status(200)
    .json(new ApiResponse(200, problems, 'Problems fetched Successsfully'));
});
export const getallProblembyId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    res.status(200).json(new ApiResponse(200, problem, 'Problem Fetched'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error While Fetching Problem by id'));
  }
});
export const UpdateProblembyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    // Check if problem exists
    const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json(new ApiError(404, 'Problem not found'));
    }

    // Update the problem
    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testcases,
        codeSnippets,
        referenceSolutions,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProblem, 'Problem updated successfully'),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while updating the problem'));
  }
});
export const DeletebyId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: 'Problem Not found' });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json(new ApiResponse(200, 'Problem deleted Successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error While deleting the problem'));
  }
});
export const getSolvedProblems = asyncHandler(async (req, res) => {
  try {
    // Get the current user ID from the request
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    // Find solved problems for the current user
    const solvedProblems = await db.problemSolved.findMany({
      where: {
        userId: userId,
      },
      include: {
        problem: true, // Include the full problem details
      },
    });

    // If no solved problems, return empty array with appropriate message
    if (!solvedProblems || solvedProblems.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], 'No solved problems found'));
    }

    // Return the solved problems
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          solvedProblems,
          'Solved problems fetched successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching solved problems'));
  }
});

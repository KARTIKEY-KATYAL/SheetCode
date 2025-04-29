import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const executeCode = asyncHandler(async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res
        .status(400)
        .json(new ApiError(400, 'Invalid or Missing test cases'));
    }

    // Prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    // Process results to determine if all test cases passed
    const executionResults = results.map((result, index) => {
      return {
        testCase: index + 1,
        status: result.status,
        stdout: result.stdout,
        time: result.time,
        memory: result.memory,
        passed: result.status.id === 3, // Status 3 is "Accepted" in Judge0
        expected: expected_outputs[index],
      };
    });

    // Check if all test cases passed
    const allPassed = executionResults.every((result) => result.passed);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          results: executionResults,
          allPassed,
          problemId,
          userId,
        },
        'Code execution completed',
      ),
    );
  } catch (error) {
    console.error('Error executing code:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while executing code'));
  }
});

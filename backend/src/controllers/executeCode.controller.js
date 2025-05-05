import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';
import {
  getLanguageName,
  poolbatchResults,
  submitBatch,
} from '../libs/judge0.lib.js';

/**
 * Execute code against a set of test cases
 *
 * This controller handles code execution through Judge0 API:
 * 1. Validates test case inputs and expected outputs
 * 2. Submits the code to Judge0 for execution against all test cases
 * 3. Processes the results to determine if all tests passed
 * 4. Stores the submission results in the database
 * 5. Marks the problem as solved if all tests pass
 * 6. Returns detailed execution results
 */
export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;
  const userId = req.user.id;

  // 1. Validate input test cases
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return res
      .status(400)
      .json(new ApiError(400, 'Invalid or missing test cases'));
  }

  // 2. Prepare test cases for Judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  // 3. Send batch of submissions to Judge0
  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((res) => res.token);

  // 4. Poll Judge0 for results of all submitted test cases
  const results = await poolbatchResults(tokens);
  // console.log(results)

  // 5. Analyze test case results
  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    // If any test case fails, set allPassed to false
    if (!passed) allPassed = false;

    // Return detailed information about each test case
    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  // 6. Store submission summary in database
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: { 
        language: getLanguageName(language_id),
        code: source_code
      },
      language: getLanguageName(language_id),
      stdin: stdin.join('\n'),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    },
  });

  // 7. If all tests passed, mark problem as solved for the current user
  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {}, // No updates needed, just ensure the record exists
      create: {
        userId,
        problemId,
      },
    });
  }

  // 8. Save individual test case results
  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResults,
  });

  // 9. Fetch the complete submission with test cases for the response
  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testCases: true, // Include detailed test case results
    },
  });

  // 10. Return successful response with submission data
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        submission: submissionWithTestCase,
        allPassed,
        detailedResults,
      },
      'Code execution completed successfully',
    ),
  );
});

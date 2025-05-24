import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';

/**
 * Get all submissions for the current user
 *
 * Returns a list of all submissions made by the authenticated user
 */
export const getSubmissions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, submissions, 'Submissions fetched successfully'),
      );
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching submissions'));
  }
});

/**
 * Get all submissions for a specific problem by the current user
 *
 * Returns submissions for a particular problem made by the authenticated user
 */
export const getProblemSubmission = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    if (!userId) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    if (!problemId) {
      return res.status(400).json(new ApiError(400, 'Problem ID is required'));
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
      include: {
        testCases: true, // Include test case results
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          submissions,
          'Problem submissions fetched successfully',
        ),
      );
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching problem submissions'));
  }
});

/**
 * Get the count of submissions for a specific problem
 *
 * Returns the total number of submissions for a problem across all users
 */
export const getProblemCount = asyncHandler(async (req, res) => {
  try {
    const { problemId } = req.params;
    // console.log(problemId)
    if (!problemId) {
      return res.status(400).json(new ApiError(400, 'Problem ID is required'));
    }

    const submissionCount = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    // console.log(submissionCount)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { count: submissionCount },
          'Submission count fetched successfully',
        ),
      );
  } catch (error) {
    console.error('Error getting submission count:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while getting submission count'));
  }
});

// Add this logic where you handle successful submissions:

// After a successful submission that marks a problem as solved:
export const handleSuccessfulSubmission = async (req, res) => {
  try {
    // ... existing submission handling code ...

    // After marking the problem as solved:
    const userId = req.user.id;

    // Count total solved problems for this user
    const solvedCount = await db.problemSolved.count({
      where: { userId },
    });

    // Determine appropriate league based on solved count
    let newLeague = 'BRONZE';
    if (solvedCount >= 1000) newLeague = 'PLATINUM';
    else if (solvedCount >= 700) newLeague = 'GOLD';
    else if (solvedCount >= 100) newLeague = 'SILVER';

    // Update user's league
    await db.user.update({
      where: { id: userId },
      data: { league: newLeague },
    });

    // ... rest of the submission success handling ...
  } catch (error) {
    // Error handling...
  }
};

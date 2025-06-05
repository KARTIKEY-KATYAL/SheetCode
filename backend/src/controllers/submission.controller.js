import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { db } from '../libs/db.js';

/**
 * Get all submissions for the current user
 */
export const getSubmissions = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  // Parse query parameters for pagination and filtering
  const { page = 1, limit = 20, status, problemId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const whereClause = {
    userId: userId,
    ...(status && { status }),
    ...(problemId && { problemId }),
  };

  // Build orderBy clause
  const orderBy = {};
  orderBy[sortBy] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const [submissions, totalCount] = await Promise.all([
    db.submission.findMany({
      where: whereClause,
      include: {
        testCases: true,
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy,
      skip: parseInt(skip),
      take: parseInt(limit),
    }),
    db.submission.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  return res.status(200).json(
    new ApiResponse(200, {
      submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    }, 'Submissions fetched successfully')
  );
});

/**
 * Get all submissions for a specific problem by the current user
 */
export const getProblemSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { problemId } = req.params;

  console.log('Getting submissions for problem:', { userId, problemId });

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (!problemId) {
    throw new ApiError(400, 'Problem ID is required');
  }

  // Validate problemId format if using UUID or specific format
  // Add validation as needed for your ID format

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
    include: {
      testCases: true,
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Add submission statistics
  const stats = {
    total: submissions.length,
    passed: submissions.filter(sub => 
      sub.status === 'ACCEPTED' || 
      sub.status === 'Accepted' ||
      sub.testCases?.every(tc => tc.passed === true)
    ).length,
    failed: submissions.filter(sub => 
      sub.status !== 'ACCEPTED' && 
      sub.status !== 'Accepted' &&
      !sub.testCases?.every(tc => tc.passed === true)
    ).length,
  };

  console.log('Found submissions:', {
    count: submissions.length,
    stats
  });

  return res.status(200).json(
    new ApiResponse(200, {
      submissions,
      stats,
    }, 'Problem submissions fetched successfully')
  );
});

/**
 * Get the count of submissions for a specific problem
 */
export const getProblemCount = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id; // Get count for current user only

  console.log('Getting submission count for problem:', { userId, problemId });

  if (!problemId) {
    throw new ApiError(400, 'Problem ID is required');
  }

  const whereClause = {
    problemId: problemId,
    userId: userId, // Only count current user's submissions
  };

  const submissionCount = await db.submission.count({
    where: whereClause,
  });

  console.log('Submission count:', submissionCount);

  return res.status(200).json(
    new ApiResponse(
      200,
      { count: submissionCount },
      'Submission count fetched successfully'
    )
  );
});

/**
 * Get the last submission for a specific problem by the current user
 */
export const getUserLastSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { problemId } = req.params;

  console.log('Getting last submission for problem:', { userId, problemId });

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (!problemId) {
    throw new ApiError(400, 'Problem ID is required');
  }

  const lastSubmission = await db.submission.findFirst({
    where: {
      userId: userId,
      problemId: problemId,
    },
    include: {
      testCases: true,
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!lastSubmission) {
    console.log('No last submission found');
    return res.status(404).json(
      new ApiResponse(404, null, 'No submission found for this problem')
    );
  }

  // Extract and parse the source code from the JSON field
  let extractedData = { ...lastSubmission };
  
  if (lastSubmission.sourceCode) {
    try {
      const sourceCodeData = typeof lastSubmission.sourceCode === 'string' 
        ? JSON.parse(lastSubmission.sourceCode) 
        : lastSubmission.sourceCode;
      
      extractedData = {
        ...lastSubmission,
        code: sourceCodeData?.code || '',
        language: sourceCodeData?.language || lastSubmission.language,
        sourceCode: sourceCodeData, // Keep original structure
      };
    } catch (error) {
      console.error('Error parsing sourceCode JSON:', error);
      extractedData = {
        ...lastSubmission,
        code: '',
        language: lastSubmission.language,
      };
    }
  }

  console.log('Found last submission:', {
    id: extractedData.id,
    language: extractedData.language,
    hasCode: !!extractedData.code
  });

  return res.status(200).json(
    new ApiResponse(200, extractedData, 'Last submission fetched successfully')
  );
});

/**
 * Get detailed submission by ID
 */
export const getSubmissionById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { submissionId } = req.params;

  if (!submissionId) {
    throw new ApiError(400, 'Submission ID is required');
  }

  const submission = await db.submission.findFirst({
    where: {
      id: submissionId,
      userId: userId, // Ensure user can only access their own submissions
    },
    include: {
      testCases: {
        orderBy: {
          testCase: 'asc', // Order test cases by test case number
        },
      },
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
          description: true,
        },
      },
    },
  });

  if (!submission) {
    throw new ApiError(404, 'Submission not found or access denied');
  }

  // Parse sourceCode if it's JSON
  if (submission.sourceCode && typeof submission.sourceCode === 'string') {
    try {
      submission.sourceCode = JSON.parse(submission.sourceCode);
    } catch (error) {
      console.error('Error parsing sourceCode:', error);
      // Keep original if parsing fails
    }
  }

  return res.status(200).json(
    new ApiResponse(200, submission, 'Submission details fetched successfully')
  );
});

/**
 * Delete a submission
 */
export const deleteSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { submissionId } = req.params;

  if (!submissionId) {
    throw new ApiError(400, 'Submission ID is required');
  }

  // Check if submission belongs to the user
  const submission = await db.submission.findFirst({
    where: {
      id: submissionId,
      userId: userId,
    },
  });

  if (!submission) {
    throw new ApiError(404, 'Submission not found or access denied');
  }

  // Use transaction to ensure data consistency
  await db.$transaction(async (prisma) => {
    // Delete test cases first (if not using CASCADE)
    await prisma.testCase.deleteMany({
      where: {
        submissionId: submissionId,
      },
    });

    // Delete the submission
    await prisma.submission.delete({
      where: {
        id: submissionId,
      },
    });
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Submission deleted successfully')
  );
});

/**
 * Delete multiple submissions (batch operation)
 */
export const deleteMultipleSubmissions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { submissionIds } = req.body;

  if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
    throw new ApiError(400, 'Submission IDs array is required');
  }

  // Verify all submissions belong to the user
  const submissions = await db.submission.findMany({
    where: {
      id: { in: submissionIds },
      userId: userId,
    },
    select: { id: true },
  });

  const foundIds = submissions.map(sub => sub.id);
  const notFoundIds = submissionIds.filter(id => !foundIds.includes(id));

  if (notFoundIds.length > 0) {
    throw new ApiError(404, `Submissions not found or access denied: ${notFoundIds.join(', ')}`);
  }

  // Use transaction for batch deletion
  await db.$transaction(async (prisma) => {
    // Delete test cases first
    await prisma.testCase.deleteMany({
      where: {
        submissionId: { in: submissionIds },
      },
    });

    // Delete submissions
    await prisma.submission.deleteMany({
      where: {
        id: { in: submissionIds },
        userId: userId,
      },
    });
  });

  return res.status(200).json(
    new ApiResponse(200, { deletedCount: submissionIds.length }, 'Submissions deleted successfully')
  );
});

/**
 * Get submission statistics for the current user
 */
export const getSubmissionStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { timeframe = '30' } = req.query; // days

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(timeframe));

  const [totalSubmissions, recentSubmissions, passedSubmissions] = await Promise.all([
    db.submission.count({
      where: { userId },
    }),
    db.submission.count({
      where: {
        userId,
        createdAt: { gte: daysAgo },
      },
    }),
    db.submission.count({
      where: {
        userId,
        status: 'ACCEPTED', // Adjust based on your status enum
      },
    }),
  ]);

  const stats = {
    total: totalSubmissions,
    recent: recentSubmissions,
    passed: passedSubmissions,
    failed: totalSubmissions - passedSubmissions,
    successRate: totalSubmissions > 0 ? ((passedSubmissions / totalSubmissions) * 100).toFixed(1) : 0,
    timeframe: `${timeframe} days`,
  };

  return res.status(200).json(
    new ApiResponse(200, stats, 'Submission statistics fetched successfully')
  );
});
import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { 
  generateProblemDiscussionResponse, 
  generateProblemHints, 
  generateSubmissionAnalysis,
  generateProfileAnalysis
} from '../libs/ai-service.js';

/**
 * Problem discussion chat endpoint
 */
export const problemDiscussion = asyncHandler(async (req, res) => {
  const { 
    problemId, 
    problemTitle, 
    problemDescription, 
    difficulty, 
    tags, 
    userMessage,
    chatHistory 
  } = req.body;

  console.log('Problem discussion request:', { problemId, problemTitle, userMessage });

  if (!problemId || !problemTitle || !userMessage) {
    return res.status(400).json(
      new ApiError(400, 'Problem ID, title, and user message are required')
    );
  }

  try {
    const response = await generateProblemDiscussionResponse({
      problemTitle,
      problemDescription,
      difficulty,
      tags: tags || [],
      userMessage,
      chatHistory: chatHistory || []
    });

    console.log('Discussion response generated successfully');

    res.status(200).json(
      new ApiResponse(200, { response }, 'AI response generated successfully')
    );
  } catch (error) {
    console.error('Error generating discussion response:', error);
    res.status(500).json(
      new ApiError(500, 'Failed to generate AI response')
    );
  }
});

/**
 * Generate AI hints for a problem
 */
export const generateHints = asyncHandler(async (req, res) => {
  const { 
    problemId, 
    problemTitle, 
    problemDescription, 
    difficulty, 
    tags, 
    constraints,
    existingHints,
    currentHintLevel
  } = req.body;

  console.log('Hint generation request:', { problemId, problemTitle, currentHintLevel });

  if (!problemId || !problemTitle) {
    return res.status(400).json(
      new ApiError(400, 'Problem ID and title are required')
    );
  }

  try {
    const hints = await generateProblemHints({
      problemTitle,
      problemDescription,
      difficulty,
      tags: tags || [],
      constraints: constraints || '',
      existingHints: existingHints || 0,
      currentHintLevel: currentHintLevel || 1
    });

    console.log('Hints generated successfully:', hints);

    res.status(200).json(
      new ApiResponse(200, { hints }, 'AI hints generated successfully')
    );
  } catch (error) {
    console.error('Error generating hints:', error);
    res.status(500).json(
      new ApiError(500, 'Failed to generate AI hints')
    );
  }
});

/**
 * Analyze submission with AI
 */
export const analyzeSubmission = asyncHandler(async (req, res) => {
  const { 
    sourceCode, 
    language, 
    status, 
    testCases, 
    averageTime, 
    averageMemory, 
    submissionId, 
    problemId 
  } = req.body;

  console.log('Submission analysis request:', { submissionId, problemId, language, status });

  if (!sourceCode || !language) {
    return res.status(400).json(
      new ApiError(400, 'Source code and language are required')
    );
  }

  try {
    const analysis = await generateSubmissionAnalysis({
      sourceCode,
      language,
      status,
      testCases: testCases || [],
      averageTime,
      averageMemory,
      submissionId,
      problemId
    });

    console.log('Analysis generated successfully');

    res.status(200).json(
      new ApiResponse(200, { analysis }, 'AI analysis generated successfully')
    );
  } catch (error) {
    console.error('Error generating submission analysis:', error);
    res.status(500).json(
      new ApiError(500, 'Failed to generate AI analysis')
    );
  }
});

/**
 * Analyze user profile with AI
 */
export const analyzeProfile = asyncHandler(async (req, res) => {
  const { 
    userId,
    totalSolved,
    easyCount,
    mediumCount,
    hardCount,
    sheetsCreated,
    totalProblemsInSheets,
    userLeague,
    joinDate,
    recentActivity,
    difficultyDistribution
  } = req.body;

  console.log('Profile analysis request for user:', userId);

  if (!userId) {
    return res.status(400).json(
      new ApiError(400, 'User ID is required')
    );
  }

  try {
    const analysis = await generateProfileAnalysis({
      totalSolved,
      easyCount,
      mediumCount,
      hardCount,
      sheetsCreated,
      totalProblemsInSheets,
      userLeague,
      joinDate,
      recentActivity,
      difficultyDistribution
    });

    console.log('Profile analysis generated successfully');

    res.status(200).json(
      new ApiResponse(200, { analysis }, 'Profile analysis generated successfully')
    );
  } catch (error) {
    console.error('Error generating profile analysis:', error);
    res.status(500).json(
      new ApiError(500, 'Failed to generate profile analysis')
    );
  }
});
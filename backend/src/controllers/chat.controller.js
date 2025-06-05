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
    message,
    problemContext = {},
    chatHistory = []
  } = req.body;

  console.log('Problem discussion request:', { problemId, message });

  // Enhanced input validation
  if (!problemId || typeof problemId !== 'string') {
    throw new ApiError(400, 'Problem ID is required and must be a valid string');
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new ApiError(400, 'Message must be a non-empty string');
  }

  if (message.trim().length > 1000) {
    throw new ApiError(400, 'Message is too long (maximum 1000 characters)');
  }

  try {
    const response = await generateProblemDiscussionResponse({
      problemId,
      problemTitle: problemContext?.title || 'Unknown Problem',
      problemDescription: problemContext?.description || '',
      difficulty: problemContext?.difficulty || 'MEDIUM',
      tags: Array.isArray(problemContext?.tags) ? problemContext.tags : [],
      userMessage: message.trim(),
      chatHistory: Array.isArray(chatHistory) ? chatHistory : []
    });

    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response from AI service');
    }

    console.log('Discussion response generated successfully');

    return res.status(200).json(
      new ApiResponse(200, { response }, 'AI response generated successfully')
    );
  } catch (error) {
    console.error('Error generating discussion response:', error);
    
    // Provide intelligent fallback based on message content
    let fallbackResponse = "I'm here to help you with this problem! ";
    
    if (message.toLowerCase().includes('hint')) {
      fallbackResponse += "Try breaking down the problem into smaller steps and consider the constraints.";
    } else if (message.toLowerCase().includes('algorithm')) {
      fallbackResponse += "Think about which data structures and algorithms would be most suitable for this problem.";
    } else if (message.toLowerCase().includes('complexity')) {
      fallbackResponse += "Consider both time and space complexity when designing your solution.";
    } else {
      fallbackResponse += "Could you please be more specific about what you'd like to discuss?";
    }
    
    return res.status(200).json(
      new ApiResponse(200, { response: fallbackResponse }, 'Fallback response provided')
    );
  }
});

/**
 * Generate AI hints for a problem
 */
export const generateHints = asyncHandler(async (req, res) => {
  const { 
    problemTitle, 
    problemDescription, 
    difficulty = 'MEDIUM', 
    tags = [], 
    constraints = '',
    existingHints = 0,
    currentHintLevel = 1
  } = req.body;

  console.log('Hint generation request:', { problemTitle, currentHintLevel });

  // Enhanced validation
  if (!problemTitle || typeof problemTitle !== 'string' || problemTitle.trim().length === 0) {
    throw new ApiError(400, 'Problem title is required and must be a non-empty string');
  }

  if (currentHintLevel < 1 || currentHintLevel > 5 || !Number.isInteger(currentHintLevel)) {
    throw new ApiError(400, 'Current hint level must be an integer between 1 and 5');
  }

  const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
  if (!validDifficulties.includes(difficulty)) {
    throw new ApiError(400, `Difficulty must be one of: ${validDifficulties.join(', ')}`);
  }

  try {
    const hints = await generateProblemHints({
      problemTitle: problemTitle.trim(),
      problemDescription: (problemDescription || '').trim(),
      difficulty,
      tags: Array.isArray(tags) ? tags : [],
      constraints: (constraints || '').trim(),
      existingHints: Math.max(0, existingHints),
      currentHintLevel
    });

    // Validate hints response
    if (!Array.isArray(hints) || hints.length === 0) {
      throw new Error('No hints generated');
    }

    console.log('Hints generated successfully:', hints.length);

    return res.status(200).json(
      new ApiResponse(200, { hints }, 'Hints generated successfully')
    );
  } catch (error) {
    console.error('Error generating hints:', error);
    
    // Provide fallback hints based on hint level and difficulty
    const fallbackHints = generateFallbackHints(currentHintLevel, difficulty);
    
    return res.status(200).json(
      new ApiResponse(200, { hints: fallbackHints }, 'Fallback hints provided')
    );
  }
});

/**
 * Analyze code submission
 */
export const analyzeSubmission = asyncHandler(async (req, res) => {
  const { 
    submissionId, 
    sourceCode, 
    language, 
    status, 
    testCases = [],
    averageTime = 0,
    averageMemory = 0,
    problemId
  } = req.body;

  console.log('Submission analysis request:', { submissionId, language, status });

  // Enhanced validation
  if (!sourceCode || typeof sourceCode !== 'string' || sourceCode.trim().length === 0) {
    throw new ApiError(400, 'Source code is required and must be a non-empty string');
  }

  if (sourceCode.length > 50000) {
    throw new ApiError(400, 'Source code is too long (maximum 50,000 characters)');
  }

  if (!language || typeof language !== 'string') {
    throw new ApiError(400, 'Programming language is required');
  }

  const validLanguages = ['javascript', 'python', 'java', 'cpp', 'c', 'csharp'];
  if (!validLanguages.includes(language.toLowerCase())) {
    throw new ApiError(400, `Language must be one of: ${validLanguages.join(', ')}`);
  }

  if (typeof averageTime !== 'number' || averageTime < 0) {
    throw new ApiError(400, 'Average time must be a non-negative number');
  }

  if (typeof averageMemory !== 'number' || averageMemory < 0) {
    throw new ApiError(400, 'Average memory must be a non-negative number');
  }

  try {
    const analysis = await generateSubmissionAnalysis({
      sourceCode: sourceCode.trim(),
      language: language.toLowerCase(),
      status: status || 'UNKNOWN',
      testCases: Array.isArray(testCases) ? testCases : [],
      averageTime,
      averageMemory,
      submissionId,
      problemId
    });

    // Validate analysis response
    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Invalid analysis response');
    }

    console.log('Analysis generated successfully');

    return res.status(200).json(
      new ApiResponse(200, analysis, 'Code analysis completed successfully')
    );
  } catch (error) {
    console.error('Error generating analysis:', error);
    
    // Provide fallback analysis based on status
    const fallbackAnalysis = generateFallbackSubmissionAnalysis(status, language, sourceCode.length);
    
    return res.status(200).json(
      new ApiResponse(200, fallbackAnalysis, 'Fallback analysis provided')
    );
  }
});

/**
 * Analyze user profile and coding journey
 */
export const analyzeProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    totalSolved = 0,
    easyCount = 0,
    mediumCount = 0,
    hardCount = 0,
    sheetsCreated = 0,
    totalProblemsInSheets = 0,
    userLeague = 'BRONZE',
    joinDate,
    recentActivity = [],
    difficultyDistribution = {}
  } = req.body;

  console.log('Profile analysis request:', { userId, totalSolved, userLeague });

  // Enhanced validation
  if (!userId || typeof userId !== 'string') {
    throw new ApiError(400, 'User ID is required and must be a valid string');
  }

  if (typeof totalSolved !== 'number' || totalSolved < 0) {
    throw new ApiError(400, 'Total solved must be a non-negative number');
  }

  if (typeof easyCount !== 'number' || easyCount < 0) {
    throw new ApiError(400, 'Easy count must be a non-negative number');
  }

  if (typeof mediumCount !== 'number' || mediumCount < 0) {
    throw new ApiError(400, 'Medium count must be a non-negative number');
  }

  if (typeof hardCount !== 'number' || hardCount < 0) {
    throw new ApiError(400, 'Hard count must be a non-negative number');
  }

  const validLeagues = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  if (!validLeagues.includes(userLeague)) {
    throw new ApiError(400, `User league must be one of: ${validLeagues.join(', ')}`);
  }

  try {
    const analysis = await generateProfileAnalysis({
      userId,
      totalSolved,
      difficultyBreakdown: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount
      },
      sheetsCreated,
      totalProblemsInSheets,
      userLeague,
      joinDate,
      recentActivity: Array.isArray(recentActivity) ? recentActivity : [],
      difficultyDistribution
    });

    // Validate analysis response
    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Invalid analysis response');
    }

    console.log('Profile analysis generated successfully');

    return res.status(200).json(
      new ApiResponse(200, { analysis }, 'Profile analysis completed successfully')
    );
  } catch (error) {
    console.error('Error generating profile analysis:', error);
    
    // Provide comprehensive fallback analysis
    const fallbackAnalysis = generateFallbackProfileAnalysis({
      totalSolved,
      easyCount,
      mediumCount,
      hardCount,
      userLeague,
      sheetsCreated
    });
    
    return res.status(200).json(
      new ApiResponse(200, { analysis: fallbackAnalysis }, 'Fallback profile analysis provided')
    );
  }
});

// Helper functions with enhanced fallbacks
const generateFallbackHints = (level, difficulty) => {
  const hintsByLevel = {
    1: {
      EASY: "Start by understanding what the problem is asking. Read through the examples carefully.",
      MEDIUM: "Break down the problem into smaller components. What's the main operation you need to perform?",
      HARD: "Consider the constraints carefully. What algorithmic approach would work within these limits?"
    },
    2: {
      EASY: "Think about what data structures you might need. Arrays and strings are often useful.",
      MEDIUM: "Consider using hash maps, sets, or two-pointer techniques for efficiency.",
      HARD: "Advanced data structures like heaps, trees, or graphs might be needed."
    },
    3: {
      EASY: "Try to solve a simpler version first. What would the solution look like for a smaller input?",
      MEDIUM: "Look for patterns in the problem. Can you identify a known algorithmic pattern?",
      HARD: "Consider dynamic programming, divide-and-conquer, or greedy approaches."
    },
    4: {
      EASY: "Write out the steps of your algorithm in plain language before coding.",
      MEDIUM: "Think about edge cases. What happens with empty inputs or boundary conditions?",
      HARD: "Optimize your solution. Can you reduce time or space complexity?"
    },
    5: {
      EASY: "Test your solution with the given examples. Does it produce the expected output?",
      MEDIUM: "Consider alternative approaches. Is there a more elegant solution?",
      HARD: "Review advanced algorithms and data structures that might apply to this problem."
    }
  };

  const hint = hintsByLevel[level]?.[difficulty] || hintsByLevel[level]?.MEDIUM || "Consider different approaches and don't hesitate to research relevant algorithms.";
  
  return [{ hint, level, type: "fallback" }];
};

const generateFallbackSubmissionAnalysis = (status, language, codeLength) => {
  const isAccepted = status === 'ACCEPTED' || status === 'Accepted';
  
  return {
    timeComplexity: "O(?)",
    spaceComplexity: "O(?)",
    performance: `Your ${language} solution ${isAccepted ? 'passed all test cases' : 'encountered some issues'}. The code is ${codeLength} characters long.`,
    codeQuality: isAccepted ? 'Good' : 'Needs improvement',
    strengths: [
      isAccepted ? 'Solution produces correct results' : 'Code structure is readable',
      `Uses ${language} effectively`,
      'Follows basic programming practices'
    ],
    suggestions: [
      isAccepted ? 'Consider optimizing for better performance' : 'Debug the failing test cases',
      'Add comments to explain complex logic',
      'Consider edge cases and error handling',
      `Explore ${language}-specific optimizations`
    ]
  };
};

const generateFallbackProfileAnalysis = ({
  totalSolved,
  easyCount,
  mediumCount,
  hardCount,
  userLeague,
  sheetsCreated
}) => {
  // Calculate percentages
  const easyPercentage = totalSolved > 0 ? Math.round((easyCount / totalSolved) * 100) : 0;
  const mediumPercentage = totalSolved > 0 ? Math.round((mediumCount / totalSolved) * 100) : 0;
  const hardPercentage = totalSolved > 0 ? Math.round((hardCount / totalSolved) * 100) : 0;

  // Determine user level
  let performanceLevel = "Beginner";
  if (totalSolved >= 100) performanceLevel = "Intermediate";
  if (totalSolved >= 300) performanceLevel = "Advanced";
  if (totalSolved >= 700) performanceLevel = "Expert";

  // Generate personalized insights
  const overallPerformance = `You're currently at the ${performanceLevel} level with ${totalSolved} problems solved across different difficulty levels. Your ${userLeague} league status reflects your consistent problem-solving dedication. With ${easyPercentage}% easy, ${mediumPercentage}% medium, and ${hardPercentage}% hard problems, you're building a solid foundation in algorithmic thinking.`;

  const strengths = totalSolved > 50
    ? `Your consistency in solving ${totalSolved} problems demonstrates strong determination and learning mindset. You've successfully tackled problems across various difficulty levels, showing adaptability and growth in your coding skills.`
    : `You're building a strong foundation with ${totalSolved} problems solved. Your commitment to starting this coding journey shows excellent motivation and willingness to learn.`;

  const weaknesses = mediumCount < easyCount / 2
    ? `Consider focusing more on medium-difficulty problems to strengthen your algorithmic thinking. Medium problems often appear in technical interviews and help bridge the gap between basic and advanced concepts.`
    : hardCount === 0 && totalSolved > 20
    ? `Try attempting some hard problems to challenge yourself further. Even if you don't solve them completely, the exposure to complex algorithmic concepts will accelerate your growth.`
    : `Continue practicing consistently across all difficulty levels. Consider creating study plans to target specific topics or algorithms you want to master.`;

  const recommendations = [
    totalSolved < 50 ? "Aim to solve at least 2-3 problems daily to build momentum" : "Maintain your current practice routine",
    sheetsCreated === 0 ? "Create topic-specific study sheets to organize your learning" : "Continue using study sheets to track your progress",
    mediumCount < 10 ? "Focus on medium-difficulty problems for interview preparation" : "Keep practicing medium problems regularly",
    "Join coding contests to test your skills under time pressure",
    "Review and understand multiple approaches for each problem you solve"
  ].filter(Boolean);

  const studyStrategy = totalSolved < 100
    ? "Focus on building fundamental problem-solving skills by solving 20-30 easy problems, then gradually introduce medium problems. Create a study schedule and stick to it consistently."
    : "You're ready for more advanced topics. Practice medium and hard problems regularly, participate in coding contests, and consider contributing to open-source projects to apply your skills in real-world scenarios.";

  return {
    overallPerformance,
    strengths,
    weaknesses,
    recommendations: recommendations.join(". "),
    studyStrategy
  };
};
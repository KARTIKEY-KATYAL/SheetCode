import { asyncHandler } from '../libs/async-handler.js';
import { ApiResponse } from '../libs/api-response.js';
import { ApiError } from '../libs/api-error.js';
import { 
  generateTestCases, 
  generateExample, 
  generateStarterCode, 
  generateProblemHints
} from '../libs/ai-service.js';

/**
 * Generate test cases using AI
 */
export const generateTestCasesController = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, constraints } = req.body;

  console.log('Generate test cases request:', { title, description, difficulty });

  if (!title || !description || !difficulty) {
    return res.status(400).json(
      new ApiError(400, 'Title, description, and difficulty are required')
    );
  }

  if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
    return res.status(400).json(
      new ApiError(400, 'Difficulty must be EASY, MEDIUM, or HARD')
    );
  }

  try {
    const testCases = await generateTestCases(
      title, 
      description, 
      difficulty, 
      tags || [], 
      constraints || ''
    );

    console.log('Generated test cases:', testCases);

    return res.status(200).json(
      new ApiResponse(200, { testCases }, 'Test cases generated successfully')
    );

  } catch (error) {
    console.error('Error generating test cases:', error);
    return res.status(500).json(
      new ApiError(500, `Failed to generate test cases: ${error.message}`)
    );
  }
});

/**
 * Generate example for a problem
 */
export const generateExampleController = asyncHandler(async (req, res) => {
  const { title, description, language } = req.body;

  console.log('Generate example request:', { title, description, language });

  if (!title || !description || !language) {
    return res.status(400).json(
      new ApiError(400, 'Title, description, and language are required')
    );
  }

  try {
    const example = await generateExample(title, description, language);

    return res.status(200).json(
      new ApiResponse(200, { example }, 'Example generated successfully')
    );

  } catch (error) {
    console.error('Error generating example:', error);
    return res.status(500).json(
      new ApiError(500, `Failed to generate example: ${error.message}`)
    );
  }
});

/**
 * Generate starter code
 */
export const generateStarterCodeController = asyncHandler(async (req, res) => {
  const { title, description, languages } = req.body;

  console.log('Generate starter code request:', { title, description, languages });

  if (!title || !description) {
    return res.status(400).json(
      new ApiError(400, 'Title and description are required')
    );
  }

  try {
    const starterCode = await generateStarterCode(title, description, languages);

    return res.status(200).json(
      new ApiResponse(200, { starterCode }, 'Starter code generated successfully')
    );

  } catch (error) {
    console.error('Error generating starter code:', error);
    return res.status(500).json(
      new ApiError(500, `Failed to generate starter code: ${error.message}`)
    );
  }
});

/**
 * Generate hints
 */
export const generateHintsController = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags } = req.body;

  console.log('Generate hints request:', { title, description, difficulty, tags });

  if (!title || !description || !difficulty) {
    return res.status(400).json(
      new ApiError(400, 'Title, description, and difficulty are required')
    );
  }

  try {
    const hints = await generateProblemHints(title, description, difficulty, tags || []);

    return res.status(200).json(
      new ApiResponse(200, { hints }, 'Hints generated successfully')
    );

  } catch (error) {
    console.error('Error generating hints:', error);
    return res.status(500).json(
      new ApiError(500, `Failed to generate hints: ${error.message}`)
    );
  }
});

/**
 * Generate complete problem data (everything at once) - OPTIMIZED VERSION
 */
export const generateCompleteTestData = asyncHandler(async (req, res) => {
  const { title, description, difficulty, tags, constraints, languages } = req.body;

  console.log('Generate complete request:', { title, description, difficulty });

  if (!title || !description || !difficulty) {
    return res.status(400).json(
      new ApiError(400, 'Title, description, and difficulty are required')
    );
  }

  const supportedLanguages = languages || ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP'];

  try {
    console.log('Starting PARALLEL complete data generation...');

    // Generate all components in parallel instead of sequentially
    const [testCasesResult, starterCodeResult, hintsResult, ...exampleResults] = await Promise.allSettled([
      // Generate test cases
      generateTestCases(title, description, difficulty, tags || [], constraints || ''),
      
      // Generate starter code
      generateStarterCode(title, description, supportedLanguages),
      
      // Generate hints
      generateProblemHints(title, description, difficulty, tags || []),
      
      // Generate examples for each language in parallel
      ...supportedLanguages.map(language => 
        generateExample(title, description, language)
      )
    ]);

    // Process results
    const response = {
      testCases: [],
      starterCode: {},
      hints: [],
      examples: {}
    };

    // Handle test cases
    if (testCasesResult.status === 'fulfilled') {
      response.testCases = testCasesResult.value || [];
      console.log('✅ Test cases generated:', response.testCases.length);
    } else {
      console.error('❌ Test cases failed:', testCasesResult.reason);
      response.testCases = [
        { input: "sample input", output: "sample output", explanation: "Sample test case", type: "basic" }
      ];
    }

    // Handle starter code
    if (starterCodeResult.status === 'fulfilled') {
      response.starterCode = starterCodeResult.value || {};
      console.log('✅ Starter code generated for:', Object.keys(response.starterCode));
    } else {
      console.error('❌ Starter code failed:', starterCodeResult.reason);
      response.starterCode = {
        JAVASCRIPT: `// ${title}\nfunction solve() {\n    // Your code here\n}`,
        PYTHON: `# ${title}\ndef solve():\n    # Your code here\n    pass`,
        JAVA: `// ${title}\npublic class Solution {\n    // Your code here\n}`,
        CPP: `// ${title}\n#include<iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`
      };
    }

    // Handle hints
    if (hintsResult.status === 'fulfilled') {
      response.hints = hintsResult.value || [];
      console.log('✅ Hints generated:', response.hints.length);
    } else {
      console.error('❌ Hints failed:', hintsResult.reason);
      response.hints = [
        { level: 1, hint: "Think about the problem step by step", type: "conceptual" },
        { level: 2, hint: "Consider the data structures you might need", type: "structural" }
      ];
    }

    // Handle examples
    exampleResults.forEach((result, index) => {
      const language = supportedLanguages[index];
      if (result.status === 'fulfilled') {
        response.examples[language] = result.value || {
          input: "Sample input",
          output: "Sample output",
          explanation: `Sample explanation for ${language}`
        };
        console.log(`✅ Example generated for ${language}`);
      } else {
        console.error(`❌ Example failed for ${language}:`, result.reason);
        response.examples[language] = {
          input: "Sample input",
          output: "Sample output",
          explanation: `Sample explanation for ${language}`
        };
      }
    });

    // Count successful generations
    const successCount = 
      (response.testCases.length > 0 ? 1 : 0) +
      (Object.keys(response.starterCode).length > 0 ? 1 : 0) +
      (response.hints.length > 0 ? 1 : 0) +
      (Object.keys(response.examples).length > 0 ? 1 : 0);

    const message = `Generated ${successCount}/4 components successfully using parallel processing`;

    console.log('🎉 Parallel generation complete:', {
      testCasesCount: response.testCases.length,
      starterCodeLanguages: Object.keys(response.starterCode),
      hintsCount: response.hints.length,
      examplesLanguages: Object.keys(response.examples)
    });

    return res.status(200).json(
      new ApiResponse(200, response, message)
    );

  } catch (error) {
    console.error('Error generating complete test data:', error);
    return res.status(500).json(
      new ApiError(500, `Failed to generate test data: ${error.message}`)
    );
  }
});
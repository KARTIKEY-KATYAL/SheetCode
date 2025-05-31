import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Anthropic client with error handling
let anthropic;

try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
} catch (error) {
  console.warn('Anthropic client initialization failed:', error.message);
}

const AI_PROVIDER = 'ANTHROPIC'; // Fixed to only use Anthropic

/**
 * Clean and extract JSON from AI response
 */
const extractJSON = (text) => {
  console.log('Raw AI response:', text);
  
  // Remove markdown code blocks
  let cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Find JSON array or object
  const jsonMatch = cleanedText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedText = jsonMatch[0];
  }
  
  // Remove any leading/trailing whitespace
  cleanedText = cleanedText.trim();
  
  console.log('Cleaned text for parsing:', cleanedText);
  
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('JSON parsing failed:', error);
    console.error('Attempted to parse:', cleanedText);
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
};

/**
 * Generate AI response using Anthropic
 */
const generateAIResponse = async (systemPrompt, userPrompt, options = {}) => {
  const { 
    maxTokens = 2000, 
    temperature = 0.7
  } = options;

  console.log('Generating AI response with Anthropic');

  try {
    if (!anthropic) {
      console.warn('Anthropic client not initialized, falling back to hardcoded response');
      throw new Error('Anthropic client not initialized. Check API key.');
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error with Anthropic API:', error);
    throw new Error(`Failed to generate response with Anthropic: ${error.message}`);
  }
};

/**
 * Generate test cases based on problem description and difficulty
 */
export const generateTestCases = async (title, description, difficulty, tags = [], constraints = '') => {
  const systemPrompt = `You are an expert competitive programming judge who creates comprehensive test cases for coding problems. 

CRITICAL: You must respond with ONLY a valid JSON array. No explanations, no markdown, no code blocks. Just the raw JSON array.

Format: [{"input":"...","output":"...","explanation":"...","type":"..."}]`;

  const userPrompt = `Generate test cases for this coding problem:

Title: ${title}
Description: ${description}
Difficulty: ${difficulty}
Tags: ${tags.join(', ')}
Constraints: ${constraints}

Generate ${difficulty === 'EASY' ? '4-6' : difficulty === 'MEDIUM' ? '6-8' : '8-10'} test cases.

Return ONLY this JSON array format (no other text):
[
  {
    "input": "test input here",
    "output": "expected output",
    "explanation": "what this tests",
    "type": "basic"
  }
]

Types: basic, edge, boundary, stress`;

  try {
    const responseText = await generateAIResponse(systemPrompt, userPrompt, {
      maxTokens: 2000,
      temperature: 0.2,
    });
    
    const testCases = extractJSON(responseText);
    
    if (!Array.isArray(testCases)) {
      console.error('Response is not an array:', testCases);
      throw new Error('AI response is not an array');
    }
    
    return testCases.map((testCase, index) => ({
      input: testCase.input?.toString() || `input_${index + 1}`,
      output: testCase.output?.toString() || `output_${index + 1}`,
      explanation: testCase.explanation || `Test case ${index + 1}`,
      type: testCase.type || 'basic'
    }));
    
  } catch (error) {
    console.error('Error generating test cases:', error);
    
    // Return fallback test cases
    return [
      {
        input: "1",
        output: "1",
        explanation: "Basic test case",
        type: "basic"
      },
      {
        input: "2",
        output: "2",
        explanation: "Another basic test case",
        type: "basic"
      },
      {
        input: "0",
        output: "0",
        explanation: "Edge case with zero",
        type: "edge"
      }
    ];
  }
};

/**
 * Generate example for a problem
 */
export const generateExample = async (title, description, language) => {
  const systemPrompt = `You are an expert at creating clear examples for coding problems.

CRITICAL: Respond with ONLY valid JSON. No explanations, no markdown, no code blocks.

Format: {"input":"...","output":"...","explanation":"..."}`;

  const userPrompt = `Create an example for this problem:

Title: ${title}
Description: ${description}
Language: ${language}

Return ONLY this JSON format (no other text):
{
  "input": "example input",
  "output": "expected output",
  "explanation": "step by step explanation"
}`;

  try {
    const responseText = await generateAIResponse(systemPrompt, userPrompt, {
      maxTokens: 800,
      temperature: 0.3,
    });
    
    const example = extractJSON(responseText);
    
    return {
      input: example.input?.toString() || "sample input",
      output: example.output?.toString() || "sample output",
      explanation: example.explanation || "Sample explanation"
    };
    
  } catch (error) {
    console.error('Error generating example:', error);
    return {
      input: "sample input",
      output: "sample output",
      explanation: "Sample explanation for the problem"
    };
  }
};

/**
 * Generate starter code
 */
export const generateStarterCode = async (title, description, languages = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP']) => {
  const systemPrompt = `You are an expert programmer who creates STARTER CODE TEMPLATES (NOT COMPLETE SOLUTIONS).

CRITICAL RULES:
1. Generate INCOMPLETE starter code templates that students need to fill in
2. Include function signatures and basic structure
3. Add "// Your code here" or similar placeholders
4. Include input parsing and output formatting
5. DO NOT include the actual algorithm or solution logic
6. Respond with ONLY valid JSON - no explanations, no markdown, no code blocks

Format: {"JAVASCRIPT":"code","PYTHON":"code","JAVA":"code","CPP":"code"}`;

  const userPrompt = `Create STARTER CODE templates (NOT solutions) for this problem:

Title: ${title}
Description: ${description}
Languages: ${languages.join(', ')}

Requirements:
- Include function signatures but leave implementation empty
- Add input parsing and output handling
- Use "// Your code here" for the main logic
- Students should fill in the algorithm themselves

Return ONLY this JSON format (no other text):
{
  "JAVASCRIPT": "function functionName() {\\n    // Your code here\\n}\\n\\n// Input parsing code...",
  "PYTHON": "def function_name():\\n    # Your code here\\n    pass\\n\\n# Input parsing code...",
  "JAVA": "public class Main {\\n    public static returnType functionName() {\\n        // Your code here\\n        return null;\\n    }\\n}",
  "CPP": "class Solution {\\npublic:\\n    returnType functionName() {\\n        // Your code here\\n    }\\n};"
}`;

  try {
    const responseText = await generateAIResponse(systemPrompt, userPrompt, {
      maxTokens: 2000,
      temperature: 0.1, // Lower temperature for more consistent templates
    });
    
    const starterCode = extractJSON(responseText);
    
    // Validate and clean the starter code
    const validatedStarterCode = {};
    languages.forEach(lang => {
      if (starterCode[lang]) {
        // Make sure it's actually starter code (not complete solution)
        let code = starterCode[lang];
        
        // Check if it contains solution indicators and replace with placeholders
        if (lang === 'JAVASCRIPT') {
          // Remove any complete logic and replace with placeholder
          code = code.replace(/\/\/ .*implementation.*[\s\S]*?(?=\/\/|$)/gi, '// Your code here\n');
          code = code.replace(/return [^;]*;/g, '// Your code here\n    return null;');
        } else if (lang === 'PYTHON') {
          code = code.replace(/# .*implementation.*[\s\S]*?(?=#|$)/gi, '# Your code here\n    pass');
          code = code.replace(/return [^\n]*/g, '# Your code here\n        pass');
        } else if (lang === 'JAVA') {
          code = code.replace(/\/\/ .*implementation.*[\s\S]*?(?=\/\/|return|$)/gi, '// Your code here\n        ');
          code = code.replace(/return [^;]*;/g, '// Your code here\n        return null;');
        } else if (lang === 'CPP') {
          code = code.replace(/\/\/ .*implementation.*[\s\S]*?(?=\/\/|return|$)/gi, '// Your code here\n        ');
          code = code.replace(/return [^;]*;/g, '// Your code here\n        return nullptr;');
        }
        
        validatedStarterCode[lang] = code;
      } else {
        // Provide language-specific fallback starter templates
        validatedStarterCode[lang] = getStarterCodeTemplate(lang, title);
      }
    });
    
    return validatedStarterCode;
    
  } catch (error) {
    console.error('Error generating starter code:', error);
    
    // Return fallback starter code for all languages
    const fallbackCode = {};
    languages.forEach(lang => {
      fallbackCode[lang] = getStarterCodeTemplate(lang, title);
    });
    
    return fallbackCode;
  }
};

/**
 * Get fallback starter code templates
 */
const getStarterCodeTemplate = (language, title) => {
  const templates = {
    JAVASCRIPT: `/**
 * ${title}
 * @param {any} input - Problem input
 * @return {any} - Problem output
 */
function solution(input) {
    // Your code here
    return null;
}

// Input parsing
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    // Parse input here
    const input = line.trim();
    
    // Call solution
    const result = solution(input);
    
    // Output result
    console.log(result);
    rl.close();
});`,

    PYTHON: `"""
${title}
"""
class Solution:
    def solve(self, input_data):
        # Your code here
        pass

# Input parsing
if __name__ == "__main__":
    import sys
    
    # Read input
    input_data = sys.stdin.readline().strip()
    
    # Create solution instance
    sol = Solution()
    result = sol.solve(input_data)
    
    # Print result
    print(result)`,

    JAVA: `/**
 * ${title}
 */
public class Main {
    public static Object solution(String input) {
        // Your code here
        return null;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read input
        String input = scanner.nextLine().trim();
        
        // Call solution
        Object result = solution(input);
        
        // Print result
        System.out.println(result);
        scanner.close();
    }
}`,

    CPP: `/**
 * ${title}
 */
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    auto solve(string input) {
        // Your code here
        return nullptr;
    }
};

int main() {
    string input;
    getline(cin, input);
    
    Solution solution;
    auto result = solution.solve(input);
    
    cout << result << endl;
    return 0;
}`
  };

  return templates[language] || `// ${title}\n// Your code here`;
};

/**
 * Generate problem discussion response
 */
export const generateProblemDiscussionResponse = async ({
  problemTitle,
  problemDescription,
  difficulty,
  tags,
  userMessage,
  chatHistory
}) => {
  const systemPrompt = `You are an expert coding instructor and mentor. Help users understand coding problems and develop problem-solving skills.

GUIDELINES:
1. Be helpful and educational
2. Don't give away complete solutions
3. Guide thinking process
4. Explain concepts clearly
5. Ask clarifying questions when needed
6. Provide hints progressively
7. Be encouraging and supportive

Context: The user is working on "${problemTitle}" (${difficulty} difficulty)`;

  const contextInfo = `
Problem: ${problemTitle}
Description: ${problemDescription || 'Not provided'}
Difficulty: ${difficulty}
Tags: ${tags.join(', ')}

Chat History:
${chatHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

User Question: ${userMessage}`;

  try {
    const response = await generateAIResponse(systemPrompt, contextInfo, {
      maxTokens: 1000,
      temperature: 0.7,
    });
    
    return response || "I'd be happy to help! Could you clarify what specific aspect of this problem you'd like to discuss?";
    
  } catch (error) {
    console.error('Error generating discussion response:', error);
    return "I'm having trouble responding right now. Could you please rephrase your question or try again?";
  }
};

/**
 * Generate progressive hints for a coding problem
 */
export const generateProblemHints = async ({
  problemTitle,
  problemDescription,
  difficulty,
  tags,
  constraints,
  existingHints,
  currentHintLevel
}) => {
  const systemPrompt = `You are an expert coding instructor who creates progressive, educational hints for programming problems.

CRITICAL GUIDELINES:
1. Generate hints that guide learning, don't give away the solution
2. Make hints progressive - each level should be more specific
3. Start with general approach, then get more detailed
4. Never include complete code solutions
5. Focus on problem-solving strategy and thinking process
6. Respond with valid JSON array of hint objects

Current hint level: ${currentHintLevel}
Existing hints already given: ${existingHints}

Format: [{"hint":"...","level":${currentHintLevel}}]`;

  const contextInfo = `
Problem: ${problemTitle}
Description: ${problemDescription}
Difficulty: ${difficulty}
Tags: ${tags.join(', ')}
${constraints ? `Constraints: ${constraints}` : ''}
`;

  let userPrompt;
  
  if (existingHints === 0) {
    userPrompt = `${contextInfo}

Generate the FIRST hint for this problem. It should be:
- Very general and high-level
- Focus on understanding the problem
- Suggest thinking about the approach
- NOT give away any specific implementation details

Return as JSON: [{"hint":"your hint here","level":1}]`;
  } else {
    userPrompt = `${contextInfo}

Generate hint level ${currentHintLevel} for this problem. Previous hints: ${existingHints}

This hint should be:
- More specific than previous hints
- Build upon what was already suggested
- Guide toward the solution without giving it away
- Appropriate for hint level ${currentHintLevel}

Return as JSON: [{"hint":"your hint here","level":${currentHintLevel}}]`;
  }

  try {
    const responseText = await generateAIResponse(systemPrompt, userPrompt, {
      maxTokens: 800,
      temperature: 0.6,
    });
    
    const hints = extractJSON(responseText);
    
    if (Array.isArray(hints) && hints.length > 0) {
      return hints;
    } else {
      throw new Error('Invalid hint format received');
    }
    
  } catch (error) {
    console.error('Error generating hints:', error);
    
    // Fallback hint generation
    const fallbackHints = generateFallbackHintsByLevel(difficulty, currentHintLevel);
    return [{ hint: fallbackHints, level: currentHintLevel }];
  }
};

/**
 * Generate fallback hints by difficulty and level
 */
const generateFallbackHintsByLevel = (difficulty, level) => {
  const hintsByDifficulty = {
    EASY: {
      1: "Start by understanding what the problem is asking you to do. Read through the examples carefully.",
      2: "Think about what data structure would be most appropriate for this problem.",
      3: "Consider the simplest approach first - sometimes brute force is a good starting point.",
      4: "Look at the constraints to understand the expected time complexity."
    },
    MEDIUM: {
      1: "Break this problem down into smaller subproblems that are easier to solve.",
      2: "Consider what algorithms or data structures are commonly used for this type of problem.",
      3: "Think about the time and space complexity requirements.",
      4: "Look for patterns in the examples that might suggest the solution approach."
    },
    HARD: {
      1: "This problem likely requires an advanced algorithm or optimization technique.",
      2: "Consider dynamic programming, graph algorithms, or advanced data structures.",
      3: "Think about the mathematical properties of the problem.",
      4: "Try to solve smaller versions of the problem first to build intuition."
    }
  };

  const hints = hintsByDifficulty[difficulty] || hintsByDifficulty.EASY;
  return hints[level] || hints[4] || "Consider different approaches and don't hesitate to research relevant algorithms.";
};

/**
 * Generate AI analysis for code submission
 */
export const generateSubmissionAnalysis = async ({
  sourceCode,
  language,
  status,
  testCases,
  averageTime,
  averageMemory,
  submissionId,
  problemId
}) => {
  const systemPrompt = `You are an expert code reviewer and algorithm analyst. Analyze the provided code submission and provide detailed insights.

CRITICAL: Respond with ONLY valid JSON. No explanations, no markdown, no code blocks.

Required JSON format:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "performance": "detailed performance analysis",
  "codeQuality": "Excellent|Good|Fair|Poor",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  const passedTests = testCases.filter(tc => tc.passed).length;
  const totalTests = testCases.length;
  
  const userPrompt = `Analyze this ${language} code submission:

CODE:
\`\`\`${language.toLowerCase()}
${sourceCode}
\`\`\`

SUBMISSION DETAILS:
- Status: ${status}
- Test Cases: ${passedTests}/${totalTests} passed
- Average Runtime: ${averageTime} ms
- Average Memory: ${averageMemory} KB
- Language: ${language}

Provide analysis focusing on:
1. Time and space complexity (use Big O notation)
2. Performance characteristics and efficiency
3. Code quality and style
4. Strengths of the implementation
5. Specific suggestions for improvement

Return ONLY the JSON object with no additional text.`;

  try {
    const responseText = await generateAIResponse(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.3,
    });
    
    const analysis = extractJSON(responseText);
    
    // Validate required fields
    if (!analysis.timeComplexity || !analysis.spaceComplexity) {
      throw new Error('Missing complexity analysis');
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Error generating submission analysis:', error);
    
    // Return fallback analysis
    return {
      timeComplexity: "O(?)",
      spaceComplexity: "O(?)",
      performance: `Based on the submission metrics, your solution executed with an average runtime of ${averageTime} ms and used ${averageMemory} KB of memory. ${
        status === 'ACCEPTED' ? 'All test cases passed successfully.' : 'Some test cases failed.'
      }`,
      codeQuality: status === 'ACCEPTED' ? 'Good' : 'Fair',
      strengths: [
        status === 'ACCEPTED' ? 'Solution produces correct results' : 'Code structure appears sound',
        `Written in ${language} with clear syntax`
      ],
      suggestions: [
        status === 'ACCEPTED' ? 
          'Consider optimizing for better time complexity if possible' : 
          'Review the logic for edge cases that might be causing test failures',
        'Add more comments to explain complex logic',
        'Consider alternative algorithms or data structures'
      ]
    };
  }
};
import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import toast from "react-hot-toast";
import axios from 'axios'; // Add this import
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
  Building2,
  Sparkles,
  Loader
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios";

// Create a special axios instance for AI operations with longer timeout
const aiAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  timeout: 120000, // 2 minutes for AI operations
});

// Update the Zod schema to include the companies field
const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  // Add companies field as an array of strings
  companies: z.array(z.string()).optional().default([]),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output must be at least 1 character"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    CPP: z.string().min(1, "C++ solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    CPP: z.string().min(1, "C++ solution is required"),
  }),
});

// Update the sample data to include companies
const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  companies: ["Amazon", "Microsoft", "Google"], // Add companies
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testCases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
    CPP: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    CPP: `#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};

int main() {
    int n;
    cin >> n;
    
    Solution solution;
    int result = solution.climbStairs(n);
    
    cout << result << endl;
    return 0;
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    CPP: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Base cases
        if (n <= 2) {
            return n;
        }
        
        // Dynamic programming approach
        vector<int> dp(n + 1);
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
        
        /* Alternative approach with O(1) space
        int a = 1; // ways to climb 1 step
        int b = 2; // ways to climb 2 steps
        
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        
        return n == 1 ? a : b;
        */
    }
};

int main() {
    int n;
    cin >> n;
    
    Solution solution;
    int result = solution.climbStairs(n);
    
    cout << result << endl;
    return 0;
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  companies: ["Facebook", "Microsoft", "Apple"], // Add companies
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testCases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    CPP: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
    CPP: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
        return false;
    }
};

int main() {
    string s;
    getline(cin, s);
    
    Solution solution;
    bool result = solution.isPalindrome(s);
    
    cout << (result ? "true" : "false") << endl;
    return 0;
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
    CPP: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

class Solution {
private:
    string preprocess(const string& s) {
        string result;
        for (char c : s) {
            if (isalnum(c)) {
                result += tolower(c);
            }
        }
        return result;
    }
    
public:
    bool isPalindrome(string s) {
        // Preprocess the string
        s = preprocess(s);
        
        // Check if it's a palindrome using two pointers
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
};

int main() {
    string s;
    getline(cin, s);
    
    Solution solution;
    bool result = solution.isPalindrome(s);
    
    cout << (result ? "true" : "false") << endl;
    return 0;
}`,
  },
};

const CreateProblemForm = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { 
      getProblemById, 
      updateProblem, 
      currentProblem, 
      clearCurrentProblem 
    } = useProblemStore();
    
    const [sampleType, setSampleType] = useState("DP");
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isDark, setIsDark] = useState(
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    
    // AI Generation Loading States
    const [isGeneratingTestCases, setIsGeneratingTestCases] = useState(false);
    const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
    const [isGeneratingStarterCode, setIsGeneratingStarterCode] = useState(false);
    const [isGeneratingHints, setIsGeneratingHints] = useState(false);

    // Listen for OS theme changes
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setIsDark(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Form setup with proper default values
    const {register, control, handleSubmit, reset, setValue, watch, formState:{errors}} = useForm({
      resolver: zodResolver(problemSchema),
      defaultValues: {
        title: "",
        description: "",
        difficulty: "EASY",
        tags: [""],
        companies: [""],
        constraints: "",
        hints: "",
        editorial: "",
        testCases: [{ input: "", output: "" }],
        examples: {
          JAVASCRIPT: { input: "", output: "", explanation: "" },
          PYTHON: { input: "", output: "", explanation: "" },
          JAVA: { input: "", output: "", explanation: "" },
          CPP: { input: "", output: "", explanation: "" },
        },
        codeSnippets: {
          JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
          PYTHON: "def solution():\n    # Write your code here\n    pass",
          JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
          CPP: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};\n\nint main() {\n    Solution solution;\n    solution.solve();\n    return 0;\n}",
        },
        referenceSolutions: {
          JAVASCRIPT: "// Add your reference solution here",
          PYTHON: "# Add your reference solution here",
          JAVA: "// Add your reference solution here",
          CPP: "// Add your reference solution here",
        },
      }
    });

    const watchedValues = watch(); // This will give you current form values

    // Field arrays
    const {
      fields: companyFields,
      append: appendCompany,
      remove: removeCompany,
      replace: replaceCompanies,
    } = useFieldArray({
      control,
      name: "companies",
    });

    const {
      fields: testCaseFields,
      append: appendTestCase,
      remove: removeTestCase,
      replace: replaceTestCases,
    } = useFieldArray({
      control,
      name: "testCases",
    });

    const {
      fields: tagFields,
      append: appendTag,
      remove: removeTag,
      replace: replaceTags,
    } = useFieldArray({
      control,
      name: "tags",
    });

    // Load problem data when editing
    useEffect(() => {
      if (isEditing && id && !isDataLoaded) {
        const loadProblem = async () => {
          try {
            setIsLoading(true);
            console.log("Loading problem with ID:", id);
            
            const problem = await getProblemById(id);
            console.log("Loaded problem data:", problem);
            
            if (problem) {
              // Prepare tags array - ensure it's not empty
              const tagsArray = problem.tags && problem.tags.length > 0 ? problem.tags : [""];
              
              // Prepare companies array - ensure it's not empty
              const companiesArray = problem.companies && problem.companies.length > 0 ? problem.companies : [""];
              
              // Prepare test cases array
              const testCasesArray = problem.testcases && problem.testcases.length > 0 ? problem.testcases : [{ input: "", output: "" }];
              
              // Prepare reference solutions
              let referenceSolutions = {
                JAVASCRIPT: "",
                PYTHON: "",
                JAVA: "",
                CPP: "",
              };
              
              if (problem.referenceSolutions && Array.isArray(problem.referenceSolutions)) {
                problem.referenceSolutions.forEach(ref => {
                  if (ref.language && ref.codeSolution) {
                    referenceSolutions[ref.language] = ref.codeSolution;
                  }
                });
              }

              // Prepare examples
              const examples = problem.examples || {
                JAVASCRIPT: { input: "", output: "", explanation: "" },
                PYTHON: { input: "", output: "", explanation: "" },
                JAVA: { input: "", output: "", explanation: "" },
                CPP: { input: "", output: "", explanation: "" },
              };

              // Prepare code snippets
              const codeSnippets = problem.codeSnippets || {
                JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
                PYTHON: "def solution():\n    # Write your code here\n    pass",
                JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
                CPP: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};\n\nint main() {\n    Solution solution;\n    solution.solve();\n    return 0;\n}",
              };

              // First replace field arrays
              replaceTags(tagsArray);
              replaceCompanies(companiesArray);
              replaceTestCases(testCasesArray);

              // Then set individual form values
              setValue("title", problem.title || "");
              setValue("description", problem.description || "");
              setValue("difficulty", problem.difficulty || "EASY");
              setValue("constraints", problem.constraints || "");
              setValue("hints", problem.hints || "");
              setValue("editorial", problem.editorial || "");
              
              // Set examples for each language
              Object.keys(examples).forEach(language => {
                setValue(`examples.${language}.input`, examples[language]?.input || "");
                setValue(`examples.${language}.output`, examples[language]?.output || "");
                setValue(`examples.${language}.explanation`, examples[language]?.explanation || "");
              });

              // Set code snippets for each language
              Object.keys(codeSnippets).forEach(language => {
                setValue(`codeSnippets.${language}`, codeSnippets[language] || "");
              });

              // Set reference solutions for each language
              Object.keys(referenceSolutions).forEach(language => {
                setValue(`referenceSolutions.${language}`, referenceSolutions[language] || "");
              });

              setIsDataLoaded(true);
              console.log("Form data loaded successfully");
            }
          } catch (error) {
            console.error("Error loading problem:", error);
            toast.error("Failed to load problem data");
            navigate("/problems");
          } finally {
            setIsLoading(false);
          }
        };

        loadProblem();
      }
    }, [isEditing, id, isDataLoaded, getProblemById, setValue, replaceTags, replaceCompanies, replaceTestCases, navigate]);

    // Cleanup when component unmounts or when switching between create/edit modes
    useEffect(() => {
      return () => {
        if (isEditing) {
          clearCurrentProblem();
        }
        setIsDataLoaded(false);
      };
    }, [isEditing, clearCurrentProblem]);

    // Reset isDataLoaded when switching between problems
    useEffect(() => {
      setIsDataLoaded(false);
    }, [id]);

    // Update the submit function
    const onSubmit = async (value) => {
      try {
        setIsLoading(true);
        console.log("Submitting form data:", value);
        
        const transformedData = {
          ...value,
          testcases: value.testCases,
          companies: value.companies.filter(company => company.trim() !== ""),
          tags: value.tags.filter(tag => tag.trim() !== ""),
          referenceSolutions: Object.entries(value.referenceSolutions).map(
            ([language, codeSolution]) => ({
              language,
              codeSolution,
            })
          )
        };
        
        delete transformedData.testCases;
        
        if (isEditing) {
          const res = await updateProblem(id, transformedData);
          toast.success("Problem updated successfully");
        } else {
          const res = await axiosInstance.post('/problems/create-problem', transformedData);
          toast.success(res.data.message || "Problem created successfully");
        }
        
        navigate("/problems");
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          `Failed to ${isEditing ? 'update' : 'create'} problem`
        );
      } finally {
        setIsLoading(false);
      }
    };

    const loadSampleData = () => {
      const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
      
      replaceTags(sampleData.tags.map((tag) => tag));
      replaceTestCases(sampleData.testCases.map((tc) => tc));
      replaceCompanies(sampleData.companies.map((company) => company));

      // Reset the form with sample data
      reset(sampleData);
      
      // Show success message
      toast.success(`Loaded ${sampleType === "DP" ? "Dynamic Programming" : "String Processing"} sample data!`);
    };

    const generateTestCasesWithAI = async () => {
      const currentValues = watchedValues;
      
      if (!currentValues.title || !currentValues.description || !currentValues.difficulty) {
        toast.error('Please fill in title, description, and difficulty first');
        return;
      }

      setIsGeneratingTestCases(true);
      try {
        const response = await axiosInstance.post('/testcases/generate-testcases', {
          title: currentValues.title,
          description: currentValues.description,
          difficulty: currentValues.difficulty,
          tags: currentValues.tags || [],
          constraints: currentValues.constraints || ''
        });

        const generatedTestCases = response.data.data.testCases;
        
        const transformedTestCases = generatedTestCases.map(tc => ({
          input: tc.input,
          output: tc.output
        }));

        replaceTestCases(transformedTestCases);

        toast.success(`Generated ${generatedTestCases.length} test cases with Claude AI!`);
      } catch (error) {
        console.error('Error generating test cases:', error);
        toast.error('Failed to generate test cases. Please try again.');
      } finally {
        setIsGeneratingTestCases(false);
      }
    };

    const generateExamplesWithAI = async () => {
      const currentValues = watchedValues;
      
      if (!currentValues.title || !currentValues.description) {
        toast.error('Please fill in title and description first');
        return;
      }

      setIsGeneratingExamples(true);
      try {
        const languages = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP'];
        const examplePromises = languages.map(language => 
          axiosInstance.post('/testcases/generate-example', {
            title: currentValues.title,
            description: currentValues.description,
            language: language
          })
        );

        const responses = await Promise.allSettled(examplePromises);
        
        responses.forEach((response, index) => {
          const language = languages[index];
          if (response.status === 'fulfilled') {
            const example = response.value.data.data.example;
            setValue(`examples.${language}.input`, example?.input || '');
            setValue(`examples.${language}.output`, example?.output || '');
            setValue(`examples.${language}.explanation`, example?.explanation || '');
          } else {
            console.error(`Failed to generate example for ${language}:`, response.reason);
            setValue(`examples.${language}.input`, 'Sample input');
            setValue(`examples.${language}.output`, 'Sample output');
            setValue(`examples.${language}.explanation`, 'Sample explanation');
          }
        });

        toast.success('Generated examples for all languages with Claude AI!');
      } catch (error) {
        console.error('Error generating examples:', error);
        toast.error('Failed to generate examples. Please try again.');
      } finally {
        setIsGeneratingExamples(false);
      }
    };

    // Enhanced complete generation function
    const generateCompleteDataWithAI = async () => {
      const currentValues = watchedValues;
      
      if (!currentValues.title || !currentValues.description || !currentValues.difficulty) {
        toast.error('Please fill in title, description, and difficulty first');
        return;
      }

      console.log('Starting complete generation with:', {
        title: currentValues.title,
        description: currentValues.description,
        difficulty: currentValues.difficulty
      });

      setIsGeneratingTestCases(true);
      setIsGeneratingExamples(true);
      setIsGeneratingStarterCode(true);
      setIsGeneratingHints(true);

      try {
        console.log('Making AI request - this may take up to 2 minutes...');
        
        // Show progress toast
        const progressToast = toast.loading('Generating complete problem data with AI... This may take up to 2 minutes.');
        
        const requestData = {
          title: currentValues.title,
          description: currentValues.description,
          difficulty: currentValues.difficulty,
          tags: currentValues.tags || [],
          constraints: currentValues.constraints || '',
          languages: ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP']
        };
        
        console.log('Request data:', requestData);

        // Use the AI-specific axios instance with longer timeout
        const response = await aiAxiosInstance.post('/testcases/generate-complete', requestData);

        // Dismiss progress toast
        toast.dismiss(progressToast);

        console.log('Complete generation response:', response.data);

        if (!response.data || !response.data.data) {
          throw new Error('Invalid response format from server');
        }

        const { testCases, examples, starterCode, hints } = response.data.data;

        let updatedCount = 0;

        // Update test cases
        if (testCases && Array.isArray(testCases) && testCases.length > 0) {
          console.log('Updating test cases:', testCases);
          const transformedTestCases = testCases.map(tc => ({
            input: tc.input || '',
            output: tc.output || ''
          }));
          replaceTestCases(transformedTestCases);
          updatedCount++;
          console.log(`✅ Updated ${transformedTestCases.length} test cases`);
        } else {
          console.warn('⚠️ No test cases received');
        }

        // Update examples
        if (examples && typeof examples === 'object' && Object.keys(examples).length > 0) {
          console.log('Updating examples:', examples);
          Object.keys(examples).forEach(language => {
            const example = examples[language];
            if (example) {
              setValue(`examples.${language}.input`, example.input || '');
              setValue(`examples.${language}.output`, example.output || '');
              setValue(`examples.${language}.explanation`, example.explanation || '');
            }
          });
          updatedCount++;
          console.log(`✅ Updated examples for languages: ${Object.keys(examples).join(', ')}`);
        } else {
          console.warn('⚠️ No examples received');
        }

        // Update starter code
        if (starterCode && typeof starterCode === 'object' && Object.keys(starterCode).length > 0) {
          console.log('Updating starter code:', Object.keys(starterCode));
          Object.keys(starterCode).forEach(language => {
            if (starterCode[language]) {
              setValue(`codeSnippets.${language}`, starterCode[language]);
            }
          });
          updatedCount++;
          console.log(`✅ Updated starter code for languages: ${Object.keys(starterCode).join(', ')}`);
        } else {
          console.warn('⚠️ No starter code received');
        }

        // Update hints
        if (hints && Array.isArray(hints) && hints.length > 0) {
          console.log('Updating hints:', hints);
          const hintsText = hints.map((hint, index) => {
            const level = hint.level || (index + 1);
            const hintText = hint.hint || hint;
            return `${level}. ${hintText}`;
          }).join('\n\n');
          setValue('hints', hintsText);
          updatedCount++;
          console.log(`✅ Updated ${hints.length} hints`);
        } else {
          console.warn('⚠️ No hints received');
        }

        console.log(`🎉 Generation complete! Updated ${updatedCount}/4 components`);

        if (updatedCount > 0) {
          toast.success(`Generated complete problem data! Updated ${updatedCount}/4 components with Claude AI`);
        } else {
          toast.warning('Generated data but no components were updated. Please check the console for details.');
        }

      } catch (error) {
        console.error('❌ Error generating complete data:', error);
        
        // Enhanced error logging
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        
        // Provide more specific error messages
        if (error.code === 'ECONNABORTED') {
          toast.error('AI generation timed out. The request is taking too long. Please try generating components individually.');
        } else if (error?.response?.status === 401) {
          toast.error('Authentication failed. Please login as admin.');
        } else if (error?.response?.status === 403) {
          toast.error('Access denied. Admin privileges required.');
        } else if (error?.response?.status === 500) {
          toast.error('Server error during generation. Please try again.');
        } else if (error?.response?.data?.message) {
          toast.error(`AI Generation failed: ${error.response.data.message}`);
        } else if (error.code === 'ERR_NETWORK') {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('Failed to generate complete data. Please try generating components individually.');
        }
      } finally {
        setIsGeneratingTestCases(false);
        setIsGeneratingExamples(false);
        setIsGeneratingStarterCode(false);
        setIsGeneratingHints(false);
      }
    };

    const generateStarterCodeWithAI = async () => {
      const currentValues = watchedValues;
      
      if (!currentValues.title || !currentValues.description) {
        toast.error('Please fill in title and description first');
        return;
      }

      setIsGeneratingStarterCode(true);
      try {
        console.log('Generating starter code for:', currentValues.title);
        
        const response = await axiosInstance.post('/testcases/generate-starter-code', {
          title: currentValues.title,
          description: currentValues.description,
          languages: ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP']
        });

        const starterCode = response.data.data.starterCode;
        
        if (starterCode && typeof starterCode === 'object') {
          let updatedLanguages = [];
          
          Object.keys(starterCode).forEach(language => {
            if (starterCode[language]) {
              // Validate that it's actually starter code (contains placeholders)
              const code = starterCode[language];
              const hasPlaceholder = code.includes('Your code here') || 
                                code.includes('// TODO') || 
                                code.includes('# TODO') || 
                                code.includes('pass') ||
                                code.includes('return null') ||
                                code.includes('return nullptr');
              
              if (hasPlaceholder) {
                setValue(`codeSnippets.${language}`, code);
                updatedLanguages.push(language);
              } else {
                console.warn(`Generated code for ${language} appears to be a complete solution, not starter code`);
                // Set a basic template instead
                setValue(`codeSnippets.${language}`, getBasicTemplate(language, currentValues.title));
                updatedLanguages.push(language);
              }
            }
          });
          
          if (updatedLanguages.length > 0) {
            toast.success(`Generated starter code templates for ${updatedLanguages.length} languages!`);
          } else {
            toast.warning('Generated code but used fallback templates. AI may have generated complete solutions instead of starter code.');
          }
        } else {
          toast.error('Invalid response format from AI service');
        }
      } catch (error) {
        console.error('Error generating starter code:', error);
        
        // Provide fallback templates
        const languages = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP'];
        languages.forEach(language => {
          setValue(`codeSnippets.${language}`, getBasicTemplate(language, currentValues.title));
        });
        
        toast.error('Failed to generate starter code with AI. Using basic templates instead.');
      } finally {
        setIsGeneratingStarterCode(false);
      }
    };

    const generateHintsWithAI = async () => {
      const currentValues = watchedValues;
      
      if (!currentValues.title || !currentValues.description) {
        toast.error('Please fill in title and description first');
        return;
      }

      setIsGeneratingHints(true);
      try {
        console.log('Generating hints for:', currentValues.title);
        
        const response = await axiosInstance.post('/testcases/generate-hints', {
          title: currentValues.title,
          description: currentValues.description,
          difficulty: currentValues.difficulty || 'EASY',
          tags: currentValues.tags || [],
          constraints: currentValues.constraints || ''
        });

        const hints = response.data.data.hints;
        
        if (hints && Array.isArray(hints) && hints.length > 0) {
          // Format hints as numbered list
          const hintsText = hints.map((hint, index) => {
            const hintText = typeof hint === 'string' ? hint : (hint.hint || hint.text || '');
            return `${index + 1}. ${hintText}`;
          }).join('\n\n');
          
          setValue('hints', hintsText);
          toast.success(`Generated ${hints.length} helpful hints with AI!`);
        } else if (typeof hints === 'string') {
          // If hints is returned as a single string
          setValue('hints', hints);
          toast.success('Generated hints with AI!');
        } else {
          toast.warning('No hints were generated. Please try again.');
        }
      } catch (error) {
        console.error('Error generating hints:', error);
        
        // Provide fallback hints based on difficulty
        const fallbackHints = getFallbackHints(currentValues.difficulty, currentValues.title);
        setValue('hints', fallbackHints);
        
        toast.error('Failed to generate hints with AI. Using fallback hints instead.');
      } finally {
        setIsGeneratingHints(false);
      }
    };

    // Helper function for fallback hints
    const getFallbackHints = (difficulty, title) => {
      const difficultyHints = {
        EASY: [
          "Start by understanding the problem requirements clearly.",
          "Think about the simplest approach first.",
          "Consider edge cases like empty inputs or single elements."
        ],
        MEDIUM: [
          "Break down the problem into smaller subproblems.",
          "Consider using data structures like arrays, maps, or sets.",
          "Think about the time and space complexity of your solution."
        ],
        HARD: [
          "Consider advanced algorithms like dynamic programming or graph algorithms.",
          "Think about optimization techniques to reduce time complexity.",
          "Consider multiple approaches and compare their trade-offs."
        ]
      };

      const hints = difficultyHints[difficulty] || difficultyHints.EASY;
      return hints.map((hint, index) => `${index + 1}. ${hint}`).join('\n\n');
    };

    // Helper function for basic templates
    const getBasicTemplate = (language, title) => {
      const templates = {
        JAVASCRIPT: `/**
 * ${title || 'Problem'}
 */
function solution() {
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
    const input = line.trim();
    const result = solution(input);
    console.log(result);
    rl.close();
});`,

        PYTHON: `"""
${title || 'Problem'}
"""
class Solution:
    def solve(self):
        # Your code here
        pass

if __name__ == "__main__":
    import sys
    input_data = sys.stdin.readline().strip()
    
    sol = Solution()
    result = sol.solve(input_data)
    print(result)`,

        JAVA: `/**
 * ${title || 'Problem'}
 */
import java.util.Scanner;

public class Main {
    public static void solution() {
        // Your code here
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        
        solution();
        scanner.close();
    }
}`,

        CPP: `/**
 * ${title || 'Problem'}
 */
#include <iostream>
using namespace std;

class Solution {
public:
    void solve() {
        // Your code here
    }
};

int main() {
    string input;
    getline(cin, input);
    
    Solution solution;
    solution.solve();
    return 0;
}`
      };

      return templates[language] || `// ${title || 'Problem'}\n// Your code here`;
    };

    // Show loading spinner while loading problem data
    if (isEditing && isLoading && !isDataLoaded) {
      return (
        <div className={`min-h-screen w-full flex items-center justify-center ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            <div className="loading loading-spinner loading-lg text-blue-500"></div>
            <span className={`text-lg font-medium ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Loading problem data...
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen w-full ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className="w-full max-w-none px-4 py-8">
        <div className={`w-full rounded-2xl shadow-2xl border ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-gray-100' 
          : 'bg-white border-gray-200 text-gray-900'
        }`}>
        <div className="w-full p-6 md:p-8">
          {/* Header Section */}
          <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b-2 ${
          isDark ? 'border-red-600' : 'border-red-500'
          }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex items-center gap-4">
            <FileText className={`w-8 h-8 md:w-10 md:h-10 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`bg-red-700 bg-clip-text `}>
            {isEditing ? 'Edit Problem' : 'Create Problem'}
            </span>
          </h1>

          {/* MAIN AI BUTTON - TOP RIGHT */}
          <button
            type="button"
            onClick={generateCompleteDataWithAI}
            disabled={isGeneratingTestCases || isGeneratingExamples || isGeneratingStarterCode || isGeneratingHints}
            className={`btn btn-circle btn-lg shadow-xl transition-all duration-200 hover:scale-110 bg-white hover:bg-gray-100 border-2 border-purple-500 hover:border-purple-600`}
            title="Generate everything with AI"
          >
            {(isGeneratingTestCases || isGeneratingExamples || isGeneratingStarterCode || isGeneratingHints) ? (
              <Loader className="w-6 h-6 animate-spin text-purple-600" />
            ) : (
              <img src="/AI-m.svg" alt="AI" className="w-6 h-6" />
            )}
          </button>
          </div>

          {/* Sample Questions Section */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 mb-8 ${
            isDark 
              ? 'bg-gray-750 border-purple-500' 
              : 'bg-gray-50 border-purple-500'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold flex items-center gap-3 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                <Download className="w-6 h-6" />
                Sample Questions
              </h3>
              
              {/* Sample Question Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSampleType("DP");
                    loadSampleData();
                  }}
                  className={`btn btn-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                      : 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  }`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  DP Sample
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSampleType("STRING");
                    loadSampleData();
                  }}
                  className={`btn btn-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  }`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  String Sample
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}>
                💡 <strong>Pro Tip:</strong> Use these sample questions as templates. Click the buttons above to load sample data or use the AI generation features to create custom problems.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-10">
          {/* Basic Information Section */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
            isDark 
            ? 'bg-gray-750 border-blue-500' 
            : 'bg-gray-50 border-blue-500'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
            Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-control lg:col-span-2">
              <label className="label">
              <span className={`label-text text-lg font-bold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Title *
              </span>
              </label>
              <input
              type="text"
              className={`input input-bordered w-full text-lg font-medium transition-all duration-200 focus:scale-105 ${
                isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-600' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:bg-gray-50'
              }`}
              {...register("title")}
              placeholder="Enter an engaging problem title"
              />
              {errors.title && (
              <label className="label">
                <span className="label-text-alt text-red-500 font-medium">
                {errors.title.message}
                </span>
              </label>
              )}
            </div>

            <div className="form-control lg:col-span-2">
              <label className="label">
              <span className={`label-text text-lg font-bold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Description *
              </span>
              </label>
              <textarea
              className={`textarea textarea-bordered min-h-40 w-full text-base p-4 resize-y font-medium transition-all duration-200 focus:scale-105 ${
                isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-600' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:bg-gray-50'
              }`}
              {...register("description")}
              placeholder="Provide a detailed and clear problem description"
              />
              {errors.description && (
              <label className="label">
                <span className="label-text-alt text-red-500 font-medium">
                {errors.description.message}
                </span>
              </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
              <span className={`label-text text-lg font-bold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Difficulty *
              </span>
              </label>
              <select
              className={`select select-bordered w-full text-lg font-medium transition-all duration-200 focus:scale-105 ${
                isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              {...register("difficulty")}
              >
              <option value="EASY">🟢 Easy</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HARD">🔴 Hard</option>
              </select>
            </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
            isDark 
            ? 'bg-gray-750 border-red-500' 
            : 'bg-gray-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold flex items-center gap-3 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>
              <BookOpen className="w-6 h-6" />
              Tags
            </h3>
            <button
              type="button"
              className={`btn btn-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDark 
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                : 'bg-green-600 hover:bg-green-700 text-white border-green-600'
              }`}
              onClick={() => appendTag("")}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Tag
            </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-center">
              <input
                type="text"
                className={`input input-bordered flex-1 font-medium transition-all duration-200 focus:scale-105 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
                {...register(`tags.${index}`)}
                placeholder="Enter tag name"
              />
              <button
                type="button"
                className={`btn btn-square transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                }`}
                onClick={() => removeTag(index)}
                disabled={tagFields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              </div>
            ))}
            </div>
          </div>

          {/* Companies Section */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
            isDark 
            ? 'bg-gray-750 border-blue-500' 
            : 'bg-gray-50 border-blue-500'
          }`}>
            <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold flex items-center gap-3 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <Building2 className="w-6 h-6" />
              Companies
            </h3>
            <button
              type="button"
              className={`btn font-semibold shadow-lg transition-all duration-200 hover:scale-105 ${
              isDark 
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
              }`}
              onClick={() => appendCompany("")}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Company
            </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-center">
              <input
                type="text"
                className={`input input-bordered flex-1 font-medium transition-all duration-200 focus:scale-105 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                {...register(`companies.${index}`)}
                placeholder="Company name"
              />
              <button
                type="button"
                className={`btn btn-square transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                }`}
                onClick={() => removeCompany(index)}
                disabled={companyFields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              </div>
            ))}
            </div>
          </div>

          {/* Test Cases Section */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
            isDark 
            ? 'bg-gray-750 border-red-500' 
            : 'bg-gray-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold flex items-center gap-3 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>
              <CheckCircle2 className="w-6 h-6" />
              Test Cases
            </h3>
            <div className="flex items-center gap-3">
              {/* AI BUTTON FOR TEST CASES */}
              <button
                type="button"
                onClick={generateTestCasesWithAI}
                disabled={isGeneratingTestCases}
                className={`btn btn-circle btn-sm shadow-lg transition-all duration-200 hover:scale-110 bg-white hover:bg-gray-100 border-2 border-purple-500 hover:border-purple-600`}
                title="Generate test cases with AI"
              >
                {isGeneratingTestCases ? (
                  <Loader className="w-4 h-4 animate-spin text-purple-600" />
                ) : (
                  <img src="/AI-sm.svg" alt="AI" className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                className={`btn font-semibold shadow-lg transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                }`}
                onClick={() => appendTestCase({ input: "", output: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Test Case
              </button>
            </div>
            </div>
            <div className="space-y-6">
            {testCaseFields.map((field, index) => (
              <div key={field.id} className={`rounded-lg p-6 shadow-md border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
              }`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`text-xl font-bold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                Test Case #{index + 1}
                </h4>
                <button
                type="button"
                className={`btn btn-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isDark 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                onClick={() => removeTestCase(index)}
                disabled={testCaseFields.length === 1}
                >
                <Trash2 className="w-4 h-4 mr-1" /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-control">
                <label className="label">
                  <span className={`label-text font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Input
                  </span>
                </label>
                <textarea
                  className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y font-mono transition-all duration-200 focus:scale-105 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                  }`}
                  {...register(`testCases.${index}.input`)}
                  placeholder="Enter test case input"
                />
                </div>
                <div className="form-control">
                <label className="label">
                  <span className={`label-text font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Expected Output
                  </span>
                </label>
                <textarea
                  className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y font-mono transition-all duration-200 focus:scale-105 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                  }`}
                  {...register(`testCases.${index}.output`)}
                  placeholder="Enter expected output"
                />
                </div>
              </div>
              </div>
            ))}
            </div>
          </div>

          {/* Code Editor Sections */}
          <div className="w-full space-y-8">
            {["JAVASCRIPT", "PYTHON", "JAVA", "CPP"].map((language) => (
            <div
              key={language}
              className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
              isDark 
                ? 'bg-gray-750 border-blue-500' 
                : 'bg-gray-50 border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold flex items-center gap-3 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                <Code2 className="w-6 h-6" />
                {language}
                </h3>
                {/* AI BUTTON FOR STARTER CODE - Add this section */}
                <button
                  type="button"
                  onClick={generateStarterCodeWithAI}
                  disabled={isGeneratingStarterCode}
                  className={`btn btn-circle btn-sm shadow-lg transition-all duration-200 hover:scale-110 bg-white hover:bg-gray-100 border-2 border-green-500 hover:border-green-600`}
                  title="Generate starter code with AI"
                >
                  {isGeneratingStarterCode ? (
                    <Loader className="w-4 h-4 animate-spin text-green-600" />
                  ) : (
                    <img src="/AI-sm.svg" alt="AI" className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="space-y-8">
              {/* Starter Code */}
              <div className={`rounded-lg shadow-md border ${
                isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
              }`}>
                <div className="p-6">
                <h4 className={`font-bold text-lg mb-4 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  🚀 Starter Code Template
                </h4>
                <div className="border-2 rounded-lg overflow-hidden border-gray-300 dark:border-gray-600">
                  <Controller
                  name={`codeSnippets.${language}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                    height="350px"
                    language={language.toLowerCase()}
                    theme={isDark ? "vs-dark" : "light"}
                    value={field.value}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                    />
                  )}
                  />
                </div>
                </div>
              </div>

              {/* Reference Solution */}
              <div className={`rounded-lg shadow-md border ${
                isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
              }`}>
                <div className="p-6">
                <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  <CheckCircle2 className={`w-5 h-5 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                  🎯 Reference Solution
                </h4>
                <div className="border-2 rounded-lg overflow-hidden border-gray-300 dark:border-gray-600">
                  <Controller
                  name={`referenceSolutions.${language}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                    height="350px"
                    language={language.toLowerCase()}
                    theme={isDark ? "vs-dark" : "light"}
                    value={field.value}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                    />
                  )}
                  />
                </div>
                </div>
              </div>

              {/* Examples */}
              <div className={`rounded-lg shadow-md border ${
                isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
              }`}>
                <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold text-lg ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  📝 Example
                  </h4>
                  {/* AI BUTTON FOR EXAMPLES */}
                  <button
                    type="button"
                    onClick={generateExamplesWithAI}
                    disabled={isGeneratingExamples}
                    className={`btn btn-circle btn-sm shadow-lg transition-all duration-200 hover:scale-110 bg-white hover:bg-gray-100 border-2 border-blue-500 hover:border-blue-600`}
                    title="Generate examples with AI"
                  >
                    {isGeneratingExamples ? (
                      <Loader className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <img src="/AI-sm.svg" alt="AI" className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-bold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Input
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y font-mono transition-all duration-200 focus:scale-105 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    {...register(`examples.${language}.input`)}
                    placeholder="Example input"
                  />
                  </div>
                  <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-bold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Output
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y font-mono transition-all duration-200 focus:scale-105 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    {...register(`examples.${language}.output`)}
                    placeholder="Example output"
                  />
                  </div>
                  <div className="form-control lg:col-span-2">
                  <label className="label">
                    <span className={`label-text font-bold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Explanation
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered min-h-32 w-full p-3 resize-y transition-all duration-200 focus:scale-105 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    {...register(`examples.${language}.explanation`)}
                    placeholder="Explain the example"
                  />
                  </div>
                </div>
                </div>
              </div>
              </div>
            </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className={`w-full rounded-xl p-6 shadow-lg border-l-4 ${
            isDark 
                    ? 'bg-gray-750 border-red-500' 
                    : 'bg-gray-50 border-red-500'
                }`}>
                  <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>
                    <Lightbulb className="w-6 h-6" />
                    Additional Information
                  </h3>
                  <div className="space-y-6">
                    <div className="form-control">
                      <label className="label">
                        <span className={`label-text font-bold text-lg ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Constraints *
                        </span>
                      </label>
                      <textarea
                        className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y font-mono transition-all duration-200 focus:scale-105 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                        }`}
                        {...register("constraints")}
                        placeholder="Enter problem constraints"
                      />
                    </div>
                    <div className="form-control">
                      <div className="flex items-center justify-between mb-2">
                        <label className="label">
                          <span className={`label-text font-bold text-lg ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Hints (Optional)
                          </span>
                        </label>
                        {/* AI BUTTON FOR HINTS */}
                        <button
                          type="button"
                          onClick={generateHintsWithAI}
                          disabled={isGeneratingHints}
                          className={`btn btn-circle btn-sm shadow-lg transition-all duration-200 hover:scale-110 bg-white hover:bg-gray-100 border-2 border-yellow-500 hover:border-yellow-600`}
                          title="Generate hints with AI"
                        >
                          {isGeneratingHints ? (
                            <Loader className="w-4 h-4 animate-spin text-yellow-600" />
                          ) : (
                            <img src="/AI-sm.svg" alt="AI" className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <textarea
                        className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y transition-all duration-200 focus:scale-105 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        {...register("hints")}
                        placeholder="Enter hints for solving the problem"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className={`label-text font-bold text-lg ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Editorial (Optional)
                        </span>
                      </label>
                      <textarea
                        className={`textarea textarea-bordered min-h-32 w-full p-3 resize-y transition-all duration-200 focus:scale-105 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        {...register("editorial")}
                        placeholder="Enter problem editorial/solution explanation"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className={`w-full flex justify-end pt-8 border-t-2 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button 
                    type="submit" 
                    className={`btn btn-lg px-8 py-4 font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 ${
                      isDark 
                        ? 'bg-blue-600  hover:bg-red-600 text-white font-bold border-2 ' 
                        : 'bg-blue-600  hover:bg-red-600 text-white font-bold border-2 '
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <span className="loading loading-spinner loading-md"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        {isEditing ? 'Update Problem' : 'Create Problem'}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CreateProblemForm;
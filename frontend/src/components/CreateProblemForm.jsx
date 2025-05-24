import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import toast from "react-hot-toast";
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
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios";

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
        output: z.string().min(1, "Output is required"),
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
      replaceCompanies(sampleData.companies.map((company) => company)); // Add companies replacement

      // Reset the form with sample data
      reset(sampleData);
    };

    // Show loading spinner while loading problem data
    if (isEditing && isLoading && !isDataLoaded) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-2">Loading problem data...</span>
        </div>
      );
    }

    return (
      <div className='container mx-auto py-8 px-4 w-full'>
        <div className={`card ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-base-100'} shadow-xl`}>
          <div className="card-body p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b border-opacity-20">
              <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
                <FileText className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? 'text-blue-400' : 'text-primary'}`} />
                {isEditing ? 'Edit Problem' : 'Create Problem'}
              </h2>

              {/* Only show sample data buttons when creating new problem */}
              {!isEditing && (
                <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                  <div className="join">
                    <button
                      type="button"
                      className={`btn join-item ${
                        sampleType === "DP" ? `${isDark ? 'bg-blue-700 text-white' : 'btn-active'}` : 
                        `${isDark ? 'bg-gray-700 hover:bg-gray-600' : ''}`
                      }`}
                      onClick={() => setSampleType("DP")}
                    >
                      DP Problem
                    </button>
                    <button
                      type="button"
                      className={`btn join-item ${
                        sampleType === "string" ? `${isDark ? 'bg-blue-700 text-white' : 'btn-active'}` : 
                        `${isDark ? 'bg-gray-700 hover:bg-gray-600' : ''}`
                      }`}
                      onClick={() => setSampleType("string")}
                    >
                      String Problem
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`btn ${isDark ? 'bg-purple-700 hover:bg-purple-600 text-white' : 'btn-secondary'} gap-2`}
                    onClick={loadSampleData}
                  >
                    <Download className="w-4 h-4" />
                    Load Sample
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className={`label-text text-base md:text-lg font-semibold ${isDark ? 'text-gray-200' : ''}`}>
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full text-base md:text-lg ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                    {...register("title")}
                    placeholder="Enter problem title"
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.title.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className={`label-text text-base md:text-lg font-semibold ${isDark ? 'text-gray-200' : ''}`}>
                      Description
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                    {...register("description")}
                    placeholder="Enter problem description"
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className={`label-text text-base md:text-lg font-semibold ${isDark ? 'text-gray-200' : ''}`}>
                      Difficulty
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full text-base md:text-lg ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                    {...register("difficulty")}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.difficulty.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className={`card ${isDark ? 'bg-gray-700' : 'bg-base-200'} p-4 md:p-6 shadow-md`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg md:text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : ''}`}>
                    <BookOpen className={`w-5 h-5 ${isDark ? 'text-blue-300' : ''}`} />
                    Tags
                  </h3>
                  <button
                    type="button"
                    className={`btn ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'btn-primary'} btn-sm`}
                    onClick={() => appendTag("")}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className={`input input-bordered flex-1 ${
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : ''
                        }`}
                        {...register(`tags.${index}`)}
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-square btn-sm"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                      >
                        <Trash2 className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-error'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.tags && (
                  <div className="mt-2">
                    <span className="text-error text-sm">
                      {errors.tags.message}
                    </span>
                  </div>
                )}
              </div>

              {/* Add Companies Section */}
              <div className={`card ${isDark ? 'bg-gray-700' : 'bg-base-200'} p-4 md:p-6 shadow-md`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg md:text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : ''}`}>
                    <Building2 className={`w-5 h-5 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
                    Companies
                  </h3>
                  <button
                    type="button"
                    className={`btn ${isDark ? 'bg-green-600 hover:bg-green-500 text-white' : 'btn-success'} btn-sm`}
                    onClick={() => appendCompany("")}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Company
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className={`input input-bordered flex-1 ${
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : ''
                        }`}
                        {...register(`companies.${index}`)}
                        placeholder="Enter company name"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-square btn-sm"
                        onClick={() => removeCompany(index)}
                        disabled={companyFields.length === 1}
                      >
                        <Trash2 className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-error'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Add companies that have asked this problem in their interviews.
                </div>
              </div>

              {/* Test Cases */}
              <div className={`card ${isDark ? 'bg-gray-700' : 'bg-base-200'} p-4 md:p-6 shadow-md`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg md:text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : ''}`}>
                    <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-blue-300' : ''}`} />
                    Test Cases
                  </h3>
                  <button
                    type="button"
                    className={`btn ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'btn-primary'} btn-sm`}
                    onClick={() => appendTestCase({ input: "", output: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                  </button>
                </div>
                <div className="space-y-6">
                  {testCaseFields.map((field, index) => (
                    <div key={field.id} className={`card ${isDark ? 'bg-gray-800' : 'bg-base-100'} shadow-md`}>
                      <div className="card-body p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className={`text-base md:text-lg font-semibold ${isDark ? 'text-gray-200' : ''}`}>
                            Test Case #{index + 1}
                          </h4>
                          <button
                            type="button"
                            className={`btn btn-ghost btn-sm ${isDark ? 'text-red-400' : 'text-error'}`}
                            onClick={() => removeTestCase(index)}
                            disabled={testCaseFields.length === 1}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                                Input
                              </span>
                            </label>
                            <textarea
                              className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                              }`}
                              {...register(`testCases.${index}.input`)}
                              placeholder="Enter test case input"
                            />
                            {errors.testCases?.[index]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.testCases[index].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                                Expected Output
                              </span>
                            </label>
                            <textarea
                              className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                              }`}
                              {...register(`testCases.${index}.output`)}
                              placeholder="Enter expected output"
                            />
                            {errors.testCases?.[index]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.testCases[index].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.testCases && !Array.isArray(errors.testCases) && (
                  <div className="mt-2">
                    <span className="text-error text-sm">
                      {errors.testCases.message}
                    </span>
                  </div>
                )}
              </div>

              {/* Code Editor Sections */}
              <div className="space-y-8">
                {["JAVASCRIPT", "PYTHON", "JAVA","CPP"].map((language) => (
                  <div
                    key={language}
                    className={`card ${isDark ? 'bg-gray-700' : 'bg-base-200'} p-4 md:p-6 shadow-md`}
                  >
                    <h3 className={`text-lg md:text-xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-gray-100' : ''}`}>
                      <Code2 className={`w-5 h-5 ${isDark ? 'text-blue-300' : ''}`} />
                      {language}
                    </h3>

                    <div className="space-y-6">
                      {/* Starter Code */}
                      <div className={`card ${isDark ? 'bg-gray-800' : 'bg-base-100'} shadow-md`}>
                        <div className="card-body p-4 md:p-6">
                          <h4 className={`font-semibold text-base md:text-lg mb-4 ${isDark ? 'text-gray-200' : ''}`}>
                            Starter Code Template
                          </h4>
                          <div className="border rounded-md overflow-hidden">
                            <Controller
                              name={`codeSnippets.${language}`}
                              control={control}
                              render={({ field }) => (
                                <Editor
                                  height="300px"
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
                                  }}
                                />
                              )}
                            />
                          </div>
                          {errors.codeSnippets?.[language] && (
                            <div className="mt-2">
                              <span className="text-error text-sm">
                                {errors.codeSnippets[language].message}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reference Solution */}
                      <div className={`card ${isDark ? 'bg-gray-800' : 'bg-base-100'} shadow-md`}>
                        <div className="card-body p-4 md:p-6">
                          <h4 className={`font-semibold text-base md:text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-gray-200' : ''}`}>
                            <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-success'}`} />
                            Reference Solution
                          </h4>
                          <div className="border rounded-md overflow-hidden">
                            <Controller
                              name={`referenceSolutions.${language}`}
                              control={control}
                              render={({ field }) => (
                                <Editor
                                  height="300px"
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
                                  }}
                                />
                              )}
                            />
                          </div>
                          {errors.referenceSolutions?.[language] && (
                            <div className="mt-2">
                              <span className="text-error text-sm">
                                {errors.referenceSolutions[language].message}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Examples */}
                      <div className={`card ${isDark ? 'bg-gray-800' : 'bg-base-100'} shadow-md`}>
                        <div className="card-body p-4 md:p-6">
                          <h4 className={`font-semibold text-base md:text-lg mb-4 ${isDark ? 'text-gray-200' : ''}`}>
                            Example
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="form-control">
                              <label className="label">
                                <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                                  Input
                                </span>
                              </label>
                              <textarea
                                className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y ${
                                  isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                                }`}
                                {...register(`examples.${language}.input`)}
                                placeholder="Example input"
                              />
                              {errors.examples?.[language]?.input && (
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {errors.examples[language].input.message}
                                  </span>
                                </label>
                              )}
                            </div>
                            <div className="form-control">
                              <label className="label">
                                <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                                  Output
                                </span>
                              </label>
                              <textarea
                                className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y ${
                                  isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                                }`}
                                {...register(`examples.${language}.output`)}
                                placeholder="Example output"
                              />
                              {errors.examples?.[language]?.output && (
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {errors.examples[language].output.message}
                                  </span>
                                </label>
                              )}
                            </div>
                            <div className="form-control md:col-span-2">
                              <label className="label">
                                <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                                  Explanation
                                </span>
                              </label>
                              <textarea
                                className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${
                                  isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
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
              <div className={`card ${isDark ? 'bg-gray-700' : 'bg-base-200'} p-4 md:p-6 shadow-md`}>
                <h3 className={`text-lg md:text-xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-gray-100' : ''}`}>
                  <Lightbulb className={`w-5 h-5 ${isDark ? 'text-yellow-300' : 'text-warning'}`} />
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>Constraints</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                      }`}
                      {...register("constraints")}
                      placeholder="Enter problem constraints"
                    />
                    {errors.constraints && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.constraints.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                        Hints (Optional)
                      </span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                      }`}
                      {...register("hints")}
                      placeholder="Enter hints for solving the problem"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className={`label-text font-medium ${isDark ? 'text-gray-300' : ''}`}>
                        Editorial (Optional)
                      </span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered min-h-32 w-full p-3 resize-y ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : ''
                      }`}
                      {...register("editorial")}
                      placeholder="Enter problem editorial/solution explanation"
                    />
                  </div>
                </div>
              </div>

              <div className={`card-actions justify-end pt-4 border-t border-gray-200 dark:border-gray-700`}>
                <button 
                  type="submit" 
                  className="btn bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 btn-lg gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {isEditing ? 'Update Problem' : 'Create Problem'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default CreateProblemForm;
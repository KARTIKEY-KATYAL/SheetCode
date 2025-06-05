import { db } from '../src/libs/db.js';

const sampleProblems = [
  // Array Problems
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "EASY",
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Facebook"],
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    hints: "1. Use a hash map to store complements\n2. Check if target - current number exists in the map",
    editorial: "Use a hash map to store the complement of each number as we iterate through the array. For each number, check if its complement exists in the map.",
    testcases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]" },
      { input: "[3,2,4]\n6", output: "[1,2]" },
      { input: "[3,3]\n6", output: "[0,1]" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" }
    },
    codeSnippets: {
      JAVASCRIPT: "function twoSum(nums, target) {\n    // Your code here\n    return [];\n}",
      PYTHON: "def two_sum(nums, target):\n    # Your code here\n    return []",
      JAVA: "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[]{};\n}",
      CPP: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}"
      }
    ]
  },

  // String Problems
  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
    difficulty: "EASY",
    tags: ["String", "Hash Table", "Sorting"],
    companies: ["Facebook", "Amazon", "Microsoft"],
    constraints: "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
    hints: "1. Check if both strings have the same length\n2. Count frequency of each character",
    editorial: "Count the frequency of each character in both strings and compare the counts.",
    testcases: [
      { input: "anagram\nnagaram", output: "true" },
      { input: "rat\ncar", output: "false" },
      { input: "a\nab", output: "false" }
    ],
    examples: {
      JAVASCRIPT: { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Both strings contain the same characters with same frequencies" }
    },
    codeSnippets: {
      JAVASCRIPT: "function isAnagram(s, t) {\n    // Your code here\n    return false;\n}",
      PYTHON: "def is_anagram(s, t):\n    # Your code here\n    return False",
      JAVA: "public boolean isAnagram(String s, String t) {\n    // Your code here\n    return false;\n}",
      CPP: "bool isAnagram(string s, string t) {\n    // Your code here\n    return false;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = {};\n    for (let char of s) {\n        count[char] = (count[char] || 0) + 1;\n    }\n    for (let char of t) {\n        if (!count[char]) return false;\n        count[char]--;\n    }\n    return true;\n}"
      }
    ]
  },

  // Linked List Problems
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "EASY",
    tags: ["Linked List", "Recursion"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
    hints: "1. Use three pointers: previous, current, and next\n2. Iterate through the list and reverse the links",
    editorial: "Use iterative approach with three pointers to reverse the direction of each link.",
    testcases: [
      { input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "[1,2]", output: "[2,1]" },
      { input: "[]", output: "[]" }
    ],
    examples: {
      JAVASCRIPT: { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "The linked list is reversed" }
    },
    codeSnippets: {
      JAVASCRIPT: "function reverseList(head) {\n    // Your code here\n    return null;\n}",
      PYTHON: "def reverse_list(head):\n    # Your code here\n    return None",
      JAVA: "public ListNode reverseList(ListNode head) {\n    // Your code here\n    return null;\n}",
      CPP: "ListNode* reverseList(ListNode* head) {\n    // Your code here\n    return nullptr;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function reverseList(head) {\n    let prev = null;\n    let current = head;\n    while (current) {\n        let next = current.next;\n        current.next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}"
      }
    ]
  },

  // Binary Tree Problems
  {
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    difficulty: "EASY",
    tags: ["Tree", "DFS", "BFS", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100",
    hints: "1. Use recursion to traverse the tree\n2. Return 1 + max depth of left and right subtrees",
    editorial: "Use DFS recursion. The depth of a tree is 1 + maximum depth of its subtrees.",
    testcases: [
      { input: "[3,9,20,null,null,15,7]", output: "3" },
      { input: "[1,null,2]", output: "2" },
      { input: "[]", output: "0" }
    ],
    examples: {
      JAVASCRIPT: { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "The maximum depth is 3" }
    },
    codeSnippets: {
      JAVASCRIPT: "function maxDepth(root) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def max_depth(root):\n    # Your code here\n    return 0",
      JAVA: "public int maxDepth(TreeNode root) {\n    // Your code here\n    return 0;\n}",
      CPP: "int maxDepth(TreeNode* root) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}"
      }
    ]
  },

  // Dynamic Programming
  {
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
    difficulty: "EASY",
    tags: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
    companies: ["Amazon", "Apple", "Microsoft"],
    constraints: "0 <= n <= 30",
    hints: "1. Use dynamic programming to avoid recalculation\n2. F(n) = F(n-1) + F(n-2)",
    editorial: "Use bottom-up dynamic programming to calculate Fibonacci numbers efficiently.",
    testcases: [
      { input: "2", output: "1" },
      { input: "3", output: "2" },
      { input: "4", output: "3" }
    ],
    examples: {
      JAVASCRIPT: { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1" }
    },
    codeSnippets: {
      JAVASCRIPT: "function fib(n) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def fib(n):\n    # Your code here\n    return 0",
      JAVA: "public int fib(int n) {\n    // Your code here\n    return 0;\n}",
      CPP: "int fib(int n) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function fib(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}"
      }
    ]
  },

  // Binary Search
  {
    title: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    difficulty: "EASY",
    tags: ["Array", "Binary Search"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.",
    hints: "1. Use two pointers: left and right\n2. Compare middle element with target",
    editorial: "Use binary search algorithm to find the target in O(log n) time.",
    testcases: [
      { input: "[-1,0,3,5,9,12]\n9", output: "4" },
      { input: "[-1,0,3,5,9,12]\n2", output: "-1" },
      { input: "[5]\n5", output: "0" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" }
    },
    codeSnippets: {
      JAVASCRIPT: "function search(nums, target) {\n    // Your code here\n    return -1;\n}",
      PYTHON: "def search(nums, target):\n    # Your code here\n    return -1",
      JAVA: "public int search(int[] nums, int target) {\n    // Your code here\n    return -1;\n}",
      CPP: "int search(vector<int>& nums, int target) {\n    // Your code here\n    return -1;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}"
      }
    ]
  },

  // Stack Problems
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets and in the correct order.",
    difficulty: "EASY",
    tags: ["String", "Stack"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    hints: "1. Use a stack to keep track of opening brackets\n2. Match closing brackets with the most recent opening bracket",
    editorial: "Use a stack to store opening brackets and pop when finding matching closing brackets.",
    testcases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" }
    ],
    examples: {
      JAVASCRIPT: { input: 's = "()"', output: "true", explanation: "The parentheses are properly matched" }
    },
    codeSnippets: {
      JAVASCRIPT: "function isValid(s) {\n    // Your code here\n    return false;\n}",
      PYTHON: "def is_valid(s):\n    # Your code here\n    return False",
      JAVA: "public boolean isValid(String s) {\n    // Your code here\n    return false;\n}",
      CPP: "bool isValid(string s) {\n    // Your code here\n    return false;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (char in map) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}"
      }
    ]
  },

  // Graph Problems
  {
    title: "Number of Islands",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    difficulty: "MEDIUM",
    tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
    hints: "1. Use DFS or BFS to explore connected components\n2. Mark visited cells to avoid counting them again",
    editorial: "Use DFS to traverse each island and mark all connected land cells as visited.",
    testcases: [
      { input: "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", output: "1" },
      { input: "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3" }
    ],
    examples: {
      JAVASCRIPT: { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "There is 1 island" }
    },
    codeSnippets: {
      JAVASCRIPT: "function numIslands(grid) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def num_islands(grid):\n    # Your code here\n    return 0",
      JAVA: "public int numIslands(char[][] grid) {\n    // Your code here\n    return 0;\n}",
      CPP: "int numIslands(vector<vector<char>>& grid) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function numIslands(grid) {\n    if (!grid || grid.length === 0) return 0;\n    let count = 0;\n    \n    function dfs(i, j) {\n        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') return;\n        grid[i][j] = '0';\n        dfs(i + 1, j);\n        dfs(i - 1, j);\n        dfs(i, j + 1);\n        dfs(i, j - 1);\n    }\n    \n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n            if (grid[i][j] === '1') {\n                count++;\n                dfs(i, j);\n            }\n        }\n    }\n    return count;\n}"
      }
    ]
  },

  // Two Pointers
  {
    title: "Container With Most Water",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.",
    difficulty: "MEDIUM",
    tags: ["Array", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    hints: "1. Use two pointers from both ends\n2. Move the pointer with smaller height",
    editorial: "Use two pointers approach. Always move the pointer with the smaller height to potentially find a larger area.",
    testcases: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "[1,1]", output: "1" },
      { input: "[4,3,2,1,4]", output: "16" }
    ],
    examples: {
      JAVASCRIPT: { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between height[1] and height[8]" }
    },
    codeSnippets: {
      JAVASCRIPT: "function maxArea(height) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def max_area(height):\n    # Your code here\n    return 0",
      JAVA: "public int maxArea(int[] height) {\n    // Your code here\n    return 0;\n}",
      CPP: "int maxArea(vector<int>& height) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function maxArea(height) {\n    let left = 0, right = height.length - 1;\n    let maxWater = 0;\n    \n    while (left < right) {\n        let water = Math.min(height[left], height[right]) * (right - left);\n        maxWater = Math.max(maxWater, water);\n        \n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return maxWater;\n}"
      }
    ]
  },

  // Sliding Window
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "MEDIUM",
    tags: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    hints: "1. Use sliding window technique\n2. Keep track of character positions with a hash map",
    editorial: "Use sliding window with hash map to track character positions and expand/contract window as needed.",
    testcases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" }
    ],
    examples: {
      JAVASCRIPT: { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3' }
    },
    codeSnippets: {
      JAVASCRIPT: "function lengthOfLongestSubstring(s) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def length_of_longest_substring(s):\n    # Your code here\n    return 0",
      JAVA: "public int lengthOfLongestSubstring(String s) {\n    // Your code here\n    return 0;\n}",
      CPP: "int lengthOfLongestSubstring(string s) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function lengthOfLongestSubstring(s) {\n    let left = 0, maxLen = 0;\n    const charMap = new Map();\n    \n    for (let right = 0; right < s.length; right++) {\n        if (charMap.has(s[right])) {\n            left = Math.max(left, charMap.get(s[right]) + 1);\n        }\n        charMap.set(s[right], right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    \n    return maxLen;\n}"
      }
    ]
  }

  // Continue with more problems...
];

// Add more problems to reach 30
const additionalProblems = [
  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    difficulty: "EASY",
    tags: ["Linked List", "Recursion"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.",
    hints: "1. Compare the values of the current nodes\n2. Choose the smaller one and advance that pointer",
    editorial: "Use a dummy node to simplify the logic. Compare values and link the smaller node.",
    testcases: [
      { input: "[1,2,4]\n[1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", output: "[]" },
      { input: "[]\n[0]", output: "[0]" }
    ],
    examples: {
      JAVASCRIPT: { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "The merged list is sorted" }
    },
    codeSnippets: {
      JAVASCRIPT: "function mergeTwoLists(list1, list2) {\n    // Your code here\n    return null;\n}",
      PYTHON: "def merge_two_lists(list1, list2):\n    # Your code here\n    return None",
      JAVA: "public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Your code here\n    return null;\n}",
      CPP: "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n    return nullptr;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function mergeTwoLists(list1, list2) {\n    const dummy = new ListNode(0);\n    let current = dummy;\n    \n    while (list1 && list2) {\n        if (list1.val <= list2.val) {\n            current.next = list1;\n            list1 = list1.next;\n        } else {\n            current.next = list2;\n            list2 = list2.next;\n        }\n        current = current.next;\n    }\n    \n    current.next = list1 || list2;\n    return dummy.next;\n}"
      }
    ]
  },

  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    difficulty: "EASY",
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    hints: "1. Keep track of the minimum price seen so far\n2. Calculate profit at each day",
    editorial: "Track the minimum price and maximum profit as you iterate through the array.",
    testcases: [
      { input: "[7,1,5,3,6,4]", output: "5" },
      { input: "[7,6,4,3,1]", output: "0" },
      { input: "[1,2,3,4,5]", output: "4" }
    ],
    examples: {
      JAVASCRIPT: { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5" }
    },
    codeSnippets: {
      JAVASCRIPT: "function maxProfit(prices) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def max_profit(prices):\n    # Your code here\n    return 0",
      JAVA: "public int maxProfit(int[] prices) {\n    // Your code here\n    return 0;\n}",
      CPP: "int maxProfit(vector<int>& prices) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    \n    for (let price of prices) {\n        if (price < minPrice) {\n            minPrice = price;\n        } else if (price - minPrice > maxProfit) {\n            maxProfit = price - minPrice;\n        }\n    }\n    \n    return maxProfit;\n}"
      }
    ]
  },

  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "EASY",
    tags: ["Array", "Hash Table", "Sorting"],
    companies: ["Amazon", "Apple", "Microsoft"],
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    hints: "1. Use a hash set to track seen elements\n2. Return true if element already exists in set",
    editorial: "Use a hash set to store elements as you iterate. Return true if you encounter a duplicate.",
    testcases: [
      { input: "[1,2,3,1]", output: "true" },
      { input: "[1,2,3,4]", output: "false" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", output: "true" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [1,2,3,1]", output: "true", explanation: "The element 1 appears at indices 0 and 3" }
    },
    codeSnippets: {
      JAVASCRIPT: "function containsDuplicate(nums) {\n    // Your code here\n    return false;\n}",
      PYTHON: "def contains_duplicate(nums):\n    # Your code here\n    return False",
      JAVA: "public boolean containsDuplicate(int[] nums) {\n    // Your code here\n    return false;\n}",
      CPP: "bool containsDuplicate(vector<int>& nums) {\n    // Your code here\n    return false;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (let num of nums) {\n        if (seen.has(num)) {\n            return true;\n        }\n        seen.add(num);\n    }\n    return false;\n}"
      }
    ]
  },

  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    difficulty: "EASY",
    tags: ["Linked List", "Recursion"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.",
    hints: "1. Compare the values of the current nodes\n2. Choose the smaller one and advance that pointer",
    editorial: "Use a dummy node to simplify the logic. Compare values and link the smaller node.",
    testcases: [
      { input: "[1,2,4]\n[1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", output: "[]" },
      { input: "[]\n[0]", output: "[0]" }
    ],
    examples: {
      JAVASCRIPT: { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "The merged list is sorted" }
    },
    codeSnippets: {
      JAVASCRIPT: "function mergeTwoLists(list1, list2) {\n    // Your code here\n    return null;\n}",
      PYTHON: "def merge_two_lists(list1, list2):\n    # Your code here\n    return None",
      JAVA: "public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Your code here\n    return null;\n}",
      CPP: "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n    return nullptr;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function mergeTwoLists(list1, list2) {\n    const dummy = new ListNode(0);\n    let current = dummy;\n    \n    while (list1 && list2) {\n        if (list1.val <= list2.val) {\n            current.next = list1;\n            list1 = list1.next;\n        } else {\n            current.next = list2;\n            list2 = list2.next;\n        }\n        current = current.next;\n    }\n    \n    current.next = list1 || list2;\n    return dummy.next;\n}"
      }
    ]
  }
];

const moreProblems = [
  // Math Problems
  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
    difficulty: "EASY",
    tags: ["Math"],
    companies: ["Amazon", "Apple", "Microsoft"],
    constraints: "-2^31 <= x <= 2^31 - 1",
    hints: "1. Reverse the number and compare with original\n2. Be careful with negative numbers and overflow",
    editorial: "Reverse half of the number to avoid overflow, or convert to string and use two pointers.",
    testcases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" }
    ],
    examples: {
      JAVASCRIPT: { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left" }
    },
    codeSnippets: {
      JAVASCRIPT: "function isPalindrome(x) {\n    // Your code here\n    return false;\n}",
      PYTHON: "def is_palindrome(x):\n    # Your code here\n    return False",
      JAVA: "public boolean isPalindrome(int x) {\n    // Your code here\n    return false;\n}",
      CPP: "bool isPalindrome(int x) {\n    // Your code here\n    return false;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function isPalindrome(x) {\n    if (x < 0) return false;\n    let original = x, reversed = 0;\n    while (x > 0) {\n        reversed = reversed * 10 + x % 10;\n        x = Math.floor(x / 10);\n    }\n    return original === reversed;\n}"
      }
    ]
  },

  {
    title: "Roman to Integer",
    description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
    difficulty: "EASY",
    tags: ["Hash Table", "Math", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "1 <= s.length <= 15\ns contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').\nIt is guaranteed that s is a valid roman numeral in the range [1, 3999].",
    hints: "1. Create a mapping of roman symbols to values\n2. If current symbol is smaller than next, subtract it",
    editorial: "Use a hash map for symbol values. Iterate from right to left, subtracting when current value is less than previous.",
    testcases: [
      { input: "III", output: "3" },
      { input: "LVIII", output: "58" },
      { input: "MCMXC", output: "1990" }
    ],
    examples: {
      JAVASCRIPT: { input: 's = "III"', output: "3", explanation: "III = 3" }
    },
    codeSnippets: {
      JAVASCRIPT: "function romanToInt(s) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def roman_to_int(s):\n    # Your code here\n    return 0",
      JAVA: "public int romanToInt(String s) {\n    // Your code here\n    return 0;\n}",
      CPP: "int romanToInt(string s) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function romanToInt(s) {\n    const map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000};\n    let result = 0;\n    for (let i = 0; i < s.length; i++) {\n        if (i + 1 < s.length && map[s[i]] < map[s[i + 1]]) {\n            result -= map[s[i]];\n        } else {\n            result += map[s[i]];\n        }\n    }\n    return result;\n}"
      }
    ]
  },

  // String Manipulation
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    difficulty: "EASY",
    tags: ["String"],
    companies: ["Amazon", "Microsoft", "Google"],
    constraints: "1 <= strs.length <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lower-case English letters.",
    hints: "1. Compare characters vertically across all strings\n2. Stop when you find a mismatch",
    editorial: "Compare character by character across all strings until a mismatch is found.",
    testcases: [
      { input: '["flower","flow","flight"]', output: '"fl"' },
      { input: '["dog","racecar","car"]', output: '""' },
      { input: '["interstellar","inter","interchange"]', output: '"inter"' }
    ],
    examples: {
      JAVASCRIPT: { input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: 'The longest common prefix is "fl"' }
    },
    codeSnippets: {
      JAVASCRIPT: "function longestCommonPrefix(strs) {\n    // Your code here\n    return '';\n}",
      PYTHON: "def longest_common_prefix(strs):\n    # Your code here\n    return ''",
      JAVA: "public String longestCommonPrefix(String[] strs) {\n    // Your code here\n    return '';\n}",
      CPP: "string longestCommonPrefix(vector<string>& strs) {\n    // Your code here\n    return '';\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function longestCommonPrefix(strs) {\n    if (!strs.length) return '';\n    let prefix = strs[0];\n    for (let i = 1; i < strs.length; i++) {\n        while (strs[i].indexOf(prefix) !== 0) {\n            prefix = prefix.substring(0, prefix.length - 1);\n            if (!prefix) return '';\n        }\n    }\n    return prefix;\n}"
      }
    ]
  },

  // Array Manipulation
  {
    title: "Remove Duplicates from Sorted Array",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    difficulty: "EASY",
    tags: ["Array", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "1 <= nums.length <= 3 * 10^4\n-100 <= nums[i] <= 100\nnums is sorted in non-decreasing order.",
    hints: "1. Use two pointers technique\n2. Keep track of unique elements position",
    editorial: "Use two pointers: one for reading and one for writing unique elements.",
    testcases: [
      { input: "[1,1,2]", output: "2" },
      { input: "[0,0,1,1,1,2,2,3,3,4]", output: "5" },
      { input: "[1,2,3]", output: "3" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [1,1,2]", output: "2", explanation: "Function should return length = 2, with first two elements being 1 and 2" }
    },
    codeSnippets: {
      JAVASCRIPT: "function removeDuplicates(nums) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def remove_duplicates(nums):\n    # Your code here\n    return 0",
      JAVA: "public int removeDuplicates(int[] nums) {\n    // Your code here\n    return 0;\n}",
      CPP: "int removeDuplicates(vector<int>& nums) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function removeDuplicates(nums) {\n    if (nums.length === 0) return 0;\n    let i = 0;\n    for (let j = 1; j < nums.length; j++) {\n        if (nums[j] !== nums[i]) {\n            i++;\n            nums[i] = nums[j];\n        }\n    }\n    return i + 1;\n}"
      }
    ]
  },

  // Searching
  {
    title: "Find First and Last Position of Element in Sorted Array",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1].",
    difficulty: "MEDIUM",
    tags: ["Array", "Binary Search"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9\nnums is a non-decreasing array.\n-10^9 <= target <= 10^9",
    hints: "1. Use binary search to find leftmost and rightmost positions\n2. Modify binary search to find first and last occurrence",
    editorial: "Use binary search twice: once to find the leftmost position and once for the rightmost position.",
    testcases: [
      { input: "[5,7,7,8,8,10]\n8", output: "[3,4]" },
      { input: "[5,7,7,8,8,10]\n6", output: "[-1,-1]" },
      { input: "[]\n0", output: "[-1,-1]" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]", explanation: "Target 8 is found at indices 3 and 4" }
    },
    codeSnippets: {
      JAVASCRIPT: "function searchRange(nums, target) {\n    // Your code here\n    return [-1, -1];\n}",
      PYTHON: "def search_range(nums, target):\n    # Your code here\n    return [-1, -1]",
      JAVA: "public int[] searchRange(int[] nums, int target) {\n    // Your code here\n    return new int[]{-1, -1};\n}",
      CPP: "vector<int> searchRange(vector<int>& nums, int target) {\n    // Your code here\n    return {-1, -1};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function searchRange(nums, target) {\n    function findFirst(nums, target) {\n        let left = 0, right = nums.length - 1;\n        while (left <= right) {\n            let mid = Math.floor((left + right) / 2);\n            if (nums[mid] >= target) right = mid - 1;\n            else left = mid + 1;\n        }\n        return left < nums.length && nums[left] === target ? left : -1;\n    }\n    \n    function findLast(nums, target) {\n        let left = 0, right = nums.length - 1;\n        while (left <= right) {\n            let mid = Math.floor((left + right) / 2);\n            if (nums[mid] <= target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return right >= 0 && nums[right] === target ? right : -1;\n    }\n    \n    return [findFirst(nums, target), findLast(nums, target)];\n}"
      }
    ]
  },

  // Backtracking
  {
    title: "Generate Parentheses",
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    difficulty: "MEDIUM",
    tags: ["String", "Dynamic Programming", "Backtracking"],
    companies: ["Amazon", "Facebook", "Google"],
    constraints: "1 <= n <= 8",
    hints: "1. Use backtracking to generate all combinations\n2. Keep track of open and close parentheses count",
    editorial: "Use backtracking. Add '(' when we can, add ')' when it doesn't exceed '(' count.",
    testcases: [
      { input: "3", output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: "1", output: '["()"]' },
      { input: "2", output: '["(())","()()"]' }
    ],
    examples: {
      JAVASCRIPT: { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "All valid combinations of 3 pairs of parentheses" }
    },
    codeSnippets: {
      JAVASCRIPT: "function generateParenthesis(n) {\n    // Your code here\n    return [];\n}",
      PYTHON: "def generate_parenthesis(n):\n    # Your code here\n    return []",
      JAVA: "public List<String> generateParenthesis(int n) {\n    // Your code here\n    return new ArrayList<>();\n}",
      CPP: "vector<string> generateParenthesis(int n) {\n    // Your code here\n    return {};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function generateParenthesis(n) {\n    const result = [];\n    \n    function backtrack(current, open, close) {\n        if (current.length === 2 * n) {\n            result.push(current);\n            return;\n        }\n        \n        if (open < n) {\n            backtrack(current + '(', open + 1, close);\n        }\n        \n        if (close < open) {\n            backtrack(current + ')', open, close + 1);\n        }\n    }\n    \n    backtrack('', 0, 0);\n    return result;\n}"
      }
    ]
  },

  // Sorting
  {
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    difficulty: "MEDIUM",
    tags: ["Array", "Sorting"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^4",
    hints: "1. Sort intervals by start time\n2. Merge overlapping intervals",
    editorial: "Sort intervals by start time, then iterate and merge overlapping intervals.",
    testcases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", output: "[[1,5]]" },
      { input: "[[1,4],[0,4]]", output: "[[0,4]]" }
    ],
    examples: {
      JAVASCRIPT: { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap, so they are merged into [1,6]" }
    },
    codeSnippets: {
      JAVASCRIPT: "function merge(intervals) {\n    // Your code here\n    return [];\n}",
      PYTHON: "def merge(intervals):\n    # Your code here\n    return []",
      JAVA: "public int[][] merge(int[][] intervals) {\n    // Your code here\n    return new int[][]{};\n}",
      CPP: "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Your code here\n    return {};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function merge(intervals) {\n    if (intervals.length <= 1) return intervals;\n    \n    intervals.sort((a, b) => a[0] - b[0]);\n    const result = [intervals[0]];\n    \n    for (let i = 1; i < intervals.length; i++) {\n        const current = intervals[i];\n        const last = result[result.length - 1];\n        \n        if (current[0] <= last[1]) {\n            last[1] = Math.max(last[1], current[1]);\n        } else {\n            result.push(current);\n        }\n    }\n    \n    return result;\n}"
      }
    ]
  },

  // Matrix
  {
    title: "Rotate Image",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.",
    difficulty: "MEDIUM",
    tags: ["Array", "Math", "Matrix"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "n == matrix.length == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000",
    hints: "1. Transpose the matrix first\n2. Then reverse each row",
    editorial: "Transpose the matrix (swap rows and columns), then reverse each row.",
    testcases: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
    ],
    examples: {
      JAVASCRIPT: { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Rotate the matrix 90 degrees clockwise" }
    },
    codeSnippets: {
      JAVASCRIPT: "function rotate(matrix) {\n    // Your code here\n}",
      PYTHON: "def rotate(matrix):\n    # Your code here\n    pass",
      JAVA: "public void rotate(int[][] matrix) {\n    // Your code here\n}",
      CPP: "void rotate(vector<vector<int>>& matrix) {\n    // Your code here\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function rotate(matrix) {\n    const n = matrix.length;\n    \n    // Transpose\n    for (let i = 0; i < n; i++) {\n        for (let j = i; j < n; j++) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n    }\n    \n    // Reverse each row\n    for (let i = 0; i < n; i++) {\n        matrix[i].reverse();\n    }\n}"
      }
    ]
  },

  // Greedy
  {
    title: "Jump Game",
    description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    difficulty: "MEDIUM",
    tags: ["Array", "Dynamic Programming", "Greedy"],
    companies: ["Amazon", "Microsoft", "Google"],
    constraints: "1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5",
    hints: "1. Keep track of the farthest position you can reach\n2. If current position exceeds farthest reach, return false",
    editorial: "Use greedy approach. Track the farthest position reachable and check if we can reach the end.",
    testcases: [
      { input: "[2,3,1,1,4]", output: "true" },
      { input: "[3,2,1,0,4]", output: "false" },
      { input: "[0]", output: "true" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index" }
    },
    codeSnippets: {
      JAVASCRIPT: "function canJump(nums) {\n    // Your code here\n    return false;\n}",
      PYTHON: "def can_jump(nums):\n    # Your code here\n    return False",
      JAVA: "public boolean canJump(int[] nums) {\n    // Your code here\n    return false;\n}",
      CPP: "bool canJump(vector<int>& nums) {\n    // Your code here\n    return false;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function canJump(nums) {\n    let maxReach = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (i > maxReach) return false;\n        maxReach = Math.max(maxReach, i + nums[i]);\n        if (maxReach >= nums.length - 1) return true;\n    }\n    return true;\n}"
      }
    ]
  },

  // Bit Manipulation
  {
    title: "Single Number",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    difficulty: "EASY",
    tags: ["Array", "Bit Manipulation"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element in the array appears twice except for one element which appears only once.",
    hints: "1. Use XOR operation\n2. XOR of two same numbers is 0",
    editorial: "Use XOR operation. XOR all numbers together - duplicates will cancel out, leaving only the single number.",
    testcases: [
      { input: "[2,2,1]", output: "1" },
      { input: "[4,1,2,1,2]", output: "4" },
      { input: "[1]", output: "1" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [2,2,1]", output: "1", explanation: "Only 1 appears once" }
    },
    codeSnippets: {
      JAVASCRIPT: "function singleNumber(nums) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def single_number(nums):\n    # Your code here\n    return 0",
      JAVA: "public int singleNumber(int[] nums) {\n    // Your code here\n    return 0;\n}",
      CPP: "int singleNumber(vector<int>& nums) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function singleNumber(nums) {\n    let result = 0;\n    for (let num of nums) {\n        result ^= num;\n    }\n    return result;\n}"
      }
    ]
  },

  // Design
  {
    title: "Implement Queue using Stacks",
    description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).",
    difficulty: "EASY",
    tags: ["Stack", "Design", "Queue"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    constraints: "1 <= x <= 9\nAt most 100 calls will be made to push, pop, peek, and empty.\nAll the calls to pop and peek are valid.",
    hints: "1. Use two stacks - one for input, one for output\n2. Transfer elements when output stack is empty",
    editorial: "Use two stacks. Push to input stack, pop from output stack. Transfer when output is empty.",
    testcases: [
      { input: '["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', output: "[null,null,null,1,1,false]" }
    ],
    examples: {
      JAVASCRIPT: { input: "queue.push(1); queue.push(2); queue.peek(); // returns 1", output: "1", explanation: "Queue follows FIFO principle" }
    },
    codeSnippets: {
      JAVASCRIPT: "class MyQueue {\n    constructor() {\n        // Your code here\n    }\n    \n    push(x) {\n        // Your code here\n    }\n    \n    pop() {\n        // Your code here\n    }\n    \n    peek() {\n        // Your code here\n    }\n    \n    empty() {\n        // Your code here\n    }\n}",
      PYTHON: "class MyQueue:\n    def __init__(self):\n        # Your code here\n        pass\n    \n    def push(self, x):\n        # Your code here\n        pass\n    \n    def pop(self):\n        # Your code here\n        pass\n    \n    def peek(self):\n        # Your code here\n        pass\n    \n    def empty(self):\n        # Your code here\n        pass",
      JAVA: "class MyQueue {\n    public MyQueue() {\n        // Your code here\n    }\n    \n    public void push(int x) {\n        // Your code here\n    }\n    \n    public int pop() {\n        // Your code here\n        return 0;\n    }\n    \n    public int peek() {\n        // Your code here\n        return 0;\n    }\n    \n    public boolean empty() {\n        // Your code here\n        return true;\n    }\n}",
      CPP: "class MyQueue {\npublic:\n    MyQueue() {\n        // Your code here\n    }\n    \n    void push(int x) {\n        // Your code here\n    }\n    \n    int pop() {\n        // Your code here\n        return 0;\n    }\n    \n    int peek() {\n        // Your code here\n        return 0;\n    }\n    \n    bool empty() {\n        // Your code here\n        return true;\n    }\n};"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "class MyQueue {\n    constructor() {\n        this.input = [];\n        this.output = [];\n    }\n    \n    push(x) {\n        this.input.push(x);\n    }\n    \n    pop() {\n        this.peek();\n        return this.output.pop();\n    }\n    \n    peek() {\n        if (this.output.length === 0) {\n            while (this.input.length > 0) {\n                this.output.push(this.input.pop());\n            }\n        }\n        return this.output[this.output.length - 1];\n    }\n    \n    empty() {\n        return this.input.length === 0 && this.output.length === 0;\n    }\n}"
      }
    ]
  },

  // Heap/Priority Queue
  {
    title: "Kth Largest Element in an Array",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
    difficulty: "MEDIUM",
    tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    constraints: "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    hints: "1. Use a min-heap of size k\n2. Or use quickselect algorithm",
    editorial: "Use a min-heap to keep track of k largest elements, or use quickselect for O(n) average time.",
    testcases: [
      { input: "[3,2,1,5,6,4]\n2", output: "5" },
      { input: "[3,2,3,1,2,4,5,5,6]\n4", output: "4" },
      { input: "[1]\n1", output: "1" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "The 2nd largest element is 5" }
    },
    codeSnippets: {
      JAVASCRIPT: "function findKthLargest(nums, k) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def find_kth_largest(nums, k):\n    # Your code here\n    return 0",
      JAVA: "public int findKthLargest(int[] nums, int k) {\n    // Your code here\n    return 0;\n}",
      CPP: "int findKthLargest(vector<int>& nums, int k) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function findKthLargest(nums, k) {\n    function quickSelect(left, right, kSmallest) {\n        if (left === right) return nums[left];\n        \n        let pivotIndex = partition(left, right);\n        \n        if (kSmallest === pivotIndex) {\n            return nums[kSmallest];\n        } else if (kSmallest < pivotIndex) {\n            return quickSelect(left, pivotIndex - 1, kSmallest);\n        } else {\n            return quickSelect(pivotIndex + 1, right, kSmallest);\n        }\n    }\n    \n    function partition(left, right) {\n        let pivot = nums[right];\n        let i = left;\n        \n        for (let j = left; j < right; j++) {\n            if (nums[j] <= pivot) {\n                [nums[i], nums[j]] = [nums[j], nums[i]];\n                i++;\n            }\n        }\n        \n        [nums[i], nums[right]] = [nums[right], nums[i]];\n        return i;\n    }\n    \n    return quickSelect(0, nums.length - 1, nums.length - k);\n}"
      }
    ]
  },

  // Trie
  {
    title: "Implement Trie (Prefix Tree)",
    description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.",
    difficulty: "MEDIUM",
    tags: ["Hash Table", "String", "Design", "Trie"],
    companies: ["Amazon", "Microsoft", "Google"],
    constraints: "1 <= word.length, prefix.length <= 2000\nword and prefix consist only of lowercase English letters.\nAt most 3 * 10^4 calls in total will be made to insert, search, and startsWith.",
    hints: "1. Use a tree structure where each node represents a character\n2. Mark end of words with a boolean flag",
    editorial: "Implement using a tree where each node contains children for each letter and a flag for word endings.",
    testcases: [
      { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', output: "[null,null,true,false,true,null,true]" }
    ],
    examples: {
      JAVASCRIPT: { input: 'trie.insert("apple"); trie.search("apple"); // returns true', output: "true", explanation: "Word was inserted and found" }
    },
    codeSnippets: {
      JAVASCRIPT: "class Trie {\n    constructor() {\n        // Your code here\n    }\n    \n    insert(word) {\n        // Your code here\n    }\n    \n    search(word) {\n        // Your code here\n        return false;\n    }\n    \n    startsWith(prefix) {\n        // Your code here\n        return false;\n    }\n}",
      PYTHON: "class Trie:\n    def __init__(self):\n        # Your code here\n        pass\n    \n    def insert(self, word):\n        # Your code here\n        pass\n    \n    def search(self, word):\n        # Your code here\n        return False\n    \n    def starts_with(self, prefix):\n        # Your code here\n        return False",
      JAVA: "class Trie {\n    public Trie() {\n        // Your code here\n    }\n    \n    public void insert(String word) {\n        // Your code here\n    }\n    \n    public boolean search(String word) {\n        // Your code here\n        return false;\n    }\n    \n    public boolean startsWith(String prefix) {\n        // Your code here\n        return false;\n    }\n}",
      CPP: "class Trie {\npublic:\n    Trie() {\n        // Your code here\n    }\n    \n    void insert(string word) {\n        // Your code here\n    }\n    \n    bool search(string word) {\n        // Your code here\n        return false;\n    }\n    \n    bool startsWith(string prefix) {\n        // Your code here\n        return false;\n    }\n};"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "class TrieNode {\n    constructor() {\n        this.children = {};\n        this.isEnd = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n    \n    insert(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                node.children[char] = new TrieNode();\n            }\n            node = node.children[char];\n        }\n        node.isEnd = true;\n    }\n    \n    search(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) return false;\n            node = node.children[char];\n        }\n        return node.isEnd;\n    }\n    \n    startsWith(prefix) {\n        let node = this.root;\n        for (let char of prefix) {\n            if (!node.children[char]) return false;\n            node = node.children[char];\n        }\n        return true;\n    }\n}"
      }
    ]
  },

  // Union Find
  {
    title: "Number of Connected Components in an Undirected Graph",
    description: "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph. Return the number of connected components in the graph.",
    difficulty: "MEDIUM",
    tags: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"],
    companies: ["Amazon", "Facebook", "Google"],
    constraints: "1 <= n <= 2000\n1 <= edges.length <= 5000\nedges[i].length == 2\n0 <= ai <= bi < n\nai != bi\nThere are no repeated edges.",
    hints: "1. Use Union-Find (Disjoint Set Union) data structure\n2. Or use DFS/BFS to find connected components",
    editorial: "Use Union-Find to group connected nodes and count the number of distinct components.",
    testcases: [
      { input: "5\n[[0,1],[1,2],[3,4]]", output: "2" },
      { input: "5\n[[0,1],[1,2],[2,3],[3,4]]", output: "1" },
      { input: "4\n[[]]", output: "4" }
    ],
    examples: {
      JAVASCRIPT: { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2", explanation: "Components: {0,1,2} and {3,4}" }
    },
    codeSnippets: {
      JAVASCRIPT: "function countComponents(n, edges) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def count_components(n, edges):\n    # Your code here\n    return 0",
      JAVA: "public int countComponents(int n, int[][] edges) {\n    // Your code here\n    return 0;\n}",
      CPP: "int countComponents(int n, vector<vector<int>>& edges) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function countComponents(n, edges) {\n    const parent = Array.from({length: n}, (_, i) => i);\n    const rank = new Array(n).fill(0);\n    \n    function find(x) {\n        if (parent[x] !== x) {\n            parent[x] = find(parent[x]);\n        }\n        return parent[x];\n    }\n    \n    function union(x, y) {\n        const rootX = find(x);\n        const rootY = find(y);\n        \n        if (rootX !== rootY) {\n            if (rank[rootX] < rank[rootY]) {\n                parent[rootX] = rootY;\n            } else if (rank[rootX] > rank[rootY]) {\n                parent[rootY] = rootX;\n            } else {\n                parent[rootY] = rootX;\n                rank[rootX]++;\n            }\n            return true;\n        }\n        return false;\n    }\n    \n    let components = n;\n    for (const [a, b] of edges) {\n        if (union(a, b)) {\n            components--;\n        }\n    }\n    \n    return components;\n}"
      }
    ]
  },

  // Divide and Conquer
  {
    title: "Majority Element",
    description: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
    difficulty: "EASY",
    tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"],
    companies: ["Amazon", "Microsoft", "Adobe"],
    constraints: "n == nums.length\n1 <= n <= 5 * 10^4\n-2^31 <= nums[i] <= 2^31 - 1",
    hints: "1. Use Boyer-Moore Voting Algorithm\n2. Or use hash map to count frequencies",
    editorial: "Use Boyer-Moore Voting Algorithm for O(1) space, or hash map for O(n) space.",
    testcases: [
      { input: "[3,2,3]", output: "3" },
      { input: "[2,2,1,1,1,2,2]", output: "2" },
      { input: "[1]", output: "1" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [3,2,3]", output: "3", explanation: "3 appears 2 times out of 3, which is majority" }
    },
    codeSnippets: {
      JAVASCRIPT: "function majorityElement(nums) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def majority_element(nums):\n    # Your code here\n    return 0",
      JAVA: "public int majorityElement(int[] nums) {\n    // Your code here\n    return 0;\n}",
      CPP: "int majorityElement(vector<int>& nums) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function majorityElement(nums) {\n    let candidate = nums[0];\n    let count = 1;\n    \n    for (let i = 1; i < nums.length; i++) {\n        if (count === 0) {\n            candidate = nums[i];\n            count = 1;\n        } else if (nums[i] === candidate) {\n            count++;\n        } else {\n            count--;\n        }\n    }\n    \n    return candidate;\n}"
      }
    ]
  },

  // Tree Traversal
  {
    title: "Binary Tree Inorder Traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "EASY",
    tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    constraints: "The number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100",
    hints: "1. Use recursion or iterative approach with stack\n2. Inorder: left, root, right",
    editorial: "Traverse left subtree, visit root, then traverse right subtree. Can be done recursively or iteratively.",
    testcases: [
      { input: "[1,null,2,3]", output: "[1,3,2]" },
      { input: "[]", output: "[]" },
      { input: "[1]", output: "[1]" }
    ],
    examples: {
      JAVASCRIPT: { input: "root = [1,null,2,3]", output: "[1,3,2]", explanation: "Inorder traversal: left, root, right" }
    },
    codeSnippets: {
      JAVASCRIPT: "function inorderTraversal(root) {\n    // Your code here\n    return [];\n}",
      PYTHON: "def inorder_traversal(root):\n    # Your code here\n    return []",
      JAVA: "public List<Integer> inorderTraversal(TreeNode root) {\n    // Your code here\n    return new ArrayList<>();\n}",
      CPP: "vector<int> inorderTraversal(TreeNode* root) {\n    // Your code here\n    return {};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function inorderTraversal(root) {\n    const result = [];\n    \n    function traverse(node) {\n        if (node) {\n            traverse(node.left);\n            result.push(node.val);\n            traverse(node.right);\n        }\n    }\n    \n    traverse(root);\n    return result;\n}"
      }
    ]
  },

  // Simulation
  {
    title: "Spiral Matrix",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    difficulty: "MEDIUM",
    tags: ["Array", "Matrix", "Simulation"],
    companies: ["Amazon", "Microsoft", "Apple"],
    constraints: "m == matrix.length\nn == matrix[i].length\n1 <= m, n <= 10\n-100 <= matrix[i][j] <= 100",
    hints: "1. Keep track of boundaries: top, bottom, left, right\n2. Move in spiral order and adjust boundaries",
    editorial: "Use four boundaries and move in spiral order: right, down, left, up. Adjust boundaries after each direction.",
    testcases: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
      { input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    examples: {
      JAVASCRIPT: { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Elements in spiral order" }
    },
    codeSnippets: {
      JAVASCRIPT: "function spiralOrder(matrix) {\n    // Your code here\n    return [];\n}",
      PYTHON: "def spiral_order(matrix):\n    # Your code here\n    return []",
      JAVA: "public List<Integer> spiralOrder(int[][] matrix) {\n    // Your code here\n    return new ArrayList<>();\n}",
      CPP: "vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    // Your code here\n    return {};\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function spiralOrder(matrix) {\n    if (!matrix.length) return [];\n    \n    const result = [];\n    let top = 0, bottom = matrix.length - 1;\n    let left = 0, right = matrix[0].length - 1;\n    \n    while (top <= bottom && left <= right) {\n        // Go right\n        for (let j = left; j <= right; j++) {\n            result.push(matrix[top][j]);\n        }\n        top++;\n        \n        // Go down\n        for (let i = top; i <= bottom; i++) {\n            result.push(matrix[i][right]);\n        }\n        right--;\n        \n        // Go left\n        if (top <= bottom) {\n            for (let j = right; j >= left; j--) {\n                result.push(matrix[bottom][j]);\n            }\n            bottom--;\n        }\n        \n        // Go up\n        if (left <= right) {\n            for (let i = bottom; i >= top; i--) {\n                result.push(matrix[i][left]);\n            }\n            left++;\n        }\n    }\n    \n    return result;\n}"
      }
    ]
  },

  // Advanced DP
  {
    title: "House Robber",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    difficulty: "MEDIUM",
    tags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
    hints: "1. For each house, choose max of (rob this + max from 2 houses back) or (max from previous house)\n2. Use dynamic programming",
    editorial: "DP approach: dp[i] = max(nums[i] + dp[i-2], dp[i-1]). Can be optimized to O(1) space.",
    testcases: [
      { input: "[1,2,3,1]", output: "4" },
      { input: "[2,7,9,3,1]", output: "12" },
      { input: "[5]", output: "5" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 0 (money = 1) and house 2 (money = 3). Total = 4" }
    },
    codeSnippets: {
      JAVASCRIPT: "function rob(nums) {\n    // Your code here\n    return 0;\n}",
      PYTHON: "def rob(nums):\n    # Your code here\n    return 0",
      JAVA: "public int rob(int[] nums) {\n    // Your code here\n    return 0;\n}",
      CPP: "int rob(vector<int>& nums) {\n    // Your code here\n    return 0;\n}"
    },
    referenceSolutions: [
      {
        language: "JAVASCRIPT",
        codeSolution: "function rob(nums) {\n    if (nums.length === 0) return 0;\n    if (nums.length === 1) return nums[0];\n    \n    let prev2 = nums[0];\n    let prev1 = Math.max(nums[0], nums[1]);\n    \n    for (let i = 2; i < nums.length; i++) {\n        let current = Math.max(nums[i] + prev2, prev1);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    \n    return prev1;\n}"
      }
    ]
  }
];
// At the end of your seedProblems.js file, before the seedProblems function:
const allProblems = [...sampleProblems, ...additionalProblems.slice(0, 3), ...moreProblems];

// Then modify the seedProblems function to use allProblems:
async function seedProblems() {
  try {
    console.log(`Starting to seed ${allProblems.length} problems...`);
    
    // First, find or create an admin user
    let adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('No admin user found, creating one...');
      adminUser = await db.user.create({
        data: {
          email: 'admin@sheetcode.com',
          name: 'Admin User',
          password: '$2b$10$rKj8F3x4G5h6I7j8K9l0mNpQrStUvWxYz', // Placeholder hash
          role: 'ADMIN',
          league: 'PLATINUM'
        }
      });
      console.log('✅ Created admin user:', adminUser.email);
    } else {
      console.log('✅ Found existing admin user:', adminUser.email);
    }
    
    for (const problemData of allProblems) {
      const problem = await db.problem.create({
        data: {
          ...problemData,
          userId: adminUser.id
        }
      });
      console.log(`✅ Created problem: ${problem.title}`);
    }
    
    console.log(`🎉 Successfully created ${allProblems.length} problems!`);
  } catch (error) {
    console.error('Error seeding problems:', error);
  } finally {
    await db.$disconnect();
  }
}

seedProblems();
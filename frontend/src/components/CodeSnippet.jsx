import React from 'react';

const CodeSnippet = () => {
  return (
    <pre className="code-block text-xs sm:text-sm overflow-auto p-4">
      <code>
        <span className="text-secondary-500">// Two Sum - Find indices of two numbers that add up to target</span>{'\n'}
        <span className="text-primary-400">function</span> <span className="text-secondary-500">twoSum</span>(nums, target) {'{'}{'\n'}
        {'  '}<span className="text-primary-400">const</span> map = <span className="text-secondary-500">new</span> <span className="text-primary-400">Map</span>();{'\n'}
        {'  '}{'\n'}
        {'  '}<span className="text-primary-400">for</span> (<span className="text-primary-400">let</span> i = 0; i &lt; nums.length; i++) {'{'}{'\n'}
        {'    '}<span className="text-primary-400">const</span> complement = target - nums[i];{'\n'}
        {'    '}{'\n'}
        {'    '}<span className="text-primary-400">if</span> (map.has(complement)) {'{'}{'\n'}
        {'      '}<span className="text-primary-400">return</span> [map.get(complement), i];{'\n'}
        {'    '}{'\n'}
        {'    '}map.set(nums[i], i);{'\n'}
        {'  }'}{'\n'}
        {'  '}{'\n'}
        {'  '}<span className="text-primary-400">return</span> [];{'\n'}
        {'}'}{'\n'}{'\n'}
        <span className="text-secondary-500">// Test case</span>{'\n'}
        <span className="text-primary-400">const</span> nums = [2, 7, 11, 15];{'\n'}
        <span className="text-primary-400">const</span> target = 9;{'\n'}
        <span className="text-secondary-500">console</span>.log(twoSum(nums, target)); <span className="text-neutral-500">// [0, 1]</span>{'\n'}
      </code>
    </pre>
  );
};

export default CodeSnippet;
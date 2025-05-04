import { body, param } from 'express-validator';

const createProblemValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('difficulty')
      .notEmpty()
      .isIn(['EASY', 'MEDIUM', 'HARD'])
      .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
    body('tags')
      .isArray()
      .withMessage('Tags must be an array')
      .notEmpty()
      .withMessage('At least one tag is required'),
    body('testcases')
      .isArray()
      .withMessage('Testcases must be an array')
      .notEmpty()
      .withMessage('At least one testcase is required'),
    body('testcases.*.input')
      .notEmpty()
      .withMessage('Input for each testcase is required'),
    body('testcases.*.output')
      .notEmpty()
      .withMessage('Output for each testcase is required'),
    body('referenceSolutions')
      .isArray()
      .withMessage('Reference solutions must be an array')
      .notEmpty()
      .withMessage('At least one reference solution is required'),
    body('referenceSolutions.*.language')
      .notEmpty()
      .withMessage('Language for each reference solution is required'),
    body('referenceSolutions.*.codeSolution')
      .notEmpty()
      .withMessage('Code solution for each reference solution is required'),
  ];
};

const updateProblemValidator = () => {
  return [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty if provided'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty if provided'),
    body('difficulty')
      .optional()
      .isIn(['EASY', 'MEDIUM', 'HARD'])
      .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('testcases')
      .optional()
      .isArray()
      .withMessage('Testcases must be an array'),
    body('testcases.*.input')
      .optional()
      .notEmpty()
      .withMessage('Input for each testcase cannot be empty'),
    body('testcases.*.output')
      .optional()
      .notEmpty()
      .withMessage('Output for each testcase cannot be empty'),
    body('referenceSolutions')
      .optional()
      .isArray()
      .withMessage('Reference solutions must be an array'),
    body('referenceSolutions.*.language')
      .optional()
      .notEmpty()
      .withMessage('Language for each reference solution cannot be empty'),
    body('referenceSolutions.*.codeSolution')
      .optional()
      .notEmpty()
      .withMessage('Code solution for each reference solution cannot be empty'),
  ];
};

const problemIdValidator = () => {
  return [
    param('id').isString().notEmpty().withMessage('Problem ID is required'),
  ];
};

export { createProblemValidator, updateProblemValidator, problemIdValidator };

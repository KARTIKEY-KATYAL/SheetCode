import { body } from 'express-validator';

const createProblemValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is Required'),
    body('tags').isArray().withMessage('Tags must be an array'),
  ];
};

const updateProblemValidator = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty if provided'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty if provided'),
    body('difficulty')
      .optional()
      .isIn(['EASY', 'MEDIUM', 'HARD'])
      .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
    body('tags').isArray().withMessage('Tags must be an array'),
  ];
};

export { createProblemValidator, updateProblemValidator };

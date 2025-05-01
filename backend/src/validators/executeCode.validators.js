import { body } from 'express-validator';

const executeCodeValidator = () => {
  return [
    body('source_code')
      .trim()
      .notEmpty()
      .withMessage('Source code is required'),
    body('stdin').isArray().withMessage('Test inputs must be an array'),
    body('problemId')
      .optional()
      .isString()
      .withMessage('Problem ID must be a string'),
  ];
};

export {
    executeCodeValidator
}
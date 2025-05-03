import { body } from 'express-validator';

const userRegistrationValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required') // in notEmpty becomes false then withMessage will execute.
      .isEmail()
      .withMessage('Email is invalid'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('username should be atleast 3 char')
      .isLength({ max: 13 })
      .withMessage('username cannot exceed 13 char'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[\W_]/)
      .withMessage('Password must contain at least one special character'),
  ];
};

const userLoginValidator = () => {
  return [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  ];
};

export { userRegistrationValidator, userLoginValidator };

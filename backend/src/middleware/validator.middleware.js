import { validationResult } from 'express-validator';
import { ApiError } from '../libs/api-error.js';

export const validate = (req, res, next) => {
  // Error returned by userRegistrationValidator will be accepted in validationResult(req);
  const errors = validationResult(req);
  // If no errors proceed to auth.controller.js
  if (errors.isEmpty()) {
    return next();
  }
  // console.log(errors);
  // console.log(errors.array());

  const extractedError = [];
  errors.array().map((err) =>
    extractedError.push({
      [err.path]: err.msg, // err.path is not fixed string , infact we want value of err.path to be key so for that we use [].
    }),
  );
  console.log(extractedError);

  throw new ApiError(422, 'Received data is not valid', extractedError);
};

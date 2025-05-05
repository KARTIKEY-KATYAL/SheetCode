import express from 'express';
import {
  getSubmissions,
  getProblemSubmission,
  getProblemCount,
} from '../controllers/submission.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const SubmissionRoutes = express.Router();

SubmissionRoutes.get('/get-all-submissions', isLoggedIn, getSubmissions);
SubmissionRoutes.get(
  '/get-submission/:problemId',
  isLoggedIn,
  getProblemSubmission,
);

SubmissionRoutes.get(
  '/get-submissions-count/:problemId',
  isLoggedIn,
  getProblemCount,
);

export default SubmissionRoutes;

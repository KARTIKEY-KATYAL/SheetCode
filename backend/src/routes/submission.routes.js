import express from 'express';
import {
  getSubmissions,
  getProblemSubmission,
  getProblemCount,
  getUserLastSubmission,
  getSubmissionById,
  deleteSubmission,
  deleteMultipleSubmissions,
  getSubmissionStats,
} from '../controllers/submission.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`Submission route accessed: ${req.method} ${req.originalUrl}`);
  console.log('User:', req.user ? `${req.user.id} (${req.user.email})` : 'Not authenticated');
  next();
});

// Test route (for testing purposes)
router.get('/test/problem/:problemId', (req, res) => {
  res.json({ 
    message: 'Route works!', 
    problemId: req.params.problemId,
    url: req.originalUrl
  });
});

// Statistics routes (most specific first)
router.get('/stats', isLoggedIn, getSubmissionStats);

// Problem-specific submission routes (THESE ARE THE MISSING ROUTES)
router.get('/problem/:problemId', isLoggedIn, getProblemSubmission);
router.get('/problem/:problemId/count', isLoggedIn, getProblemCount);
router.get('/problem/:problemId/last', isLoggedIn, getUserLastSubmission);

// General submission routes
router.get('/', isLoggedIn, getSubmissions);
router.get('/get-all-submissions', isLoggedIn, getSubmissions);

// Legacy routes (for backward compatibility)
router.get('/get-submission/:problemId', isLoggedIn, getProblemSubmission);
router.get('/get-submissions-count/:problemId', isLoggedIn, getProblemCount);
router.get('/get-user-last-submission/:problemId', isLoggedIn, getUserLastSubmission);

// Individual submission operations
router.get('/:submissionId', isLoggedIn, getSubmissionById);
router.get('/details/:submissionId', isLoggedIn, getSubmissionById);
router.delete('/:submissionId', isLoggedIn, deleteSubmission);
router.delete('/delete/:submissionId', isLoggedIn, deleteSubmission);

// Batch operations
router.delete('/', isLoggedIn, deleteMultipleSubmissions);
router.delete('/batch-delete', isLoggedIn, deleteMultipleSubmissions);

export default router;
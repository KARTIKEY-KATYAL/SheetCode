import express from 'express';
import {
  problemDiscussion,
  generateHints,
  analyzeSubmission,
  analyzeProfile, // Add this import
} from '../controllers/chat.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`Chat route accessed: ${req.method} ${req.path}`);
  next();
});

// Chat routes
router.post('/problem-discussion', isLoggedIn, problemDiscussion);
router.post('/generate-hints', isLoggedIn, generateHints);
router.post('/analyze-submission', isLoggedIn, analyzeSubmission);

// Add the missing profile analysis route
router.post('/analyze-profile', isLoggedIn, analyzeProfile);

export default router;
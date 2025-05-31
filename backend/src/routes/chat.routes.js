import { Router } from 'express';
import { 
  problemDiscussion, 
  generateHints,
  analyzeSubmission,
  analyzeProfile
} from '../controllers/chat.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

// Problem discussion chat
router.post('/problem-discussion', isLoggedIn, problemDiscussion);

// Generate AI hint
router.post('/generate-hints', isLoggedIn, generateHints);

// Analyze submission with AI
router.post('/analyze-submission', isLoggedIn, analyzeSubmission);

// Analyze user profile
router.post('/analyze-profile', isLoggedIn, analyzeProfile);

export default router;
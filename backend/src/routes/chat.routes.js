import express from 'express';
import { problemDiscussion, generateHint, analyzeSubmission } from '../controllers/chat.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test route (remove this after testing)
router.get('/test', (req, res) => {
  res.json({ message: 'Chat routes are working!' });
});

// Problem discussion chat
router.post('/problem-discussion', isLoggedIn, problemDiscussion);

// Generate AI hint
router.post('/generate-hint', isLoggedIn, generateHint);

// Analyze submission with AI
router.post('/analyze-submission', isLoggedIn, analyzeSubmission);

export default router;
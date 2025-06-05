import express from 'express';
import {
  createProblem,
  getallProblems,
  getallProblembyId,
  UpdateProblembyId,
  DeletebyId,
  getSolvedProblems,
  getProblemStats,
} from '../controllers/problem.controllers.js';
import { isAdmin, isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`Problem route accessed: ${req.method} ${req.path}`);
  console.log('Auth user:', req.user ? `${req.user.id} (${req.user.role})` : 'Not authenticated');
  next();
});

// IMPORTANT: More specific routes should come before parameterized routes
// User-specific routes (before parameterized routes)
router.get('/get-solved', isLoggedIn, getSolvedProblems);
router.get('/get-all-problems', isLoggedIn, getallProblems);

// Problem CRUD routes
router.post('/create-problem', isLoggedIn, isAdmin, createProblem);
router.get('/get-problems/:id', isLoggedIn, getallProblembyId);
router.put('/update-problem/:id', isLoggedIn, isAdmin, UpdateProblembyId);
router.delete('/delete-problem/:id', isLoggedIn, isAdmin, DeletebyId);

// Problem stats route (this should be last because it uses /:problemId pattern)
router.get('/:problemId/stats', isLoggedIn, getProblemStats);

export default router;

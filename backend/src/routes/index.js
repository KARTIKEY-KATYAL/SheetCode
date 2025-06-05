import express from 'express';
import problemRoutes from './problem.routes.js';
import authRoutes from './auth.routes.js';
import executionRoute from './executeCode.routes.js';
import submissionRoute from './submission.routes.js';
import playlistRoute from './playlist.routes.js';
import chatRoute from './chat.routes.js';
import testcaseRoute from './testcase.routes.js';
import healthRoute from './health.routes.js';


const router = express.Router();

// Health check route
router.use('/health', healthRoute);

// // Debug routes (only in development)
// if (process.env.NODE_ENV === 'development') {
//   router.use('/debug', debugRoute);
// }

// Authentication routes
router.use('/auth', authRoutes);

// Problem routes
router.use('/problems', problemRoutes);

// Execution route (single route, not plural)
router.use('/execute-code', executionRoute);

// Submission routes
router.use('/submission', submissionRoute);

// Playlist routes
router.use('/playlist', playlistRoute);

// Chat routes
router.use('/chat', chatRoute);

// Test case generation routes
router.use('/testcases', testcaseRoute);

export default router;
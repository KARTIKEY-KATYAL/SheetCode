import express from 'express';
import { 
  generateTestCasesController, 
  generateExampleController,
  generateCompleteTestData,
  generateStarterCodeController,
  generateHintsController
} from '../controllers/testcase.controller.js';
import { isLoggedIn, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Generate test cases only - Admin only
router.post('/generate-testcases', isLoggedIn, isAdmin, generateTestCasesController);

// Generate example only - Admin only
router.post('/generate-example', isLoggedIn, isAdmin, generateExampleController);

// Generate starter code - Admin only
router.post('/generate-starter-code', isLoggedIn, isAdmin, generateStarterCodeController);

// Generate hints - Admin only
router.post('/generate-hints', isLoggedIn, isAdmin, generateHintsController);

// Generate complete test data (test cases + examples + starter code + hints) - Admin only
router.post('/generate-complete', isLoggedIn, isAdmin, generateCompleteTestData);

export default router;
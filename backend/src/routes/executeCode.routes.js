import express from 'express';
import { executeCode } from '../controllers/executeCode.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Execute code endpoint
router.post('/', isLoggedIn, executeCode);

export default router;
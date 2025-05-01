import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { executeCode } from '../controllers/executeCode.controller.js';
import { executeCodeValidator } from '../validators/executeCode.validators.js';
import { validate } from '../middleware/validator.middleware.js';

const executionRoute = express.Router();

executionRoute.post('/',executeCodeValidator,validate, isLoggedIn, executeCode);

export default executionRoute;

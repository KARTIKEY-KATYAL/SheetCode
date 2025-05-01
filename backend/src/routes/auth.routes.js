import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import {RegisterUser,LoginUser,LogoutUser,CheckUser} from '../controllers/auth.controllers.js';
import {userLoginValidator,userRegistrationValidator} from '../validators/auth.validators.js';
import { validate } from '../middleware/validator.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', upload.fields([{name: 'avatar',maxCount: 1}]),userRegistrationValidator(),validate,RegisterUser);
authRoutes.post('/login', userLoginValidator(), validate, LoginUser);
authRoutes.get('/logout', isLoggedIn, LogoutUser);
authRoutes.get('/check', isLoggedIn, CheckUser);

export default authRoutes;

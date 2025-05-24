import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import {
  RegisterUser,
  LoginUser,
  LogoutUser,
  CheckUser,
  UpdateUser
} from '../controllers/auth.controllers.js';
import {
  userLoginValidator,
  userRegistrationValidator,
  userUpdateValidator
} from '../validators/auth.validators.js';
import { validate } from '../middleware/validator.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', upload.fields([{name: 'avatar',maxCount: 1}]), userRegistrationValidator(), validate, RegisterUser);
authRoutes.post('/login', userLoginValidator(), validate, LoginUser);
authRoutes.get('/logout', isLoggedIn, LogoutUser);
authRoutes.get('/check', isLoggedIn, CheckUser);
authRoutes.patch('/update', isLoggedIn, upload.fields([{name: 'avatar', maxCount: 1}]), userUpdateValidator(), validate, UpdateUser);

export default authRoutes;

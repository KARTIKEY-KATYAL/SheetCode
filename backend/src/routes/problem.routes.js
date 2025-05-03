import express from 'express';
import {
  createProblem,
  getallProblems,
  getallProblembyId,
  UpdateProblembyId,
  DeletebyId,
  getSolvedProblems,
} from '../controllers/problem.controllers.js';
import { isAdmin, isLoggedIn } from '../middleware/auth.middleware.js';


const problemroutes = express.Router();

problemroutes.post(
  '/create-problem',
  isLoggedIn,
  isAdmin,
  createProblem,
);
problemroutes.get('/get-all-problems', isLoggedIn, getallProblems);
problemroutes.get('/get-problems/:id', isLoggedIn, getallProblembyId);
problemroutes.put(
  '/update-problem/:id',
  isLoggedIn,
  isAdmin,
  UpdateProblembyId,
);
problemroutes.delete('/delete-problem/:id', isLoggedIn, isAdmin, DeletebyId);
problemroutes.get('/get-solved', isLoggedIn, getSolvedProblems);

export default problemroutes;

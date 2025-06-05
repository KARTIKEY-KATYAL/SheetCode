import express from 'express';
import { healthcheck } from '../controllers/healthcheck.controllers.js';

const health = express.Router();

health.get('/', healthcheck);

export default health;
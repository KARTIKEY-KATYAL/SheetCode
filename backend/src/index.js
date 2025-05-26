import express from 'express';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import cors from "cors"
dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(CookieParser());
app.use(express.urlencoded());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://www.sheetcode.in",
    "https://sheetcode.in", 
    "http://localhost:5173" // for development
  ],
  credentials: true,
}))
app.get('/', (req, res) => {
  res.send('ok!');
});

import authRoutes from './routes/auth.routes.js';
import health from './routes/health.routes.js';
import problemRoutes from './routes/problem.routes.js';
import executionRoute from './routes/executeCode.routes.js';
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"

app.use('/api/v1/health', health);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/execute-code', executionRoute);
app.use('/api/v1/submission', submissionRoutes);
app.use('/api/v1/playlist', playlistRoutes);

app.listen(port, () => {
  console.log(`Server Started on PORT : ${port}`);
});

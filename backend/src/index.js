import express from 'express';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Handle preflight requests first
app.options('*', cors({
  origin: [
    "https://sheetcode.in",
    "https://www.sheetcode.in",
    "https://api.sheetcode.in",
    "http://localhost:5173" // for development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json());
app.use(CookieParser());
app.use(express.urlencoded({ extended: true }));

// Main CORS configuration
app.use(cors({
  origin: [
    "https://sheetcode.in",
    "https://www.sheetcode.in", 
    "https://api.sheetcode.in",
    "http://localhost:5173" // for development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.get('/', (_, res) => {
  res.send('SheetCode API is running! 🚀');
});

import authRoutes from './routes/auth.routes.js';
import health from './routes/health.routes.js';
import problemRoutes from './routes/problem.routes.js';
import executionRoute from './routes/executeCode.routes.js';
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import testcaseRoutes from "./routes/testcase.routes.js"
import chatRoutes from './routes/chat.routes.js';

app.use('/api/v1/health', health);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/execute-code', executionRoute);
app.use('/api/v1/submission', submissionRoutes);
app.use('/api/v1/playlist', playlistRoutes);
app.use('/api/v1/testcases', testcaseRoutes);
app.use('/api/v1/chat', chatRoutes);


app.listen(port, () => {
  console.log(`🚀 SheetCode API Server running on PORT: ${port}`);
  console.log(`🔗 API Base URL: http://localhost:${port}/api/v1`);
  console.log(`💬 Chat endpoint: http://localhost:${port}/api/v1/chat/problem-discussion`);
});

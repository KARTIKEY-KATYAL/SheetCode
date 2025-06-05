import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import routes from './routes/index.js';
import submissionRoutes from './routes/submission.routes.js'; // or wherever your main app file is

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(CookieParser());

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

// Routes
app.use('/api/v1', routes);
app.use('/api/v1/submissions', submissionRoutes); // Make sure this line exists:

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SheetCode API Server running on PORT: ${PORT}`);
});

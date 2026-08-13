import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// ─── Load Environment Variables ──────────────────────────────────────────────
dotenv.config();

// ─── Initialize Express App ─────────────────────────────────────────────────
const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StudyVerse API is running 🚀' });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server, then Connect DB ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\n🚀 StudyVerse API Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  // Connect to MongoDB after server is listening
  await connectDB();
});

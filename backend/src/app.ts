import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './config/data-source';

import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import settingsRoutes from './routes/settingsRoutes';
import emailRoutes from './routes/emailRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

import compression from 'compression';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter';

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Database Initialization Middleware
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'NextStop Backend API is running' });
});

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Global Error Handler caught an error:');
    console.dir(err, { depth: null });
    res.status(500).json({
      message: 'Global Error Handler caught an error',
      error: err.message || err,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  },
);

export default app;

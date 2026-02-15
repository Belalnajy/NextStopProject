import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './config/data-source';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
export default app;

// Only start the server if not running as a serverless function
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      await AppDataSource.initialize();
      console.log('Database connected successfully');

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  };

  startServer();
}

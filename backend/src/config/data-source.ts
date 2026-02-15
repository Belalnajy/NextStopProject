import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Application } from '../entities/Application';
import { Attachment } from '../entities/Attachment';
import { Settings } from '../entities/Settings';
import { EmailTemplate } from '../entities/EmailTemplate';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // Auto-create tables in dev (disable in prod)
  logging: false,
  entities: [User, Application, Attachment, Settings, EmailTemplate],
  migrations: [],
  subscribers: [],
  // Add these for serverless stability
  extra: {
    max: 1, // Minimize connections per lambda
    idleTimeoutMillis: 30000,
  },
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  }
  return AppDataSource;
};

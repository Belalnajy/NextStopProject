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
  host: process.env.POSTGRES_HOST || process.env.DB_HOST,
  port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER || process.env.DB_USERNAME,
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // Auto-create tables in dev
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  logging: false,
  entities: [User, Application, Attachment, Settings, EmailTemplate],
  // ... rest of the config
  extra: {
    max: 1,
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

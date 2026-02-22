import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from './src/config/data-source';
import { initializeTemplates } from './src/services/emailService';

dotenv.config();

async function run() {
  await AppDataSource.initialize();
  console.log("Database initialized");
  await initializeTemplates();
  console.log("Templates initialized");
  process.exit(0);
}

run();

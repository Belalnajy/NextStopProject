import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
  try {
    AppDataSource.setOptions({ synchronize: true });
    await AppDataSource.initialize();
    console.log('Database connected and synchronized for seeding');

    const userRepo = AppDataSource.getRepository(User);

    const email = 'admin@nextstop.com';
    const existingAdmin = await userRepo.findOneBy({ email });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepo.create({
        full_name: 'System Administrator',
        email: email,
        password_hash: hashedPassword,
        role: UserRole.ADMIN,
      });

      await userRepo.save(admin);
      console.log('Admin user seeded successfully');
      console.log('Email: admin@nextstop.com');
      console.log('Password: admin123');
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seed();

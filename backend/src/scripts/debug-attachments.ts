import { AppDataSource } from '../config/data-source';
import { Attachment } from '../entities/Attachment';

async function debug() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
    const repo = AppDataSource.getRepository(Attachment);
    const attachments = await repo.find({ take: 10 });

    console.log('\n--- Attachment Data ---');
    attachments.forEach((a) => {
      console.log(`ID: ${a.id}`);
      console.log(`Type: ${a.type}`);
      console.log(`File URL: ${a.file_url}`);
      console.log(`File Path: ${a.file_path}`);
      console.log('---');
    });

    await AppDataSource.destroy();
  } catch (err) {
    console.error(err);
  }
}

debug();

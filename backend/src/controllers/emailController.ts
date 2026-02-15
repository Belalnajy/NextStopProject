import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { EmailTemplate, EmailType } from '../entities/EmailTemplate';
import { sendEmail } from '../services/emailService';

const templateRepo = AppDataSource.getRepository(EmailTemplate);

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await templateRepo.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, body_html } = req.body;

    const template = await templateRepo.findOneBy({ id: id as any });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.subject = subject;
    template.body_html = body_html;
    await templateRepo.save(template);

    res.json({ message: 'Template updated', template });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { to, type } = req.body;

    // Valid types
    if (!Object.values(EmailType).includes(type)) {
      return res.status(400).json({ message: 'Invalid email type' });
    }

    // Mock variables for test
    const variables = {
      name: 'Test User',
      appNo: 'TEST-APP-001',
    };

    await sendEmail(to, type, variables);
    res.json({ message: 'Test email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

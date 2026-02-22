import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Application, ApplicationStatus } from '../entities/Application';
import { Attachment, AttachmentType } from '../entities/Attachment';
import { sendEmail } from '../services/emailService';
import { EmailType } from '../entities/EmailTemplate';
import { getDownloadUrl } from '../config/cloudinary';
import { z } from 'zod';

const appRepo = AppDataSource.getRepository(Application);
const attachRepo = AppDataSource.getRepository(Attachment);

// Basic validation schema (can be expanded)
const applicationSchema = z.object({
  nationality: z.string(),
  arrival_date: z.string(),
  passport_number: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  street_name: z.string(),
  building_no: z.string(),
  apartment: z.string().optional().or(z.literal('')),
  postal_code: z.string(),
  town_city: z.string(),
  country: z.string(),
  // Additional fields from frontend
  has_other_nationalities: z.boolean().optional(),
  other_nationalities: z.string().optional(),
  phone_code: z.string().optional(),
  area: z.string().optional(),
  has_job: z.boolean().optional(),
  job_title: z.string().optional(),
  has_criminal_record: z.boolean().optional(),
  criminal_details: z.string().optional(),
  has_involvement: z.boolean().optional(),
  involvement_details: z.string().optional(),
  confirm_info_declaration: z.boolean().optional(),
  accept_terms_declaration: z.boolean().optional(),
  confirm_processing_time_declaration: z.boolean().optional(),
});

export const createApplication = async (req: Request, res: Response) => {
  try {
    console.log('Received application body:', req.body);

    // Handle boolean conversions from FormData strings
    const booleans = [
      'has_job',
      'has_criminal_record',
      'has_involvement',
      'has_other_nationalities',
      'confirm_info_declaration',
      'accept_terms_declaration',
      'confirm_processing_time_declaration',
    ];
    booleans.forEach((key) => {
      if (req.body[key] !== undefined) {
        req.body[key] = req.body[key] === 'true' || req.body[key] === 'yes';
      }
    });

    const data = applicationSchema.parse(req.body);

    const count = await appRepo.count();
    const appNo = `APP-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    const newApp = appRepo.create({
      ...data,
      application_no: appNo,
      status: ApplicationStatus.PENDING,
    });

    const savedApp = (await appRepo.save(newApp as any)) as any;

    // Handle File Uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const attachments: Attachment[] = [];

      // Helper to save attachment
      const saveAttachment = async (
        file: Express.Multer.File,
        type: AttachmentType,
      ) => {
        const attachment = attachRepo.create({
          application: savedApp,
          type: type,
          file_url: file.path,
          file_path: file.filename,
        });
        return await attachRepo.save(attachment);
      };

      if (files['passportCopy']) {
        for (const file of files['passportCopy']) {
          attachments.push(
            await saveAttachment(file, AttachmentType.PASSPORT_COPY),
          );
        }
      }

      if (files['personalPhoto']) {
        for (const file of files['personalPhoto']) {
          attachments.push(
            await saveAttachment(file, AttachmentType.PERSONAL_PHOTO),
          );
        }
      }

      // savedApp.attachments = attachments; // Relation is already handled by saving attachment with app ref
    }

    res.status(201).json({
      application: savedApp,
    });

    // Send confirmation email
    await sendEmail(savedApp.email, EmailType.APPLICATION_RECEIVED, {
      name: savedApp.full_name,
      appNo: savedApp.application_no,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.issues);
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: error.issues });
    }
    console.error('Application Creation Error Context:');
    console.dir(error, { depth: null });
    res.status(500).json({
      message: 'Server error',
      error: error.message || error,
      details: error.stack || null,
    });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await appRepo.find({
      order: { created_at: 'DESC' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await appRepo.findOne({
      where: { id: id as any },
      relations: ['attachments'],
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await appRepo.findOneBy({ id: id as any });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await appRepo.save(application);

    // Send status update email
    await sendEmail(application.email, EmailType.STATUS_UPDATE, {
      name: application.full_name,
      appNo: application.application_no,
      status: status,
    });

    res.json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attachment = await attachRepo.findOneBy({ id: id as any });

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Determine filename and content type from the stored file_url
    const urlParts = attachment.file_url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const extMatch = lastPart.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'bin';

    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const filename = `${attachment.type}_${attachment.application_id}.${ext}`;

    // Use the stored URL directly.
    // Since we handle the download (Content-Disposition) header ourselves,
    // we don't need to ask Cloudinary to add 'fl_attachment' or sign the URL.
    // This bypasses 401 errors caused by resource type mismatches or signature issues on public files.
    const downloadUrl = attachment.file_url;

    console.log('Downloading attachment:', {
      id,
      publicId: attachment.file_path,
      url: downloadUrl,
    });

    const response = await fetch(downloadUrl);

    if (!response.ok) {
      console.error(
        'Cloudinary fetch failed:',
        response.status,
        response.statusText,
        'URL:',
        downloadUrl,
      );
      return res
        .status(502)
        .json({ message: 'Failed to fetch file from storage' });
    }

    // Stream the file to the client with download headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe the readable stream to the response
    const reader = response.body as any;
    if (reader?.pipe) {
      reader.pipe(res);
    } else {
      // Fallback for environments where response.body is a web ReadableStream
      const buffer = Buffer.from(await response.arrayBuffer());
      res.send(buffer);
    }
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendApplicationEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await appRepo.findOneBy({ id: id as any });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === ApplicationStatus.PENDING) {
      return res.status(400).json({
        message: 'Application is pending. Please approve or reject it first.',
      });
    }

    const emailType =
      application.status === ApplicationStatus.APPROVED
        ? EmailType.APPLICATION_APPROVED
        : EmailType.APPLICATION_REJECTED;

    await sendEmail(application.email, emailType, {
      name: application.full_name,
      appNo: application.application_no,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending application email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Settings } from '../entities/Settings';
import cloudinary from '../config/cloudinary';

const settingsRepo = AppDataSource.getRepository(Settings);

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await settingsRepo.findOne({ where: { id: 1 } });

    if (!settings) {
      // Initialize default settings if not exists
      settings = settingsRepo.create({
        site_name: 'NextStop Visa',
        maintenance_mode: false,
        registration_closed: false,
        email_notifs: true,
        seo_indexing: true,
        hero_title: 'Your Gateway to the United Kingdom',
        hero_subtitle:
          'Get your Electronic Travel Authorization quickly and securely.',
        about_title: 'We Are NextStop Visa',
        about_mission: 'Simplifying international travel for everyone.',
        stats_travelers: '50K+',
        stats_support: '24/7',
        stats_approval: '99%',
        contact_email: 'support@nextstopvisa.com',
        contact_phone: '+1 (555) 123-4567',
        contact_address: '123 Premier Way, London, EC1A 1BB, United Kingdom',
        copyright_text: '© 2026 NextStop Visa. All rights reserved.',
      });
      await settingsRepo.save(settings);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await settingsRepo.findOne({ where: { id: 1 } });

    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Handle Boolean conversions (FormData specific)
    const booleans = [
      'maintenance_mode',
      'registration_closed',
      'email_notifs',
      'seo_indexing',
    ];
    booleans.forEach((key) => {
      if (req.body[key] !== undefined) {
        req.body[key] = req.body[key] === 'true' || req.body[key] === true;
      }
    });

    // Parse JSON fields from FormData
    if (req.body.quick_links && typeof req.body.quick_links === 'string') {
      try {
        req.body.quick_links = JSON.parse(req.body.quick_links);
      } catch (e) {
        console.error('Failed to parse quick_links', e);
        req.body.quick_links = [];
      }
    }

    if (req.body.hero_images && typeof req.body.hero_images === 'string') {
      try {
        req.body.hero_images = JSON.parse(req.body.hero_images);
      } catch (e) {
        console.error('Failed to parse hero_images', e);
        req.body.hero_images = [];
      }
    }

    // Remove logo_url from body to prevent overwriting - it's only set via file upload
    delete req.body.logo_url;
    // Remove non-editable fields that may come from frontend state
    delete req.body.id;
    delete req.body.updated_at;

    // Merge new data
    settingsRepo.merge(settings, req.body);

    // Handle logo upload
    if (req.file) {
      console.log('Logo uploaded to Cloudinary:', req.file.path);

      // If a PDF is uploaded as a logo, force it to be utilized as a PNG
      // so it can be displayed in <img> tags on the frontend.
      if (
        req.file.mimetype === 'application/pdf' ||
        req.file.path.endsWith('.pdf')
      ) {
        // req.file.filename contains the public_id in multer-storage-cloudinary
        const publicId = req.file.filename;

        // Generate a signed/secure URL forcing PNG format
        // We import the cloudinary instance from our config to ensure it's configured
        const cloudinaryUrl = cloudinary.url(publicId, {
          resource_type: 'image',
          format: 'png',
          secure: true,
        });

        settings.logo_url = cloudinaryUrl;
        console.log('Converted PDF logo to PNG URL:', settings.logo_url);
      } else {
        settings.logo_url = req.file.path;
      }
    }

    const updatedSettings = await settingsRepo.save(settings);

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadHeroImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Return the Cloudinary URL
    // Multer-storage-cloudinary automatically uploads it and puts the URL in req.file.path
    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

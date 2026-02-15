import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Application, ApplicationStatus } from '../entities/Application';

const appRepo = AppDataSource.getRepository(Application);

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Get counts for status badges
    const totalApplications = await appRepo.count();
    const pendingReview = await appRepo.countBy({
      status: ApplicationStatus.PENDING,
    });
    const approved = await appRepo.countBy({
      status: ApplicationStatus.APPROVED,
    });
    const rejected = await appRepo.countBy({
      status: ApplicationStatus.REJECTED,
    });

    // 2. Get recent applications (last 5)
    const recentApplications = await appRepo.find({
      order: { created_at: 'DESC' },
      take: 5,
    });

    // 3. Simplified "change" calculation (placeholder for now, can be improved with time-based comparison)
    // For now we'll return static strings or calculate based on last 30 days if needed

    res.json({
      stats: [
        {
          title: 'Total Applications',
          value: totalApplications.toLocaleString(),
          change: '+0%',
          category: 'total',
        },
        {
          title: 'Pending Review',
          value: pendingReview.toLocaleString(),
          change: '+0%',
          category: 'pending',
        },
        {
          title: 'Approved',
          value: approved.toLocaleString(),
          change: '+0%',
          category: 'approved',
        },
        {
          title: 'Rejected',
          value: rejected.toLocaleString(),
          change: '+0%',
          category: 'rejected',
        },
      ],
      recentApplications,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

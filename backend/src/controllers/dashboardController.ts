import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Application, ApplicationStatus, PaymentStatus } from '../entities/Application';

const appRepo = AppDataSource.getRepository(Application);

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
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
    const paidCount = await appRepo.countBy({
      payment_status: PaymentStatus.PAID,
    });
    const unpaidCount = await appRepo.countBy({
      payment_status: PaymentStatus.UNPAID,
    });
    const revenue = paidCount * 97;

    const recentApplications = await appRepo.find({
      order: { created_at: 'DESC' },
      take: 5,
    });

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
        {
          title: 'Revenue',
          value: `€${revenue.toLocaleString()}`,
          change: '+0%',
          category: 'revenue',
        },
        {
          title: 'Paid',
          value: paidCount.toLocaleString(),
          change: '+0%',
          category: 'paid',
        },
      ],
      recentApplications,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

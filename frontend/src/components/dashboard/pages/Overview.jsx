import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileCheck,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, change, icon: Icon, color, loading }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {!loading && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-500'
          }`}>
          {change}
          <TrendingUp size={16} />
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    {loading ? (
      <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-md mt-1" />
    ) : (
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    )}
  </motion.div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
      <Link
        to="/admin/submissions"
        className="text-primary hover:text-primary-dark text-sm font-medium">
        View All
      </Link>
    </div>
    <div className="space-y-6">
      {activities.length > 0 ? (
        activities.map((app, i) => (
          <div key={app.id} className="flex gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm z-10 relative">
                <Mail size={16} className="text-slate-500" />
              </div>
              {i !== activities.length - 1 && (
                <div className="absolute top-10 left-1/2 -ml-px w-0.5 h-full bg-slate-100" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-900 font-medium line-clamp-1">
                Application submitted by{' '}
                <span className="text-primary">{app.full_name}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(app.created_at).toLocaleDateString()} •{' '}
                {app.nationality}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400 text-center py-4">
          No recent activity
        </p>
      )}
    </div>
  </div>
);

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    total: 'bg-blue-500',
    pending: 'bg-amber-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  };

  const iconMap = {
    total: Users,
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Download Report
          </button>
          <Link
            to="/admin/submissions"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
            View Applications
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"
                />
              ))
          : data?.stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={iconMap[stat.category]}
                color={statusColors[stat.category]}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Applications
            </h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-transparent">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    App No
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="py-4 px-4">
                          <div className="h-8 bg-slate-50 animate-pulse rounded-md" />
                        </td>
                      </tr>
                    ))
                ) : data?.recentApplications.length > 0 ? (
                  data.recentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {app.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {app.full_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {app.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/submissions/${app.id}`}
                          className="text-slate-400 hover:text-primary transition-colors">
                          <ArrowRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-400 text-sm">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data?.recentApplications || []} />
        </div>
      </div>
    </div>
  );
}

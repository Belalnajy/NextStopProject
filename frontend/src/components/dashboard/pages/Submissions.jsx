import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';
import api from '../../../api';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default function Submissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (err) {
      const msg = 'Failed to fetch applications';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = applications.filter(
    (item) =>
      item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.passport_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading applications...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Application Submissions
          </h1>
          <p className="text-slate-500">
            Manage and review incoming visa applications.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, passport, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Passport Info
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Arrival Date
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {item.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.email}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.phone_number}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-900 font-mono">
                        {item.passport_number}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.nationality}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {item.arrival_date}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/admin/submissions/${item.id}`}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors tooltip"
                        title="View Details">
                        <Eye size={18} />
                      </Link>
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send Email">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-900">
              1-{filteredData.length}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-900">
              {applications.length}
            </span>{' '}
            results
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

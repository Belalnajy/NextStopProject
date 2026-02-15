import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
  User,
  Plane,
} from 'lucide-react';

// Mock Data for a single application (In a real app, fetch by ID)
const MOCK_APPLICATION = {
  id: 'APP-2024-001',
  status: 'pending',
  submittedAt: '2024-02-12T10:30:00Z',
  paymentIndex: 'PAY-8839201',
  amount: '£97.00', // 16 + 81

  travel: {
    nationality: 'Egyptian',
    hasOtherNationalities: 'No',
    arrivalDate: '2024-03-15',
    passportNumber: 'A12345678',
    passportExpiry: '2029-05-20',
    passportCopyUrl: '#', // Placeholder
  },

  personal: {
    fullName: 'Ahmed Hassan',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    phone: '+20 123 456 7890',
    email: 'ahmed@example.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  },

  address: {
    streetName: '123 Nile Street',
    buildingNo: '45',
    apartment: '12B',
    area: 'Zamalek',
    townCity: 'Cairo',
    postalCode: '11211',
    country: 'Egypt',
  },

  additional: {
    employmentStatus: 'Employed',
    jobTitle: 'Software Engineer',
    hasCriminalRecord: 'No',
    hasInvolvement: 'No',
  },

  declarations: {
    confirmedInfo: true,
    acceptedTerms: true,
  },
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg border border-slate-200 text-primary shadow-sm">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const DetailRow = ({ label, value, highlight = false }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-slate-50 last:border-0 ${highlight ? 'bg-slate-50 rounded-lg px-2 -mx-2' : ''}`}>
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="text-sm font-semibold text-slate-900 sm:col-span-2">
      {value || '-'}
    </dd>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || 'pending';
  const styles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    action_required: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  const Icon =
    s === 'approved' ? CheckCircle : s === 'rejected' ? XCircle : Clock;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${styles[s]}`}>
      <Icon size={16} />
      <span className="capitalize">{s.replace('_', ' ')}</span>
    </span>
  );
};

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../api';

// ... (SectionCard, DetailRow, StatusBadge stay same)

export default function ApplicationDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/${id}`);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      await api.patch(`/applications/${id}/status`, { status });
      setData((prev) => ({ ...prev, status }));
      toast.success(`Application ${status} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading details...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );
  if (!data) return null;

  const passportCopy = data.attachments?.find(
    (a) => a.type?.toUpperCase() === 'PASSPORT_COPY',
  );
  const personalPhoto = data.attachments?.find(
    (a) => a.type?.toUpperCase() === 'PERSONAL_PHOTO',
  );

  const formatBool = (val) => (val ? 'Yes' : 'No');

  const handleDownload = async (attachmentId, filename) => {
    try {
      // Use the backend proxy endpoint for downloading
      // This streams the file through our server, bypassing Cloudinary restrictions
      const token = localStorage.getItem('token');
      const baseUrl = api.defaults.baseURL || '';
      const downloadUrl = `${baseUrl}/applications/attachments/${attachmentId}/download`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      // Add auth header via fetch for the download
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Error initiating download');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header / Nav */}
      <div className="flex items-center gap-4 text-slate-500 mb-2">
        <Link
          to="/admin/submissions"
          className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Submissions
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">
          Application #{data.application_no || data.id}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4">
          <img
            src={
              personalPhoto?.file_url ||
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'
            }
            alt="Applicant"
            className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {data.full_name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={data.status} />
              <span className="text-sm text-slate-500">
                Submitted on {new Date(data.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button
            onClick={() => updateStatus('REJECTED')}
            disabled={actionLoading}
            className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-50">
            <XCircle size={16} /> {actionLoading ? 'Loading...' : 'Reject'}
          </button>
          <button
            onClick={() => updateStatus('APPROVED')}
            disabled={actionLoading}
            className="flex-1 md:flex-none px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50">
            <CheckCircle size={16} /> {actionLoading ? 'Loading...' : 'Approve'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Travel Info */}
          <SectionCard title="Travel Information" icon={Plane}>
            <DetailRow
              label="Passport Number"
              value={data.passport_number}
              highlight
            />
            <DetailRow label="Nationality" value={data.nationality} />
            {data.has_other_nationalities && (
              <DetailRow
                label="Other Nationalities"
                value={data.other_nationalities}
              />
            )}
            <DetailRow
              label="Intended Arrival Date"
              value={data.arrival_date}
            />

            <div className="mt-6 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Attached Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {passportCopy && (
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          Passport Copy
                        </p>
                        <p className="text-xs text-slate-500">
                          {passportCopy.file_path || 'Document'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(
                          passportCopy.id,
                          `Passport_Copy_${data.application_no || data.id}`,
                        )
                      }
                      className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0">
                      <Download size={18} />
                    </button>
                  </div>
                )}
                {personalPhoto && (
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                        <User size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          Personal Photo
                        </p>
                        <p className="text-xs text-slate-500">
                          {personalPhoto.file_path || 'Image'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(
                          personalPhoto.id,
                          `Personal_Photo_${data.application_no || data.id}`,
                        )
                      }
                      className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0">
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Personal Info */}
          <SectionCard title="Personal Details" icon={User}>
            <DetailRow label="Full Name" value={data.full_name} />
            <DetailRow label="Date of Birth" value={data.date_of_birth} />
            <DetailRow label="Email Address" value={data.email} />
            <DetailRow
              label="Phone Number"
              value={`${data.phone_code} ${data.phone_number}`}
            />
          </SectionCard>

          {/* Address */}
          <SectionCard title="Home Address" icon={MapPin}>
            <DetailRow
              label="Street"
              value={`${data.building_no} ${data.street_name}`}
            />
            <DetailRow label="Apartment/Unit" value={data.apartment} />
            <DetailRow label="Area" value={data.area} />
            <DetailRow label="City" value={data.town_city} />
            <DetailRow label="Postal Code" value={data.postal_code} />
            <DetailRow label="Country" value={data.country} />
          </SectionCard>

          {/* Employment & Security */}
          <SectionCard title="Background & Employment" icon={Shield}>
            <DetailRow
              label="Employment Status"
              value={data.has_job ? 'Employed' : 'Unemployed'}
            />
            <DetailRow label="Job Title" value={data.job_title} />
            <div className="my-4 h-px bg-slate-100" />
            <DetailRow
              label="Criminal Record?"
              value={formatBool(data.has_criminal_record)}
              highlight
            />
            {data.has_criminal_record && (
              <DetailRow
                label="Criminal Details"
                value={data.criminal_details}
              />
            )}
            <DetailRow
              label="Terrorism Involvement?"
              value={formatBool(data.has_involvement)}
              highlight
            />
            {data.has_involvement && (
              <DetailRow
                label="Involvement Details"
                value={data.involvement_details}
              />
            )}
          </SectionCard>

          {/* Declarations */}
          <SectionCard title="Declarations & Consent" icon={CheckCircle}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div
                  className={`p-1.5 rounded-full ${data.confirm_info_declaration ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <CheckCircle size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Information Accuracy
                  </p>
                  <p className="text-xs text-slate-500">
                    Confirmed all provided details are correct
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div
                  className={`p-1.5 rounded-full ${data.accept_terms_declaration ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <CheckCircle size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Terms & Conditions
                  </p>
                  <p className="text-xs text-slate-500">
                    Accepted legal terms and privacy policy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div
                  className={`p-1.5 rounded-full ${data.confirm_processing_time_declaration ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <CheckCircle size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Processing Time
                  </p>
                  <p className="text-xs text-slate-500">
                    Acknowledged visa processing duration
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column (Meta & Actions) */}
        <div className="space-y-6">
          {/* Payment Info */}
          <SectionCard title="Payment Details" icon={CreditCard}>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-slate-900">£97.00</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 ${
                  data.payment_status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                {data.payment_status || 'PAID'}
              </span>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Reference</span>
                <span className="font-mono text-slate-900">
                  {data.application_no || data.id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">
                  {new Date(data.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="text-slate-900">Credit Card (Simulation)</span>
              </div>
            </div>
          </SectionCard>

          {/* Timeline / History (Placeholder) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">History Log</h3>
            <div className="space-y-6 relative pl-4 border-l border-slate-100">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
                <p className="text-sm font-medium text-slate-900">
                  Application Submitted
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Feb 12, 10:30 AM
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                <p className="text-sm font-medium text-slate-900">
                  Payment Successful
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Feb 12, 10:32 AM
                </p>
              </div>
              <div className="relative opacity-50">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-200 rounded-full border-2 border-white shadow-sm" />
                <p className="text-sm font-medium text-slate-900">
                  Admin Review
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

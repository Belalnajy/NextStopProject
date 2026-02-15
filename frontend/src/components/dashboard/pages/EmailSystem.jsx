import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../api';
import { motion } from 'framer-motion';
import {
  Send,
  Save,
  Settings,
  Server,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function EmailSystem() {
  const [activeTab, setActiveTab] = useState('approval'); // 'approval' or 'rejection'
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/email/templates');
      setTemplates(response.data);
    } catch (err) {
      console.error('Failed to fetch templates', err);
    } finally {
      setLoading(false);
    }
  };

  const currentTemplate = templates.find((t) => t.type === activeTab) || {
    subject: '',
    body: '',
  };

  const handleUpdateTemplate = (field, value) => {
    setTemplates((prev) =>
      prev.map((t) => (t.type === activeTab ? { ...t, [field]: value } : t)),
    );
  };

  const saveTemplate = async () => {
    if (!currentTemplate.id) return;
    try {
      setSaving(true);
      await api.patch(`/email/templates/${currentTemplate.id}`, {
        subject: currentTemplate.subject,
        body: currentTemplate.body,
      });
      toast.success('Template saved successfully');
    } catch (err) {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    const email = prompt('Enter email address for test:');
    if (!email) return;
    try {
      setTesting(true);
      await api.post('/email/test', {
        to: email,
        type: activeTab,
        data: {
          customer_name: 'Test User',
          application_id: 'APP-TEST-123',
          arrival_date: '2024-12-25',
        },
      });
      toast.success('Test email sent!');
    } catch (err) {
      toast.error(
        'Failed to send test email. Check your .env SMTP settings on backend.',
      );
    } finally {
      setTesting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading email system...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email System</h1>
          <p className="text-slate-500">
            Configure SMTP settings and manage email templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Server size={100} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              SMTP Status
            </h3>
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <ShieldCheck size={18} />
              <span className="font-medium text-sm">Active & Secure</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your email system uses backend .env configuration.
            </p>
            <button
              onClick={sendTestEmail}
              disabled={testing}
              className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {testing ? <Loader2 className="animate-spin" size={16} /> : null}
              Send Test Email
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">Backend Configuration</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              SMTP settings (Host, Port, User, Pass) are managed via the
              server's `.env` file for security. Please update the server
              environment variables if you need to change your email provider.
            </p>
          </div>
        </div>

        {/* Right Column - Templates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="border-b border-slate-200 flex">
              <button
                onClick={() => setActiveTab('approval')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'approval' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                Approval Template
              </button>
              <button
                onClick={() => setActiveTab('rejection')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'rejection' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                Rejection Template
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={currentTemplate.subject}
                  onChange={(e) =>
                    handleUpdateTemplate('subject', e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="flex-1 flex flex-col mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message Body
                </label>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-800 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                  <textarea
                    className="w-full h-full bg-transparent border-none outline-none resize-none"
                    placeholder="Type your email content here..."
                    value={currentTemplate.body}
                    onChange={(e) =>
                      handleUpdateTemplate('body', e.target.value)
                    }
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Available variables: {'{customer_name}'}, {'{application_id}'}
                  , {'{arrival_date}'}
                </p>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <button
                    onClick={saveTemplate}
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

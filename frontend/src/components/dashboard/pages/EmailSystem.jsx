import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../api';
import {
  Send,
  Save,
  Server,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  Code,
  Type,
} from 'lucide-react';

// Helper: extract visible text sections from our email HTML template
function extractTextSections(html) {
  if (!html) return { heading: '', subtitle: '', paragraphs: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Get the main content td (the one with 40px padding, white bg)
  const heading = doc.querySelector('h2')?.innerHTML || '';
  const subtitle =
    doc.querySelectorAll('td[style*="background-color:#ffffff"] > p')?.[0]
      ?.innerHTML || '';

  // Get body paragraphs — they are the <p> elements AFTER the data table div
  const allParagraphs = doc.querySelectorAll(
    'td[style*="background-color:#ffffff"] > p',
  );
  const paragraphs = [];
  let foundSubtitle = false;
  allParagraphs.forEach((p) => {
    if (!foundSubtitle) {
      foundSubtitle = true; // skip subtitle
      return;
    }
    paragraphs.push(p.innerHTML);
  });

  return { heading, subtitle, paragraphs };
}

// Helper: rebuild the HTML template with updated text sections
function rebuildHtml(html, sections) {
  if (!html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const h2 = doc.querySelector('h2');
  if (h2) h2.innerHTML = sections.heading;

  const allParagraphs = doc.querySelectorAll(
    'td[style*="background-color:#ffffff"] > p',
  );
  let idx = 0;
  allParagraphs.forEach((p) => {
    if (idx === 0) {
      p.innerHTML = sections.subtitle;
    } else if (idx - 1 < sections.paragraphs.length) {
      p.innerHTML = sections.paragraphs[idx - 1];
    }
    idx++;
  });

  return doc.documentElement.outerHTML;
}

export default function EmailSystem() {
  const [activeTab, setActiveTab] = useState('APPLICATION_APPROVED');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // 'preview', 'edit', 'code'
  const iframeRef = useRef(null);

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
    body_html: '',
  };

  // Extract text sections for the edit mode
  const textSections = useMemo(
    () => extractTextSections(currentTemplate.body_html),
    [currentTemplate.body_html],
  );

  // Replace template variables with sample data for preview
  const getPreviewHtml = () => {
    let html = currentTemplate.body_html || '';
    const sampleData = {
      name: 'Ahmed Mohamed',
      appNo: 'APP-2026-0042',
      status: activeTab === 'APPLICATION_APPROVED' ? 'APPROVED' : 'REJECTED',
    };
    Object.keys(sampleData).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, sampleData[key]);
    });
    return html;
  };

  // Update iframe content
  useEffect(() => {
    if (viewMode === 'preview' && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(getPreviewHtml());
        doc.close();
      }
    }
  }, [currentTemplate.body_html, viewMode, activeTab]);

  const handleUpdateTemplate = (field, value) => {
    setTemplates((prev) =>
      prev.map((t) => (t.type === activeTab ? { ...t, [field]: value } : t)),
    );
  };

  // Update a specific text section and rebuild HTML
  const handleUpdateSection = (sectionKey, value, paragraphIndex) => {
    const updated = { ...textSections };
    if (sectionKey === 'heading') {
      updated.heading = value;
    } else if (sectionKey === 'subtitle') {
      updated.subtitle = value;
    } else if (sectionKey === 'paragraph') {
      updated.paragraphs = [...updated.paragraphs];
      updated.paragraphs[paragraphIndex] = value;
    }
    const newHtml = rebuildHtml(currentTemplate.body_html, updated);
    handleUpdateTemplate('body_html', newHtml);
  };

  const saveTemplate = async () => {
    if (!currentTemplate.id) return;
    try {
      setSaving(true);
      await api.put(`/email/templates/${currentTemplate.id}`, {
        subject: currentTemplate.subject,
        body_html: currentTemplate.body_html,
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
      await api.post('/email/test-send', {
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
              {testing ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
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
              server's <code className="bg-slate-100 px-1 rounded">.env</code>{' '}
              file for security.
            </p>
          </div>

          {/* Available Variables */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Available Variables
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Use these in your text to auto-fill applicant data:
            </p>
            <div className="space-y-2">
              {[
                { var: '{{name}}', desc: 'Applicant full name' },
                { var: '{{appNo}}', desc: 'Application number' },
                { var: '{{status}}', desc: 'Current status' },
              ].map((v) => (
                <div key={v.var} className="flex items-center gap-2">
                  <code className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs font-mono font-bold">
                    {v.var}
                  </code>
                  <span className="text-xs text-slate-500">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Templates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[700px]">
            {/* Template Tabs */}
            <div className="border-b border-slate-200 flex">
              <button
                onClick={() => setActiveTab('APPLICATION_APPROVED')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'APPLICATION_APPROVED' ? 'border-green-500 text-green-700 bg-green-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                ✅ Approval Template
              </button>
              <button
                onClick={() => setActiveTab('APPLICATION_REJECTED')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'APPLICATION_REJECTED' ? 'border-red-500 text-red-700 bg-red-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                ❌ Rejection Template
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {/* Subject */}
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

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Message Body
                </label>
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Eye size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Type size={14} />
                    Edit Text
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Code size={14} />
                    HTML
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 mb-4 min-h-[400px]">
                {viewMode === 'preview' && (
                  <div className="h-full border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                    <iframe
                      ref={iframeRef}
                      title="Email Preview"
                      className="w-full h-full min-h-[400px] bg-white"
                      sandbox="allow-same-origin"
                      style={{ border: 'none' }}
                    />
                  </div>
                )}

                {viewMode === 'edit' && (
                  <div className="h-full border border-slate-200 rounded-lg bg-white p-6 space-y-5 overflow-auto">
                    {/* Heading */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Email Heading
                      </label>
                      <input
                        type="text"
                        value={textSections.heading}
                        onChange={(e) =>
                          handleUpdateSection('heading', e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-lg font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="e.g. Application Approved!"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={textSections.subtitle}
                        onChange={(e) =>
                          handleUpdateSection('subtitle', e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="e.g. Congratulations, your visa application has been approved."
                      />
                    </div>

                    <hr className="border-slate-100" />

                    {/* Body Paragraphs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Body Paragraphs
                      </label>
                      <p className="text-xs text-slate-400 mb-3">
                        You can use{' '}
                        <code className="bg-primary/5 text-primary px-1 rounded">
                          {'{{name}}'}
                        </code>{' '}
                        and{' '}
                        <code className="bg-primary/5 text-primary px-1 rounded">
                          {'{{appNo}}'}
                        </code>{' '}
                        in your text. Use{' '}
                        <code className="bg-slate-100 px-1 rounded">
                          {'<strong>text</strong>'}
                        </code>{' '}
                        for <strong>bold</strong>.
                      </p>
                      <div className="space-y-3">
                        {textSections.paragraphs.map((p, i) => (
                          <textarea
                            key={i}
                            value={p}
                            onChange={(e) =>
                              handleUpdateSection(
                                'paragraph',
                                e.target.value,
                                i,
                              )
                            }
                            rows={2}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            placeholder={`Paragraph ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === 'code' && (
                  <div className="h-full bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-auto">
                    <textarea
                      className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none font-mono text-sm text-green-400 leading-relaxed"
                      placeholder="Type your email HTML template here..."
                      value={currentTemplate.body_html}
                      onChange={(e) =>
                        handleUpdateTemplate('body_html', e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  {viewMode === 'preview' &&
                    '📧 This is how the email will look to recipients'}
                  {viewMode === 'edit' &&
                    '✏️ Edit the text content — the design stays the same'}
                  {viewMode === 'code' &&
                    '⚙️ Advanced: Edit the raw HTML template code'}
                </p>
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

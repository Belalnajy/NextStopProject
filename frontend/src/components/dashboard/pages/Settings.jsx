import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../../context/SettingsContext';
import api from '../../../api';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Lock,
  Bell,
  Shield,
  Power,
  Image as ImageIcon,
  Layout,
  Type,
  Upload,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon,
  Info,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

// --- Tab Components ---

const GeneralTab = ({ settings, updateSettings }) => (
  <div className="space-y-8">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Globe size={20} className="text-slate-400" />
        Branding & Identity
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Website Name
          </label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => updateSettings('site_name', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 overflow-hidden">
              {settings.logo_url || settings.logoPreview ? (
                <img
                  src={settings.logoPreview || settings.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon size={24} />
              )}
            </div>
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  updateSettings('logoFile', file);
                  updateSettings('logoPreview', previewUrl);
                }
              }}
            />
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Upload New Logo
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Power size={20} className="text-slate-400" />
        Site Controls
      </h3>
      <div className="space-y-4">
        {[
          {
            key: 'maintenance_mode',
            label: 'Maintenance Mode',
            desc: 'Show maintenance screen to visitors',
          },
          {
            key: 'registration_closed',
            label: 'Close Registrations',
            desc: 'Disable new applications',
          },
          {
            key: 'email_notifs',
            label: 'Email Notifications',
            desc: 'Receive updates on new applications',
          },
          {
            key: 'seo_indexing',
            label: 'SEO Indexing',
            desc: 'Allow search engines to index site',
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <span className="font-semibold text-slate-900 block">
                {item.label}
              </span>
              <span className="text-xs text-slate-500">{item.desc}</span>
            </div>
            <button
              onClick={() => updateSettings(item.key, !settings[item.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                settings[item.key] ? 'bg-primary' : 'bg-slate-200'
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HomePageTab = ({
  settings,
  updateSettings,
  onUploadHero,
  onRemoveHero,
}) => (
  <div className="space-y-8">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Type size={20} className="text-slate-400" />
        Hero Section Content
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Main Headline
          </label>
          <input
            type="text"
            value={settings.hero_title || ''}
            onChange={(e) => updateSettings('hero_title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subtitle
          </label>
          <textarea
            rows="3"
            value={settings.hero_subtitle || ''}
            onChange={(e) => updateSettings('hero_subtitle', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon size={20} className="text-slate-400" />
          Hero Slideshow Images
        </h3>
        <label className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark cursor-pointer">
          <Plus size={16} /> Add Image
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUploadHero}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {settings.hero_images &&
          settings.hero_images.map((imgUrl, i) => (
            <div
              key={i}
              className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={imgUrl}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onRemoveHero(i)}
                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        <label className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
          <Plus size={24} />
          <span className="text-xs font-medium mt-2">Add New</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUploadHero}
          />
        </label>
      </div>
    </div>
  </div>
);

const AboutTab = ({ settings, updateSettings }) => (
  <div className="space-y-8">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Info size={20} className="text-slate-400" />
        About Us Content
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Headline / Title
          </label>
          <input
            type="text"
            value={settings.about_title}
            onChange={(e) => updateSettings('about_title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mission Statement / Content
          </label>
          <textarea
            rows="6"
            value={settings.about_mission}
            onChange={(e) => updateSettings('about_mission', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Type size={20} className="text-slate-400" />
        Company Statistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { key: 'stats_travelers', label: 'Travelers Assisted' },
          { key: 'stats_support', label: 'Support Available' },
          { key: 'stats_approval', label: 'Approval Rate' },
        ].map((stat) => (
          <div key={stat.key}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {stat.label}
            </label>
            <input
              type="text"
              value={settings[stat.key]}
              onChange={(e) => updateSettings(stat.key, e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactTab = ({ settings, updateSettings }) => (
  <div className="space-y-8">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Phone size={20} className="text-slate-400" />
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) => updateSettings('contact_email', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={settings.contact_phone}
            onChange={(e) => updateSettings('contact_phone', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Office Address
          </label>
          <textarea
            rows="3"
            value={settings.contact_address}
            onChange={(e) => updateSettings('contact_address', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MapPin size={20} className="text-slate-400" />
        Map Location
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Latitude
          </label>
          <input
            type="text"
            value={settings.map_lat}
            onChange={(e) => updateSettings('map_lat', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Longitude
          </label>
          <input
            type="text"
            value={settings.map_lng}
            onChange={(e) => updateSettings('map_lng', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>
    </div>
  </div>
);

const FooterTab = ({ settings, updateSettings }) => {
  const handleLinkChange = (index, field, value) => {
    const newLinks = [...(settings.quick_links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateSettings('quick_links', newLinks);
  };

  const addLink = () => {
    updateSettings('quick_links', [
      ...(settings.quick_links || []),
      { label: '', url: '' },
    ]);
  };

  const removeLink = (index) => {
    const newLinks = (settings.quick_links || []).filter((_, i) => i !== index);
    updateSettings('quick_links', newLinks);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Layout size={20} className="text-slate-400" />
        Footer Content
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Copyright Text
          </label>
          <input
            type="text"
            value={settings.copyright_text || ''}
            onChange={(e) => updateSettings('copyright_text', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <LinkIcon size={16} className="text-slate-400" /> Quick Links
          </h4>
          <div className="space-y-3">
            {settings.quick_links &&
              settings.quick_links.map((link, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Label (e.g. About Us)"
                    value={link.label}
                    onChange={(e) =>
                      handleLinkChange(i, 'label', e.target.value)
                    }
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. /about)"
                    value={link.url}
                    onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => removeLink(i)}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            <button
              onClick={addLink}
              className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-primary hover:text-primary transition-colors">
              + Add Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (Tabs and Tab Components)

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    site_name: '',
    logo_url: '',
    maintenance_mode: false,
    registration_closed: false,
    email_notifs: true,
    seo_indexing: true,
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    map_lat: '',
    map_lng: '',
    hero_title: '',
    hero_subtitle: '',
    hero_images: [],
    about_title: '',
    about_mission: '',
    stats_travelers: '',
    stats_support: '',
    stats_approval: '',
    copyright_text: '',
    quick_links: [],
  });

  const { refreshSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      setSettings({
        ...response.data,
        hero_images: response.data.hero_images || [],
        quick_links: response.data.quick_links || [],
      });
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Fields managed by the backend, never send from frontend
      const excludeKeys = [
        'logoFile',
        'logoPreview',
        'logo_url',
        'id',
        'updated_at',
        'hero_images', // Handled separately or via JSON string
        'quick_links', // Handled as JSON string
      ];

      // Append all text settings
      Object.entries(settings).forEach(([key, value]) => {
        if (
          !excludeKeys.includes(key) &&
          value !== null &&
          value !== undefined
        ) {
          formData.append(key, value);
        }
      });

      // Append complex objects as JSON strings
      formData.append('hero_images', JSON.stringify(settings.hero_images));
      formData.append('quick_links', JSON.stringify(settings.quick_links));

      // Append logo file if edited
      if (settings.logoFile) {
        formData.append('logo', settings.logoFile);
      }

      const response = await api.patch('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Settings updated successfully');

      // Update local state with response to ensure sync
      setSettings((prev) => ({
        ...prev,
        ...response.data.settings,
        logoFile: null,
        logoPreview: null,
      }));

      await refreshSettings(); // Refresh global site context
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/settings/upload-hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newImages = [...(settings.hero_images || []), response.data.url];
      updateSettings('hero_images', newImages);
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handleHeroRemove = (index) => {
    const newImages = settings.hero_images.filter((_, i) => i !== index);
    updateSettings('hero_images', newImages);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading settings...
      </div>
    );

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'footer', label: 'Footer', icon: LinkIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Content Management
          </h1>
          <p className="text-slate-500">
            Manage your website content, branding, and settings.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              {activeTab === 'general' && (
                <GeneralTab
                  settings={settings}
                  updateSettings={updateSettings}
                />
              )}
              {activeTab === 'home' && (
                <HomePageTab
                  settings={settings}
                  updateSettings={updateSettings}
                  onUploadHero={handleHeroUpload}
                  onRemoveHero={handleHeroRemove}
                />
              )}
              {activeTab === 'about' && (
                <AboutTab settings={settings} updateSettings={updateSettings} />
              )}
              {activeTab === 'contact' && (
                <ContactTab
                  settings={settings}
                  updateSettings={updateSettings}
                />
              )}
              {activeTab === 'footer' && (
                <FooterTab
                  settings={settings}
                  updateSettings={updateSettings}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

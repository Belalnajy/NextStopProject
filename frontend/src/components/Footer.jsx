import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Lock, // Added Lock icon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  const quickLinksURLs = ['/', '/about', '/#requirements', '/#contact'];
  const quickLinks = [
    t('nav.home'),
    t('nav.about'),
    t('nav.eligibility'),
    t('nav.contact'),
  ];

  const legalLinks = [
    { label: t('footer.legal_links.terms'), url: '/terms' },
    { label: t('footer.legal_links.privacy'), url: '/privacy' },
    { label: t('footer.legal_links.cookie'), url: '/cookie' },
    { label: t('footer.legal_links.refund'), url: '/refund' },
    { label: t('footer.legal_links.support'), url: '/contact' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <footer
      id="contact"
      className="bg-linear-to-b from-white to-slate-50 pt-24 pb-12 border-t border-slate-100 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <motion.div
            className="col-span-1 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-8">
              {settings?.logo_url ? (
                <motion.img
                  src={settings.logo_url}
                  alt={settings?.site_name || 'NextStop Visa'}
                  className="h-12 w-auto"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              )}
              <span className="font-display font-bold text-xl text-primary">
                {settings?.site_name || 'NextStop Visa'}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">
              {t('footer.brand_desc')}
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social, i) => (
                <motion.div
                  key={social.label}
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-linear-to-br hover:from-primary hover:to-primary-light hover:text-white cursor-pointer transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}>
                  <social.icon size={18} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}>
            <h4 className="font-bold text-primary mb-8 text-lg">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3 text-gray-600">
              {quickLinks.map((label, i) => (
                <motion.li key={quickLinksURLs[i]} variants={itemVariants}>
                  <Link
                    to={quickLinksURLs[i]}
                    className="hover:text-primary font-medium flex items-center gap-2 group transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}>
            <h4 className="font-bold text-primary mb-8 text-lg">
              {t('footer.legal_support')}
            </h4>
            <ul className="space-y-3 text-gray-600">
              {legalLinks.map((link) => (
                <motion.li key={link.url} variants={itemVariants}>
                  <a
                    href={link.url}
                    className="hover:text-primary font-medium flex items-center gap-2 group transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            <h4 className="font-bold text-primary mb-8 text-lg">
              {t('footer.contact')}
            </h4>
            <div className="space-y-6">
              <motion.div
                className="flex gap-4 items-start text-gray-600 group cursor-pointer"
                whileHover={{ x: 5 }}>
                <div className="p-3 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl text-primary group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary mb-1">
                    {t('footer.email_support')}
                  </p>
                  <a
                    href={`mailto:${settings?.contact_email || 'support@nextstopvisa.com'}`}
                    className="hover:text-accent transition-colors">
                    {settings?.contact_email || 'support@nextstopvisa.com'}
                  </a>
                </div>
              </motion.div>
              <motion.div
                className="flex gap-4 items-start text-gray-600 group cursor-pointer"
                whileHover={{ x: 5 }}>
                <div className="p-3 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl text-primary group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary mb-1">
                    {t('footer.office_location')}
                  </p>
                  <p className="whitespace-pre-line">{t('footer.address')}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="border-t border-slate-100 pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <div className="bg-linear-to-r from-slate-50 to-white border border-slate-100 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-sm">
            <motion.div
              className="p-4 bg-white rounded-2xl shadow-sm text-primary"
              whileHover={{ scale: 1.1, rotate: 5 }}>
              <ShieldAlert size={28} />
            </motion.div>
            <div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-4">
                <span className="text-primary font-bold">
                  {t('footer.disclaimer_title')}:
                </span>{' '}
                {t('footer.disclaimer')}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 font-medium">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-6 items-center">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-wider group">
                <Lock
                  size={12}
                  strokeWidth={2.5}
                  className="group-hover:text-primary transition-colors"
                />
                {t('footer.admin')}
              </Link>
              <motion.a
                href="#"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors font-bold uppercase tracking-wider"
                whileHover={{ y: -2 }}>
                {t('footer.system_status')}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

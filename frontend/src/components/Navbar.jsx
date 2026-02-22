import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
    // Set text direction
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  // Use dark header style if scrolled OR if not on home page
  const isDarkHeader = isScrolled || location.pathname !== '/';

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.eligibility'), href: '/#requirements' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const linkVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isDarkHeader
          ? 'bg-white/80 backdrop-blur-xl py-3 shadow-lg shadow-primary/5'
          : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo_url ? (
              <motion.img
                src={settings.logo_url}
                alt={settings?.site_name || 'NextStop Visa'}
                className="h-14 w-auto"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">N</span>
              </div>
            )}
            <motion.span
              className={`font-display font-bold text-2xl transition-colors duration-300 ${
                isDarkHeader ? 'text-primary' : 'text-white'
              }`}
              whileHover={{ scale: 1.02 }}>
              {settings?.site_name || 'NextStop Visa'}
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                variants={linkVariants}
                whileHover="hover"
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  isDarkHeader
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}>
                {link.name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-3/4 rounded-full`}
                />
              </motion.a>
            ))}

            {/* Language Switcher */}
            <div className="relative mx-4">
              <motion.button
                onClick={() => setIsLangOpen(!isLangOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isDarkHeader
                    ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}>
                <Globe size={18} />
                <span className="text-xs font-bold uppercase">
                  {i18n.language.split('-')[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}
                />
              </motion.button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsLangOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20">
                      <div className="py-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-primary/5 ${
                              i18n.language === lang.code
                                ? 'text-primary font-bold bg-primary/5'
                                : 'text-gray-600'
                            }`}>
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/apply">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(212, 175, 110, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-7 py-2.5 rounded-full text-sm font-bold shadow-lg group">
                <span className="relative z-10 flex items-center gap-2">
                  {t('nav.apply')}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isDarkHeader
                ? 'text-primary hover:bg-primary/10'
                : 'text-white hover:bg-white/10'
            }`}
            whileTap={{ scale: 0.9 }}>
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden shadow-xl">
            <div className="px-6 py-8 space-y-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {languages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      i18n.language === lang.code
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100'
                    }`}>
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="col-span-2 text-primary text-xs font-bold text-center py-2 underline">
                  Show all languages
                </button>
              </div>

              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  custom={index}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group">
                  {link.name}
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all"
                  />
                </motion.a>
              ))}
              <motion.div
                custom={navLinks.length}
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
                className="pt-4">
                <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-linear-to-r from-primary to-primary-light text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl transition-shadow flex items-center justify-center gap-2">
                    {t('nav.apply')}
                    <ChevronRight size={20} />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

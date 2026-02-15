import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Home,
  Mail,
  Copy,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Step7_Success = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const referenceNumber = `${t('form.step7.labels.refPrefix')}${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confettiColors = [
    '#d4af6e',
    '#1a2f6b',
    '#e5c88a',
    '#2a4a9a',
    '#22c55e',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-center py-10 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: confettiColors[i % confettiColors.length],
              left: `${Math.random() * 100}%`,
              top: '-20px',
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: 400,
              opacity: [1, 1, 0],
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              x: (Math.random() - 0.5) * 100,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        className="relative w-28 h-28 mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
        <motion.div
          className="absolute inset-0 bg-green-400/20 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 bg-green-400/30 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <div className="absolute inset-4 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}>
            <CheckCircle2 className="text-white w-12 h-12" />
          </motion.div>
        </div>
      </motion.div>

      {/* Celebration Icon */}
      <motion.div
        className="absolute top-8 right-1/4 text-accent"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}>
        <PartyPopper size={28} />
      </motion.div>

      <motion.h2
        className="text-3xl md:text-4xl font-display font-bold text-primary mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        {t('form.step7.title')}
      </motion.h2>

      <motion.p
        className="text-gray-600 text-lg max-w-md mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        {t('form.step7.subtitle')}
      </motion.p>

      {/* Reference Box */}
      <motion.div
        className="p-6 bg-linear-to-r from-slate-50 to-white rounded-2xl max-w-sm mx-auto mb-10 border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <p className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-1">
          <Mail size={14} />
          {t('form.step7.labels.reference')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-xl font-mono font-bold text-primary tracking-wider">
            {referenceNumber}
          </p>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-gray-100 hover:bg-accent/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            <Copy
              size={16}
              className={copied ? 'text-green-600' : 'text-gray-500'}
            />
          </motion.button>
        </div>
        {copied && (
          <motion.p
            className="text-xs text-green-600 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}>
            {t('form.step7.status.copied')}
          </motion.p>
        )}
      </motion.div>

      {/* What's Next */}
      <motion.div
        className="max-w-md mx-auto mb-10 p-4 bg-primary/5 rounded-2xl border border-primary/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <h4 className="font-semibold text-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles size={16} />
          {t('form.step7.labels.whatsNext.title')}
        </h4>
        <ul className="text-sm text-gray-600 text-left space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">
              1
            </span>
            <span>{t('form.step7.labels.whatsNext.step1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">
              2
            </span>
            <span>{t('form.step7.labels.whatsNext.step2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">
              3
            </span>
            <span>{t('form.step7.labels.whatsNext.step3')}</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <Link to="/">
          <motion.button
            className="relative overflow-hidden bg-linear-to-r from-primary to-primary-light text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 group"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(26, 47, 107, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}>
            <span className="relative z-10 flex items-center gap-2">
              <Home size={18} />
              {t('form.step7.labels.returnHome')}
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Step7_Success;

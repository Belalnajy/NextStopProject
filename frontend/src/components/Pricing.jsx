import { motion } from 'framer-motion';
import {
  Receipt,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { FEES } from '../config/pricing';

const Pricing = () => {
  const { t } = useTranslation();
  const { format, formatBase, isConverted, currency } = useCurrency();

  const includedItems = [
    t('pricing.included.item1'),
    t('pricing.included.item2'),
    t('pricing.included.item3'),
    t('pricing.included.item4'),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section
      id="pricing"
      className="py-28 bg-linear-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <motion.div
        className="absolute top-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            {t('pricing.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            {t('pricing.title')}{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-light">
              {t('pricing.title_highlight')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed">
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Pricing Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <motion.div
            variants={itemVariants}
            className="relative bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-accent/20 via-primary/10 to-accent/20 rounded-[2.5rem] blur-2xl opacity-60 pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-5">
              {/* Left: Breakdown */}
              <div className="lg:col-span-3 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Receipt className="text-white" size={22} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    {t('pricing.breakdown_title')}
                  </h3>
                </div>

                {/* Fee rows */}
                <div className="space-y-4 mb-8">
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">
                        {t('pricing.gov_fee_title')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('pricing.gov_fee_desc')}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800 whitespace-nowrap ms-4">
                      {format(FEES.government)}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">
                        {t('pricing.service_fee_title')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('pricing.service_fee_desc')}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800 whitespace-nowrap ms-4">
                      {format(FEES.service)}
                    </div>
                  </motion.div>
                </div>

                {/* Included items */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    {t('pricing.included_title')}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includedItems.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="flex items-start gap-2 text-gray-700 text-sm">
                        <CheckCircle2
                          className="text-accent shrink-0 mt-0.5"
                          size={18}
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Total & CTA */}
              <div className="lg:col-span-2 p-8 md:p-12 bg-linear-to-br from-primary to-primary-dark text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decorative circle */}
                <motion.div
                  className="absolute -top-16 -right-16 w-56 h-56 bg-accent/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="text-sm font-semibold uppercase tracking-wider text-accent/90 mb-3">
                    {t('pricing.total_title')}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <motion.span
                      className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-light"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                      {format(FEES.total)}
                    </motion.span>
                  </div>
                  {isConverted && (
                    <p className="text-blue-100/70 text-xs mb-3">
                      {t('currency.charged_in_eur', {
                        amount: formatBase(FEES.total),
                        currency,
                        defaultValue:
                          'Approximate price. You will be charged {{amount}} at checkout.',
                      })}
                    </p>
                  )}
                  <p className="text-blue-100/70 text-sm leading-relaxed mb-8">
                    {t('pricing.total_desc')}
                  </p>

                  <Link to="/apply" className="block">
                    <motion.button
                      whileHover={{
                        scale: 1.03,
                        boxShadow: '0 20px 40px rgba(212, 175, 110, 0.4)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-linear-to-r from-accent to-accent-light text-primary px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group">
                      {t('pricing.cta')}
                      <ArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={18}
                      />
                    </motion.button>
                  </Link>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-blue-100/80">
                    <ShieldCheck size={16} className="text-accent" />
                    {t('pricing.trust_secure')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-100/80">
                    <Lock size={16} className="text-accent" />
                    {t('pricing.trust_encrypted')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Note */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-500 mt-6">
            {t('pricing.note')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

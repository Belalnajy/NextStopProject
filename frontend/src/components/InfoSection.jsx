import { motion } from 'framer-motion';
import { PlaneTakeoff, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const InfoSection = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const features = [
    {
      icon: PlaneTakeoff,
      title: t('info.card1_title'),
      description: t('info.card1_desc'),
      color: 'from-blue-500 to-primary',
    },
    {
      icon: ShieldCheck,
      title: t('info.card2_title'),
      description: t('info.card2_desc'),
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Cpu,
      title: t('info.card3_title'),
      description: t('info.card3_desc'),
      color: 'from-accent to-amber-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            {t('nav.about')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            {settings?.about_title || t('info.title')}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-1 bg-linear-to-r from-accent to-accent-light mx-auto mb-8 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.about_mission || t('info.subtitle')}
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative p-8 rounded-3xl bg-linear-to-b from-slate-50 to-white border border-slate-100 hover:border-accent/30 transition-all duration-500"
              whileHover={{
                y: -8,
                boxShadow: '0 25px 50px rgba(26, 47, 107, 0.12)',
              }}>
              {/* Gradient Border on Hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-linear-to-r from-accent/20 via-primary/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{ padding: '1px' }}
              />

              {/* Icon Container */}
              <motion.div
                className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}>
                <feature.icon className="text-white" size={28} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <motion.div
                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}>
                <ArrowRight className="text-accent" size={20} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}>
          <Link to="/eligibility">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 15px 40px rgba(26, 47, 107, 0.25)',
              }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-linear-to-r from-primary to-primary-light text-white px-10 py-4 rounded-full font-bold shadow-xl group">
              <span className="relative z-10 flex items-center gap-2">
                {t('nav.eligibility')}
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-primary-light to-primary"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;

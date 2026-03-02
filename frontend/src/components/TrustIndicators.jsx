import { motion } from 'framer-motion';
import { Users, Clock, Award, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const TrustIndicators = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const stats = [
    {
      icon: Users,
      value: settings?.stats_travelers || '50K+',
      label: t('home.trust.travelers'),
      color: 'from-blue-500 to-primary',
    },
    {
      icon: Clock,
      value: settings?.stats_support || '24/7',
      label: t('home.trust.support'),
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Award,
      value: settings?.stats_approval || '99%',
      label: t('home.trust.approval'),
      color: 'from-accent to-amber-500',
    },
    {
      icon: Globe,
      value: settings?.stats_countries || '150+',
      label: t('home.trust.countries'),
      color: 'from-violet-500 to-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section className="py-20 bg-linear-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -mt-48" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -5 }}>
              {/* Glow on hover */}
              <div className="absolute -inset-1 bg-linear-to-r from-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              <div className="relative text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm group-hover:border-accent/30 group-hover:shadow-lg transition-all duration-500">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 mx-auto mb-4 bg-linear-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}>
                  <stat.icon className="text-white" size={26} />
                </motion.div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;

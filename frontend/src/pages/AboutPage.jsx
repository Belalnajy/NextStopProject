import { motion } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Star,
  Users,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const stats = [
    {
      icon: Users,
      value: settings?.stats_travelers || '50K+',
      label: t('about.stats.travelers'),
    },
    {
      icon: Clock,
      value: settings?.stats_support || '24/7',
      label: t('about.stats.support'),
    },
    {
      icon: Award,
      value: settings?.stats_approval || '99%',
      label: t('about.stats.approval'),
    },
  ];

  const features = [
    {
      icon: Globe,
      title: t('about.features.global_title'),
      desc: t('about.features.global_desc'),
    },
    {
      icon: ShieldCheck,
      title: t('about.features.secure_title'),
      desc: t('about.features.secure_desc'),
    },
    {
      icon: Star,
      title: t('about.features.expert_title'),
      desc: t('about.features.expert_desc'),
    },
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
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary via-primary to-primary-dark flex flex-col pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-40 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating Stars */}
      <motion.div
        className="absolute top-1/4 right-1/4 text-accent/30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity }}>
        <Sparkles size={32} />
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold mb-8 w-fit">
            <Award size={14} />
            {t('about.badge')}
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
            <>
              {t('about.title_prefix')} <br />
              <motion.span
                className="relative inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212, 175, 110, 0)',
                    '0 0 40px rgba(212, 175, 110, 0.3)',
                    '0 0 20px rgba(212, 175, 110, 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-light">
                  {t('about.title_highlight')}
                </span>
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-50"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M2.00025 6.99997C25.7535 3.19069 98.7107 -2.13111 197.669 2.58043"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </svg>
              </motion.span>
            </>
          </h1>

          <motion.div
            className="space-y-6 text-lg text-white/80 leading-relaxed max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            <>
              <motion.p
                variants={itemVariants}
                dangerouslySetInnerHTML={{ __html: t('about.mission_p1') }}
              />
              <motion.p
                variants={itemVariants}
                dangerouslySetInnerHTML={{ __html: t('about.mission_p2') }}
              />
              <motion.div
                variants={itemVariants}
                className="p-4 bg-white/5 border-l-4 border-accent rounded-r-xl backdrop-blur-sm">
                <p className="text-sm italic text-white/60">
                  {t('about.mission_disclaimer')}
                </p>
              </motion.div>
              <motion.p variants={itemVariants}>
                {t('about.mission_p3')}
              </motion.p>
            </>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-12 grid grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                whileHover={{ y: -5 }}>
                <stat.icon className="text-accent mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}>
            <Link to="/apply">
              <motion.button
                className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-10 py-5 rounded-full text-xl font-bold shadow-2xl group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 50px rgba(212, 175, 110, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}>
                <span className="relative z-10 flex items-center gap-3">
                  {t('about.cta')}
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Visual Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:w-1/2 relative min-h-[500px] lg:min-h-auto overflow-hidden">
          <motion.img
            src="/hero_2.png"
            alt={t('about.alt_london')}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/30 to-primary lg:bg-linear-to-l lg:from-transparent lg:via-primary/40 lg:to-primary" />

          {/* Feature Cards */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className={`flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:bg-white/20 transition-all ${
                    i === 2 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                  style={{
                    transform: `translateY(${i % 2 === 1 ? '20px' : '0'})`,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}>
                    <feature.icon className="text-accent mb-4" size={36} />
                  </motion.div>
                  <h3 className="text-white font-bold text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

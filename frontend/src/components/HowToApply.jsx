import { motion } from 'framer-motion';
import {
  FileEdit,
  CreditCard,
  MailCheck,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowToApply = () => {
  const { t } = useTranslation();
  const steps = [
    {
      number: '01',
      icon: FileEdit,
      title: t('how_to_apply.step1_title'),
      description: t('how_to_apply.step1_desc'),
    },
    {
      number: '02',
      icon: CreditCard,
      title: t('how_to_apply.step2_title'),
      description: t('how_to_apply.step2_desc'),
    },
    {
      number: '03',
      icon: MailCheck,
      title: t('how_to_apply.step3_title'),
      description: t('how_to_apply.step3_desc'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
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
    <section
      id="process"
      className="py-28 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -mr-64 -mt-64 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full -ml-48 -mb-48 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              {t('how_to_apply.title')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              {t('how_to_apply.step1_title')}
            </motion.h2>
          {/* Removed duplicate description; kept detailed text inside the step card below */}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}>
            <Link to="/apply">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(212, 175, 110, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-2 group">
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.cta_apply')}
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {/* Connecting Line - Desktop Only */}
          <div className="hidden md:block absolute top-1/3 left-[15%] right-[15%] h-0.5">
            <motion.div
              className="h-full bg-linear-to-r from-primary/20 via-accent/40 to-primary/20 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative group">
              {/* Glow Effect */}
              <motion.div className="absolute -inset-1 bg-linear-to-r from-accent/30 via-primary/20 to-accent/30 rounded-4xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              {/* Card */}
              <motion.div
                className="relative bg-white p-10 rounded-3xl h-full shadow-sm border border-slate-100 flex flex-col items-start group-hover:border-accent/30 transition-all duration-500"
                whileHover={{ y: -8 }}>
                {/* Step Number */}
                <motion.span
                  className="text-7xl font-display font-black text-slate-100 absolute top-4 right-8 group-hover:text-accent/20 transition-colors duration-500"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}>
                  {step.number}
                </motion.span>

                {/* Icon */}
                <motion.div
                  className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mb-6 z-10 shadow-xl shadow-primary/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}>
                  <step.icon className="text-white" size={28} />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-primary mb-4 z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed z-10 grow">
                  {step.description}
                </p>

                {/* Check Mark */}
                <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center gap-2 text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={16} />
                  {t('how_to_apply.quick_easy')}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowToApply;

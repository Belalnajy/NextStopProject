import { motion } from 'framer-motion';
import {
  CheckCircle2,
  BookOpen,
  CreditCard,
  Camera,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Requirements = () => {
  const { t } = useTranslation();
  const reqs = [
    {
      icon: BookOpen,
      title: t('requirements.items.passport_title'),
      desc: t('requirements.items.passport_desc'),
    },
    {
      icon: Camera,
      title: t('requirements.items.photo_title'),
      desc: t('requirements.items.photo_desc'),
    },
    {
      icon: Mail,
      title: t('requirements.items.email_title'),
      desc: t('requirements.items.email_desc'),
    },
    {
      icon: CreditCard,
      title: t('requirements.items.payment_title'),
      desc: t('requirements.items.payment_desc'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section id="requirements" className="py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-linear-to-br from-primary via-primary to-primary-dark rounded-[3rem] overflow-hidden shadow-2xl relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#D4AF6E_2px,transparent_2px)] bg-size-[40px_40px]"
              animate={{
                backgroundPosition: ['0px 0px', '40px 40px'],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Floating Glow Elements */}
          <motion.div
            className="absolute top-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-32 h-32 bg-accent/15 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-10 lg:p-16 xl:p-20 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold mb-8">
                <Sparkles size={14} />
                {t('requirements.badge')}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                {t('requirements.title')} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-light">
                  {t('requirements.subtitle')}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-blue-100/70 text-lg mb-12 leading-relaxed max-w-lg">
                {t('requirements.description')}
              </motion.p>

              <motion.div
                className="space-y-6 mb-8 lg:mb-0"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}>
                {reqs.map((req, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex gap-5 items-start group cursor-default"
                    whileHover={{ x: 8 }}>
                    <motion.div
                      className="mt-1 p-3 bg-white/10 rounded-xl border border-white/10 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}>
                      <req.icon className="text-accent" size={22} />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                        {req.title}
                      </h4>
                      <p className="text-blue-100/60 leading-relaxed">
                        {req.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile CTA */}
              <motion.div
                className="lg:hidden mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}>
                <Link to="/eligibility">
                  <motion.button
                    className="w-full bg-linear-to-r from-accent to-accent-light text-primary py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    {t('requirements.cta_apply')}
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right Visual Section - Desktop */}
            <div className="relative hidden lg:block overflow-hidden">
              <motion.img
                src="/hero.png"
                alt={t('requirements.alt_travel')}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />
              <div className="absolute inset-0 bg-linear-to-l from-transparent via-primary/60 to-primary" />

              {/* Floating Card */}
              <motion.div
                className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 max-w-sm shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ y: -5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-14 h-14 bg-linear-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center text-primary shadow-lg"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(212, 175, 110, 0)',
                        '0 0 20px 5px rgba(212, 175, 110, 0.3)',
                        '0 0 0 0 rgba(212, 175, 110, 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <CheckCircle2 size={28} />
                  </motion.div>
                  <h5 className="text-white font-bold text-lg">
                    {t('requirements.eligibility_title')}
                  </h5>
                </div>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {t('requirements.eligibility_desc')}
                </p>
                <Link to="/eligibility">
                  <motion.button
                    className="w-full bg-linear-to-r from-accent to-accent-light text-primary py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    {t('requirements.cta_check')}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Requirements;

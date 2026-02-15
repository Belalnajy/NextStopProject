import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Clock, Globe, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const heroImages = ['/hero.png', '/hero_2.png', '/hero_3.png'];

const Hero = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const featureCards = [
    { icon: Clock, label: t('info.card1_title'), delay: 0 },
    { icon: Shield, label: t('hero.cta_check'), delay: 0.1 },
    { icon: Globe, label: t('info.card3_title'), delay: 0.2 },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image Slider with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={heroImages[currentImage]}
            alt="UK Landmark"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/85 to-primary/40 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/50 via-transparent to-transparent z-10" />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-32 right-20 w-20 h-20 rounded-full bg-accent/20 blur-2xl z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl z-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating Stars */}
      <motion.div
        className="absolute top-40 right-1/4 text-accent/40 z-10 hidden lg:block"
        variants={floatingVariants}
        animate="animate">
        <Sparkles size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 right-1/3 text-white/20 z-10 hidden lg:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}>
        <Star size={24} />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold mb-8 backdrop-blur-sm hover:bg-accent/30 transition-colors cursor-default group">
              <Sparkles
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            {settings?.hero_title || (
              <>
                {t('hero.title1')} <br />
                <motion.span
                  className="text-accent inline-block"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(212, 175, 110, 0)',
                      '0 0 40px rgba(212, 175, 110, 0.3)',
                      '0 0 20px rgba(212, 175, 110, 0)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  {t('hero.title2')}
                </motion.span>
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/80 mb-10 leading-relaxed font-light max-w-2xl">
            {settings?.hero_subtitle || t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4">
            <Link to="/apply">
              <motion.button
                className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-8 py-4 rounded-full text-lg font-bold shadow-xl group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(212, 175, 110, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('hero.cta_apply')}
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-yellow-400 to-accent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </Link>
            <motion.button
              className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold overflow-hidden group"
              whileHover={{
                scale: 1.02,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
              whileTap={{ scale: 0.98 }}>
              <span className="relative z-10">{t('hero.cta_check')}</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.label}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 cursor-default group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + card.delay, duration: 0.5 }}
                whileHover={{ y: -5 }}>
                <motion.div
                  className="p-3 bg-accent/20 rounded-xl group-hover:bg-accent/30 transition-colors"
                  whileHover={{ rotate: 10, scale: 1.1 }}>
                  <card.icon className="text-accent" size={24} />
                </motion.div>
                <span className="text-white font-medium">{card.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentImage === index
                ? 'w-8 bg-accent'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Bottom Gradient Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />

      {/* Side Gradient Decoration */}
      <motion.div
        className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-linear-to-tl from-accent/20 via-accent/5 to-transparent pointer-events-none z-10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  );
};

export default Hero;

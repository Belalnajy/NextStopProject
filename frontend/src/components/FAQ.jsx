import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: t('faq.questions.q1'),
      answer: t('faq.questions.a1'),
    },
    {
      question: t('faq.questions.q2'),
      answer: t('faq.questions.a2'),
    },
    {
      question: t('faq.questions.q3'),
      answer: t('faq.questions.a3'),
    },
    {
      question: t('faq.questions.q4'),
      answer: t('faq.questions.a4'),
    },
    {
      question: t('faq.questions.q5'),
      answer: t('faq.questions.a5'),
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      id="faq"
      className="py-28 bg-linear-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48" />
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary">
            {t('faq.title')}{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-light">
              {t('faq.title_highlight')}
            </span>
          </motion.h2>
        </div>

        {/* FAQ Items */}
        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <motion.div
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 ${
                  openIndex === index
                    ? 'border-accent/30 shadow-lg shadow-accent/5'
                    : 'border-slate-200 hover:border-accent/20 hover:shadow-md'
                }`}
                layout>
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 flex justify-between items-center text-left gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className={`hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold transition-colors ${
                        openIndex === index
                          ? 'bg-accent text-primary'
                          : 'bg-slate-100 text-gray-400'
                      }`}>
                      {index + 1}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-bold transition-colors ${
                        openIndex === index ? 'text-primary' : 'text-gray-700'
                      }`}>
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    className={`p-2 rounded-full transition-colors shrink-0 ${
                      openIndex === index
                        ? 'bg-accent/20 text-accent'
                        : 'bg-slate-50 text-gray-400'
                    }`}
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}>
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 sm:pl-20">
                        <div className="text-gray-600 leading-relaxed border-t border-slate-100 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}>
          <div className="bg-linear-to-br from-primary via-primary to-primary-dark rounded-3xl p-10 md:p-14 max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-10 right-10 text-accent/20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={40} />
            </motion.div>

            <div className="relative z-10 text-center">
              <motion.h3
                className="text-3xl md:text-4xl font-display font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}>
                {t('faq.cta_title')}
              </motion.h3>
              <motion.p
                className="text-blue-100/80 text-lg mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}>
                {t('faq.cta_desc')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}>
                <Link to="/apply">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(212, 175, 110, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-10 py-4 rounded-full text-lg font-bold shadow-xl group">
                    <span className="relative z-10 flex items-center gap-2">
                      {t('faq.cta_btn')}
                      <ArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-yellow-400 to-accent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
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

export default FAQ;

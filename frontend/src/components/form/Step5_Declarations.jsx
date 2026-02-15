import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Step5_Declarations = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.confirmInfo) newErrors.confirmInfo = true;
    if (!formData.acceptTerms) newErrors.acceptTerms = true;
    if (!formData.confirmProcessingTime) newErrors.confirmProcessingTime = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  const declarations = [
    {
      name: 'confirmInfo',
      icon: CheckCircle,
      title: t('form.step5.declarations.confirmInfo.title'),
      text: t('form.step5.declarations.confirmInfo.text'),
      warning: t('form.step5.declarations.confirmInfo.warning'),
    },
    {
      name: 'acceptTerms',
      icon: FileText,
      title: t('form.step5.declarations.acceptTerms.title'),
      text: t('form.step5.declarations.acceptTerms.text'),
      link: true,
    },
    {
      name: 'confirmProcessingTime',
      icon: Clock,
      title: t('form.step5.declarations.confirmProcessingTime.title'),
      text: t('form.step5.declarations.confirmProcessingTime.text'),
    },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}>
          <ShieldCheck className="text-white" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-primary">
            {t('form.step5.title')}
          </h2>
          <p className="text-gray-500 text-sm">{t('form.step5.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {declarations.map((dec, index) => (
          <motion.div
            key={dec.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group">
            <motion.label
              className={`block p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                formData[dec.name]
                  ? 'border-accent/50 bg-accent/5'
                  : errors[dec.name]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}>
              <div className="flex items-start gap-4">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name={dec.name}
                    checked={formData[dec.name] || false}
                    onChange={handleChange}
                    required
                    className="sr-only peer"
                  />
                  <motion.div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      formData[dec.name]
                        ? 'bg-linear-to-br from-accent to-accent-light border-accent'
                        : errors[dec.name]
                          ? 'border-red-500 bg-white'
                          : 'border-gray-300 bg-white'
                    }`}
                    animate={formData[dec.name] ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}>
                    {formData[dec.name] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}>
                        <CheckCircle size={16} className="text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <dec.icon
                      size={16}
                      className={
                        formData[dec.name] ? 'text-accent' : 'text-gray-400'
                      }
                    />
                    <span
                      className={`font-semibold ${errors[dec.name] ? 'text-red-600' : 'text-gray-800'}`}>
                      {dec.title}
                    </span>
                    <span className="text-accent">*</span>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed block">
                    {dec.text}
                  </span>
                  {dec.link && (
                    <div className="mt-2 flex gap-2">
                      <a
                        href="#"
                        className="text-sm text-primary underline hover:text-accent">
                        {t('footer.legal_links.terms')}
                      </a>
                      <span className="text-gray-400">•</span>
                      <a
                        href="#"
                        className="text-sm text-primary underline hover:text-accent">
                        {t('footer.legal_links.privacy')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {dec.warning && (
                <motion.div
                  className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}>
                  <div className="flex items-start gap-2 text-amber-800 text-xs">
                    <AlertCircle
                      size={14}
                      className="shrink-0 mt-0.5 text-amber-500"
                    />
                    <span>{dec.warning}</span>
                  </div>
                </motion.div>
              )}
            </motion.label>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <motion.button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-primary transition-colors rounded-full hover:bg-gray-100"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={18} />
          {t('form.common.back')}
        </motion.button>
        <motion.button
          type="submit"
          className="relative overflow-hidden bg-linear-to-r from-primary to-primary-light text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 group"
          whileHover={{
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(26, 47, 107, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}>
          <span className="relative z-10 flex items-center gap-2">
            {t('form.common.proceedToPayment')}
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={18}
            />
          </span>
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default Step5_Declarations;

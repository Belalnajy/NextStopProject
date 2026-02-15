import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Loader2,
  User,
  ShieldCheck,
  ArrowLeft,
  Receipt,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import api from '../../api';

const Step6_Payment = ({ formData, prevStep, nextStep }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const data = new FormData();

    // Map frontend keys to backend keys
    data.append('nationality', formData.nationality);
    data.append('arrival_date', formData.arrivalDate);
    data.append('passport_number', formData.passportNumber);
    data.append('full_name', formData.fullName);
    data.append('email', formData.email);
    data.append('date_of_birth', formData.dateOfBirth);
    data.append('phone_code', formData.phoneCode);
    data.append('phone_number', formData.phoneNumber);
    data.append('street_name', formData.streetName);
    data.append('building_no', formData.buildingNo);
    data.append('apartment', formData.apartment || '');
    data.append('postal_code', formData.postalCode);
    data.append('town_city', formData.townCity);
    data.append('country', formData.country);

    // Additional Info
    data.append('has_job', formData.hasJob === 'yes' ? 'true' : 'false');
    data.append('job_title', formData.jobTitle || '');
    data.append(
      'has_criminal_record',
      formData.hasCriminalRecord === 'yes' ? 'true' : 'false',
    );
    data.append('criminal_details', formData.criminalDetails || '');
    data.append(
      'has_involvement',
      formData.hasInvolvement === 'yes' ? 'true' : 'false',
    );
    data.append('involvement_details', formData.involvementDetails || '');
    data.append(
      'has_other_nationalities',
      formData.hasOtherNationalities === 'yes' ? 'true' : 'false',
    );
    data.append('other_nationalities', formData.otherNationalities || '');
    data.append('area', formData.area || '');

    // Declarations
    data.append(
      'confirm_info_declaration',
      formData.confirmInfo ? 'true' : 'false',
    );
    data.append(
      'accept_terms_declaration',
      formData.acceptTerms ? 'true' : 'false',
    );
    data.append(
      'confirm_processing_time_declaration',
      formData.confirmProcessingTime ? 'true' : 'false',
    );

    // Append files
    if (formData.passportCopy) {
      data.append('passportCopy', formData.passportCopy);
    }
    if (formData.personalPhoto) {
      data.append('personalPhoto', formData.personalPhoto);
    }

    try {
      await api.post('/applications', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      nextStep();
    } catch (err) {
      console.error('Submission Error:', err);
      const backendError = err.response?.data;

      if (backendError?.errors && Array.isArray(backendError.errors)) {
        // Handle Zod validation errors
        const errorMsgs = backendError.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        setError(`${t('validation.failed')}: ${errorMsgs}`);
      } else {
        setError(
          backendError?.message ||
            t('validation.serverError') ||
            'Submission failed. Please try again.',
        );
      }
      setIsProcessing(false);
    }
  };

  const inputClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200';

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-shake">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}>
          <CreditCard className="text-white" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-primary">
            {t('form.step6.title')}
          </h2>
          <p className="text-gray-500 text-sm">{t('form.step6.subtitle')}</p>
        </div>
      </div>

      {/* Application Summary */}
      <motion.div
        className="bg-linear-to-br from-slate-50 to-white p-6 rounded-2xl space-y-4 border border-slate-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
          <User size={18} className="text-primary" />
          {t('form.step6.labels.summary.title')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">
              {t('form.step6.labels.summary.applicant')}
            </span>
            <span className="font-semibold text-gray-900">
              {formData.fullName || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">
              {t('form.step1.labels.nationality')}
            </span>
            <span className="font-semibold text-gray-900">
              {formData.nationality || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">
              {t('form.step1.labels.passportNumber')}
            </span>
            <span className="font-semibold text-gray-900 font-mono">
              {formData.passportNumber || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">
              {t('form.step1.labels.arrivalDate')}
            </span>
            <span className="font-semibold text-gray-900">
              {formData.arrivalDate || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl sm:col-span-2">
            <span className="text-gray-500">
              {t('form.step2.labels.email')}
            </span>
            <span className="font-semibold text-gray-900">
              {formData.email || 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div
        className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Receipt size={18} className="text-primary" />
          {t('form.step6.labels.pricing.title')}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {t('form.step6.labels.pricing.govFee')}
            </span>
            <span className="font-medium text-gray-800">£16.00</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {t('form.step6.labels.pricing.serviceFee')}
            </span>
            <span className="font-medium text-gray-800">£81.00</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800">
              {t('form.step6.labels.pricing.total')}
            </span>
            <motion.span
              className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-accent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              £97.00
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Payment Form */}
      <motion.div
        className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          {t('form.step6.labels.card.title')}
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step6.labels.card.holder')}
            </label>
            <input
              type="text"
              className={inputClasses}
              placeholder={t('form.step6.placeholders.holder')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step6.labels.card.number')}
            </label>
            <div className="relative">
              <input
                type="text"
                className={`${inputClasses} pl-12`}
                placeholder="0000 0000 0000 0000"
              />
              <CreditCard
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('form.step6.labels.card.expiry')}
              </label>
              <input type="text" className={inputClasses} placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('form.step6.labels.card.cvc')}
              </label>
              <input type="text" className={inputClasses} placeholder="123" />
            </div>
          </div>
        </div>

        <motion.div
          className="mt-6 flex items-center justify-center gap-2 text-xs p-3 bg-green-50 rounded-xl border border-green-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-green-700 font-medium">
            {t('form.step6.subtexts.securePayment')}
          </span>
        </motion.div>
      </motion.div>

      {/* reCAPTCHA notice */}
      <motion.p
        className="text-xs text-gray-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        {t('form.step6.subtexts.recaptcha.text')}{' '}
        <a href="#" className="underline">
          {t('footer.legal_links.privacy')}
        </a>{' '}
        {t('form.step6.subtexts.recaptcha.and')}{' '}
        <a href="#" className="underline">
          {t('footer.legal_links.terms')}
        </a>{' '}
        {t('form.step6.subtexts.recaptcha.apply')}
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row justify-between gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <motion.button
          type="button"
          onClick={prevStep}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-primary transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={18} />
          {t('form.common.back')}
        </motion.button>
        <motion.button
          type="submit"
          disabled={isProcessing}
          className="relative overflow-hidden bg-linear-to-r from-accent to-accent-light text-primary px-8 py-4 rounded-full font-bold shadow-xl shadow-accent/20 disabled:opacity-70 flex-1 sm:flex-none"
          whileHover={
            !isProcessing
              ? {
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(212, 175, 110, 0.4)',
                }
              : {}
          }
          whileTap={!isProcessing ? { scale: 0.98 } : {}}>
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.span
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {t('form.step6.status.processing')}
              </motion.span>
            ) : (
              <motion.span
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2">
                <Lock size={16} />
                {t('form.common.proceedToPayment')}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default Step6_Payment;

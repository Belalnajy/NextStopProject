import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Step4_Additional = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.hasJob) newErrors.hasJob = t('validation.required');
    if (formData.hasJob === 'yes' && !formData.jobTitle)
      newErrors.jobTitle = t('validation.required');
    if (!formData.hasCriminalRecord)
      newErrors.hasCriminalRecord = t('validation.required');
    if (formData.hasCriminalRecord === 'yes' && !formData.criminalDetails)
      newErrors.criminalDetails = t('validation.required');
    if (!formData.hasInvolvement)
      newErrors.hasInvolvement = t('validation.required');
    if (formData.hasInvolvement === 'yes' && !formData.involvementDetails)
      newErrors.involvementDetails = t('validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
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
    } else {
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const inputClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200';

  const RadioOption = ({ name, value, label, checked }) => (
    <label
      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        checked
          ? 'border-accent bg-accent/10'
          : 'border-gray-200 hover:border-gray-300'
      }`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className="sr-only"
      />
      <span
        className={`font-medium ${checked ? 'text-primary' : 'text-gray-600'}`}>
        {label}
      </span>
    </label>
  );

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
          <Briefcase className="text-white" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-primary">
            {t('form.step4.title')}
          </h2>
          <p className="text-gray-500 text-sm">{t('form.step4.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Employment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-400" />
              {t('form.step4.labels.hasJob')}{' '}
              <span className="text-accent">*</span>
            </span>
          </label>
          <div className="flex gap-4">
            <RadioOption
              name="hasJob"
              value="yes"
              label={t('form.common.yes')}
              checked={formData.hasJob === 'yes'}
            />
            <RadioOption
              name="hasJob"
              value="no"
              label={t('form.common.no')}
              checked={formData.hasJob === 'no'}
            />
          </div>
          {errors.hasJob && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.hasJob}
            </p>
          )}

          {formData.hasJob === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('form.step4.labels.jobTitle')}
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={handleChange}
                className={`${inputClasses} ${errors.jobTitle ? 'border-red-500 bg-red-50' : ''}`}
                placeholder={t('form.step4.placeholders.jobTitle')}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.jobTitle}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Criminal Record */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              {t('form.step4.labels.hasCriminalRecord')}{' '}
              <span className="text-accent">*</span>
            </span>
          </label>
          <div className="flex gap-4 mb-3">
            <RadioOption
              name="hasCriminalRecord"
              value="yes"
              label={t('form.common.yes')}
              checked={formData.hasCriminalRecord === 'yes'}
            />
            <RadioOption
              name="hasCriminalRecord"
              value="no"
              label={t('form.common.no')}
              checked={formData.hasCriminalRecord === 'no'}
            />
          </div>
          {errors.hasCriminalRecord && (
            <p className="mt-1 text-xs text-red-500 font-medium mb-2">
              {errors.hasCriminalRecord}
            </p>
          )}
          <p className="text-xs text-gray-500 flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            {t('form.step4.subtexts.criminalGuideline')}
          </p>

          {formData.hasCriminalRecord === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4">
              <textarea
                name="criminalDetails"
                value={formData.criminalDetails || ''}
                onChange={handleChange}
                rows="3"
                className={`${inputClasses} resize-none ${errors.criminalDetails ? 'border-red-500 bg-red-50' : ''}`}
                placeholder={t('form.step4.placeholders.details')}
              />
              {errors.criminalDetails && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.criminalDetails}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Terrorism/Extremism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              {t('form.step4.labels.terrorismQuestion')}{' '}
              <span className="text-accent">*</span>
            </span>
          </label>
          <ul className="text-sm text-gray-600 mb-4 ml-4 space-y-1 list-disc">
            <li>{t('form.step4.labels.checklist.item1')}</li>
            <li>{t('form.step4.labels.checklist.item2')}</li>
            <li>{t('form.step4.labels.checklist.item3')}</li>
            <li>{t('form.step4.labels.checklist.item4')}</li>
          </ul>
          <div className="flex gap-4">
            <RadioOption
              name="hasInvolvement"
              value="yes"
              label={t('form.common.yes')}
              checked={formData.hasInvolvement === 'yes'}
            />
            <RadioOption
              name="hasInvolvement"
              value="no"
              label={t('form.common.no')}
              checked={formData.hasInvolvement === 'no'}
            />
          </div>
          {errors.hasInvolvement && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.hasInvolvement}
            </p>
          )}

          {formData.hasInvolvement === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4">
              <textarea
                name="involvementDetails"
                value={formData.involvementDetails || ''}
                onChange={handleChange}
                rows="3"
                className={`${inputClasses} resize-none ${errors.involvementDetails ? 'border-red-500 bg-red-50' : ''}`}
                placeholder={t('form.step4.placeholders.details')}
              />
              {errors.involvementDetails && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.involvementDetails}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
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
            {t('form.common.nextStep')}
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

export default Step4_Additional;

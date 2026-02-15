import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building,
  Home,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const countries = [
  'Egypt',
  'SaudiArabia',
  'UAE',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Jordan',
  'Lebanon',
  'USA/Canada',
  'UK',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'India',
  'Pakistan',
  'China',
  'Japan',
  'SouthKorea',
  'Australia',
  'Brazil',
  'Mexico',
  'SouthAfrica',
  'Nigeria',
];

const Step3_Address = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.streetName) newErrors.streetName = t('validation.required');
    if (!formData.buildingNo) newErrors.buildingNo = t('validation.required');
    if (!formData.postalCode) newErrors.postalCode = t('validation.required');
    if (!formData.townCity) newErrors.townCity = t('validation.required');
    if (!formData.country) newErrors.country = t('validation.required');

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

  // ... (rest of the functions same)

  const inputClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200';
  const selectClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200 appearance-none bg-white pr-10';

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
          <Home className="text-white" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-primary">
            {t('form.step3.title')}
          </h2>
          <p className="text-gray-500 text-sm">{t('form.step3.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Street Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              {t('form.step3.labels.street')}{' '}
              <span className="text-accent">*</span>
            </span>
          </label>
          <input
            type="text"
            name="streetName"
            value={formData.streetName || ''}
            onChange={handleChange}
            className={`${inputClasses} ${errors.streetName ? 'border-red-500 bg-red-50' : ''}`}
            placeholder={t('form.step3.placeholders.street')}
          />
          {errors.streetName && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.streetName}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Building/Villa No */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Building size={14} className="text-gray-400" />
                {t('form.step3.labels.building')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <input
              type="text"
              name="buildingNo"
              value={formData.buildingNo || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.buildingNo ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step3.placeholders.building')}
            />
            {errors.buildingNo && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.buildingNo}
              </p>
            )}
          </motion.div>

          {/* Apartment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step3.labels.apartment')}{' '}
              <span className="text-gray-400 text-xs">
                {t('form.common.ifApplicable')}
              </span>
            </label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment || ''}
              onChange={handleChange}
              className={inputClasses}
              placeholder={t('form.step3.placeholders.apartment')}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step3.labels.area')}{' '}
              <span className="text-gray-400 text-xs">
                {t('form.common.optional')}
              </span>
            </label>
            <input
              type="text"
              name="area"
              value={formData.area || ''}
              onChange={handleChange}
              className={inputClasses}
              placeholder={t('form.step3.placeholders.area')}
            />
          </motion.div>

          {/* Postal Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step3.labels.postalCode')}{' '}
              <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.postalCode ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step3.placeholders.postalCode')}
            />
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.postalCode}
              </p>
            )}
          </motion.div>
        </div>

        {/* Additional Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('form.step3.labels.additionalInfo')}{' '}
            <span className="text-gray-400 text-xs">
              {t('form.common.optional')}
            </span>
          </label>
          <input
            type="text"
            name="additionalAddress"
            value={formData.additionalAddress || ''}
            onChange={handleChange}
            className={inputClasses}
            placeholder={t('form.step3.placeholders.additionalInfo')}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Town/City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step3.labels.city')}{' '}
              <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="townCity"
              value={formData.townCity || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.townCity ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step3.placeholders.city')}
            />
            {errors.townCity && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.townCity}
              </p>
            )}
          </motion.div>

          {/* Country */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step3.labels.country')}{' '}
              <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <select
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className={`${selectClasses} ${errors.country ? 'border-red-500 bg-red-50' : ''}`}>
                <option value="">
                  {t('form.step1.placeholders.nationality')}
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {t(`form.countries.${c}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            {errors.country && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.country}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
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

export default Step3_Address;

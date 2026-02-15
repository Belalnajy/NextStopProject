import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Upload,
  X,
  Image,
  Calendar,
  ArrowRight,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const nationalities = [
  'Dutch',
  'Belgian',
  'Swiss',
  'Austrian',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Irish',
  'Portuguese',
  'Greek',
  'Polish',
  'Czech',
  'Hungarian',
  'Romanian',
  'Bulgarian',
  'Croatian',
  'Serbian',
  'Turkish',
  'Russian',
  'Ukrainian',
  'Chinese',
  'Japanese',
  'Korean',
  'Indian',
  'Pakistani',
  'Bangladeshi',
  'Malaysian',
  'Singaporean',
  'Indonesian',
  'Thai',
  'Vietnamese',
  'Filipino',
  'Brazilian',
  'Mexican',
  'Argentine',
  'Colombian',
  'Chilean',
  'Peruvian',
  'Venezuelan',
  'South African',
  'Nigerian',
  'Kenyan',
  'Ghanaian',
  'Ethiopian',
  'Other',
];

const Step1_Travel = ({ formData, updateFormData, nextStep }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.nationality) newErrors.nationality = t('validation.required');
    if (!formData.arrivalDate) newErrors.arrivalDate = t('validation.required');
    if (!formData.passportNumber)
      newErrors.passportNumber = t('validation.required');
    if (!formData.hasOtherNationalities)
      newErrors.hasOtherNationalities = t('validation.required');
    if (
      formData.hasOtherNationalities === 'yes' &&
      !formData.otherNationalities
    )
      newErrors.otherNationalities = t('validation.required');
    if (!formData.passportCopy)
      newErrors.passportCopy = t('validation.required');

    // Date validation: must be at least 3 business days in the future
    if (formData.arrivalDate) {
      const selectedDate = new Date(formData.arrivalDate);
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);
      minDate.setDate(minDate.getDate() + 3);

      if (selectedDate < minDate) {
        newErrors.arrivalDate = t('validation.futureDateRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData({ passportCopy: file });
      if (errors.passportCopy) {
        setErrors((prev) => {
          const { passportCopy, ...rest } = prev;
          return rest;
        });
      }
    }
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
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const inputClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200';
  const selectClasses =
    'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200 appearance-none bg-white pr-10';

  return (
    <>
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
            <Plane className="text-white" size={24} />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {t('form.step1.title')}
            </h2>
            <p className="text-gray-500 text-sm">{t('form.step1.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Nationality */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                {t('form.step1.labels.nationality')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="nationality"
                value={formData.nationality || ''}
                onChange={handleChange}
                className={`${selectClasses} ${errors.nationality ? 'border-red-500 bg-red-50' : ''}`}>
                <option value="">
                  {t('form.step1.placeholders.nationality')}
                </option>
                {nationalities.map((nat) => (
                  <option key={nat} value={nat}>
                    {t(`form.countries.${nat}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            {errors.nationality && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.nationality}
              </p>
            )}
          </motion.div>

          {/* Arrival Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                {t('form.step1.labels.arrivalDate')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.arrivalDate ? 'border-red-500 bg-red-50' : ''}`}
            />
            {errors.arrivalDate && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.arrivalDate}
              </p>
            )}
          </motion.div>

          {/* Passport Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step1.labels.passportNumber')}{' '}
              <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.passportNumber ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step1.placeholders.passportNumber')}
            />
            {errors.passportNumber && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.passportNumber}
              </p>
            )}
          </motion.div>

          {/* Other Nationalities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('form.step1.labels.otherNationalities')}{' '}
              <span className="text-accent">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {t('form.step1.subtexts.otherNationalities')}
            </p>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.hasOtherNationalities === 'yes' ? 'border-accent bg-accent/10' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="hasOtherNationalities"
                  value="yes"
                  checked={formData.hasOtherNationalities === 'yes'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`font-medium ${formData.hasOtherNationalities === 'yes' ? 'text-primary' : 'text-gray-600'}`}>
                  {t('form.common.yes')}
                </span>
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.hasOtherNationalities === 'no' ? 'border-accent bg-accent/10' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="hasOtherNationalities"
                  value="no"
                  checked={formData.hasOtherNationalities === 'no'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`font-medium ${formData.hasOtherNationalities === 'no' ? 'text-primary' : 'text-gray-600'}`}>
                  {t('form.common.no')}
                </span>
              </label>
            </div>
            {errors.hasOtherNationalities && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.hasOtherNationalities}
              </p>
            )}

            {formData.hasOtherNationalities === 'yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4">
                <input
                  type="text"
                  name="otherNationalities"
                  value={formData.otherNationalities || ''}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.otherNationalities ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder={t('form.step1.placeholders.otherNationalities')}
                />
                {errors.otherNationalities && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.otherNationalities}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Passport Copy Upload */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('form.step1.labels.passportCopy')}{' '}
              <span className="text-accent">*</span>
            </label>
            <div
              onClick={() => document.getElementById('passportCopy').click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files[0];
                if (file) updateFormData({ passportCopy: file });
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer h-[180px] flex flex-col items-center justify-center transition-all duration-300 ${
                dragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5'
              }`}>
              <input
                type="file"
                id="passportCopy"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <motion.div
                animate={
                  dragActive
                    ? { scale: 1.1, rotate: 5 }
                    : { scale: 1, rotate: 0 }
                }>
                <Upload
                  className={`mx-auto mb-3 ${dragActive ? 'text-accent' : 'text-gray-400'}`}
                  size={32}
                />
              </motion.div>
              <p className="text-gray-600 font-medium">
                {formData.passportCopy
                  ? formData.passportCopy.name
                  : t('form.common.chooseFile')}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {t('form.step1.subtexts.uploadFormats')}
              </p>
            </div>
            {errors.passportCopy && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.passportCopy}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t('form.step1.subtexts.passportGuideline')}
            </p>
          </motion.div>

          {/* Passport Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('form.common.example')}
            </label>
            <motion.div
              className="rounded-2xl overflow-hidden border-2 border-gray-100 bg-white p-3 cursor-zoom-in hover:shadow-lg transition-all"
              onClick={() => setSelectedImage('/example_passport.png')}
              whileHover={{ scale: 1.02 }}>
              <img
                src="/example_passport.png"
                alt="Passport Example"
                className="w-full h-44 object-contain"
              />
            </motion.div>
            <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
              <Image size={12} /> {t('form.common.clickToEnlarge')}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-end pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-accent transition-colors">
                <X size={28} />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Step1_Travel;

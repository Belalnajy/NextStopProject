import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Upload,
  X,
  Image,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const phoneCodes = [
  { code: '+20', country: 'Egypt' },
  { code: '+966', country: 'SaudiArabia' },
  { code: '+971', country: 'UAE' },
  { code: '+974', country: 'Qatar' },
  { code: '+965', country: 'Kuwait' },
  { code: '+973', country: 'Bahrain' },
  { code: '+968', country: 'Oman' },
  { code: '+962', country: 'Jordan' },
  { code: '+961', country: 'Lebanon' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+31', country: 'Netherlands' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'SouthKorea' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+27', country: 'SouthAfrica' },
  { code: '+234', country: 'Nigeria' },
];

const Step2_Personal = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = t('validation.required');
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t('validation.required');
    if (!formData.phoneNumber) newErrors.phoneNumber = t('validation.required');
    if (!formData.email) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    if (!formData.personalPhoto)
      newErrors.personalPhoto = t('validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData({ personalPhoto: file });
      if (errors.personalPhoto) {
        setErrors((prev) => {
          const { personalPhoto, ...rest } = prev;
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
            <User className="text-white" size={24} />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {t('form.step2.title')}
            </h2>
            <p className="text-gray-500 text-sm">{t('form.step2.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.step2.labels.fullName')}{' '}
              <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.fullName ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step2.placeholders.fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.fullName}
              </p>
            )}
          </motion.div>

          {/* Date of Birth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                {t('form.step2.labels.dob')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.dateOfBirth ? 'border-red-500 bg-red-50' : ''}`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.dateOfBirth}
              </p>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                {t('form.step2.labels.phone')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <div className="flex gap-3">
              <div className="relative w-36">
                <select
                  name="phoneCode"
                  value={formData.phoneCode || '+20'}
                  onChange={handleChange}
                  className={selectClasses}>
                  {phoneCodes.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} {t(`countries.${p.country.replace(/\s/g, '')}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className={`${inputClasses} flex-1 ${errors.phoneNumber ? 'border-red-500 bg-red-50' : ''}`}
                placeholder={t('form.step2.placeholders.phone')}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.phoneNumber}
              </p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                {t('form.step2.labels.email')}{' '}
                <span className="text-accent">*</span>
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`${inputClasses} ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
              placeholder={t('form.step2.placeholders.email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {t('form.step2.subtexts.email')}
            </p>
          </motion.div>

          {/* Personal Photo Upload */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('form.step2.labels.personalPhoto')}{' '}
              <span className="text-accent">*</span>
            </label>
            <div
              onClick={() => document.getElementById('personalPhoto').click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files[0];
                if (file) updateFormData({ personalPhoto: file });
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer h-[180px] flex flex-col items-center justify-center transition-all duration-300 ${
                dragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5'
              }`}>
              <input
                type="file"
                id="personalPhoto"
                className="hidden"
                accept="image/*"
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
                {formData.personalPhoto
                  ? formData.personalPhoto.name
                  : t('form.common.chooseFile')}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {t('form.step1.subtexts.uploadFormats')}
              </p>
            </div>
            {errors.personalPhoto && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.personalPhoto}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t('form.step2.subtexts.photoGuideline')}
            </p>
          </motion.div>

          {/* Photo Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('form.common.example')}
              </label>
              <motion.div
                className="rounded-2xl overflow-hidden border-2 border-gray-100 bg-white p-2 h-[160px] cursor-zoom-in hover:shadow-lg transition-all flex items-center justify-center"
                onClick={() => setSelectedImage('/example_photo.png')}
                whileHover={{ scale: 1.02 }}>
                <img
                  src="/example_photo.png"
                  alt="Photo Example"
                  className="max-h-full object-contain"
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('form.step2.labels.guidelines')}
              </label>
              <motion.div
                className="rounded-2xl overflow-hidden border-2 border-gray-100 bg-white h-[160px] cursor-zoom-in hover:shadow-lg transition-all flex items-center justify-center"
                onClick={() => setSelectedImage('/photo_guidelines.png')}
                whileHover={{ scale: 1.02 }}>
                <img
                  src="/photo_guidelines.png"
                  alt="Guidelines"
                  className="max-h-full object-contain"
                />
              </motion.div>
            </div>
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

export default Step2_Personal;

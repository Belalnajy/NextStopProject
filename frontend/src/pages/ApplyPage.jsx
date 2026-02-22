import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import Step1_Travel from '../components/form/Step1_Travel';
import Step2_Personal from '../components/form/Step2_Personal';
import Step3_Address from '../components/form/Step3_Address';
import Step4_Additional from '../components/form/Step4_Additional';
import Step5_Declarations from '../components/form/Step5_Declarations';
import Step6_Payment from '../components/form/Step6_Payment';
import Step7_Success from '../components/form/Step7_Success';

const ApplyPage = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Travel Information
    nationality: '',
    hasOtherNationalities: '',
    otherNationalities: '',
    arrivalDate: '',
    passportNumber: '',
    passportCopy: null,

    // Personal Details
    fullName: '',
    dateOfBirth: '',
    phoneCode: '+20',
    phoneNumber: '',
    email: '',
    personalPhoto: null,

    // Home Address
    streetName: '',
    buildingNo: '',
    apartment: '',
    area: '',
    postalCode: '',
    additionalAddress: '',
    townCity: '',
    country: '',

    // Additional Information
    hasJob: '',
    jobTitle: '',
    hasCriminalRecord: '',
    criminalDetails: '',
    hasInvolvement: '',
    involvementDetails: '',

    // Declarations
    confirmInfo: false,
    acceptTerms: false,
    confirmProcessingTime: false,
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const steps = [
    { title: t('form.step1.title'), number: 1 },
    { title: t('form.step2.title'), number: 2 },
    { title: t('form.step3.title'), number: 3 },
    { title: t('form.step4.title'), number: 4 },
    { title: t('form.step5.title'), number: 5 },
    { title: t('form.step6.title'), number: 6 },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        {step < 7 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-4">
                <Sparkles size={14} />
                {t('form.common.step')} {step} of 6
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
                {t('nav.apply')}
              </h1>
              <p className="text-gray-500 mt-2">
                {t('form.common.englishRequirement')}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="relative flex justify-between items-center max-w-3xl mx-auto overflow-x-auto pb-4">
              {/* Background Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />

              {/* Animated Progress Line */}
              <motion.div
                className="absolute top-5 left-0 h-1 bg-linear-to-r from-primary via-primary-light to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />

              {steps.map((s) => (
                <motion.div
                  key={s.number}
                  className="flex flex-col items-center gap-2 relative z-10 min-w-[60px]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: s.number * 0.05 }}>
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      step > s.number
                        ? 'bg-linear-to-br from-primary to-primary-light text-white shadow-lg shadow-primary/30'
                        : step === s.number
                          ? 'bg-linear-to-br from-accent to-accent-light text-primary shadow-lg shadow-accent/30'
                          : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}
                    animate={
                      step === s.number
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 0 0 0 rgba(212, 175, 110, 0)',
                              '0 0 20px 5px rgba(212, 175, 110, 0.3)',
                              '0 0 0 0 rgba(212, 175, 110, 0)',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: step === s.number ? Infinity : 0,
                    }}>
                    {step > s.number ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}>
                        <CheckCircle size={20} />
                      </motion.div>
                    ) : (
                      s.number
                    )}
                  </motion.div>
                  <span
                    className={`text-xs font-medium transition-colors hidden sm:block ${
                      step >= s.number ? 'text-primary' : 'text-gray-400'
                    }`}>
                    {s.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {settings?.registration_closed ? (
          <motion.div
            className="bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-primary/5 border border-slate-100 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">
              Registrations are Currently Closed
            </h2>
            <p className="text-slate-600 text-lg">
              We are not accepting new applications at this time. Please check
              back later.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-xl shadow-primary/5 border border-slate-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-accent/5 to-transparent rounded-bl-full" />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1_Travel
                  key="step1"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                />
              )}
              {step === 2 && (
                <Step2_Personal
                  key="step2"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 3 && (
                <Step3_Address
                  key="step3"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 4 && (
                <Step4_Additional
                  key="step4"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 5 && (
                <Step5_Declarations
                  key="step5"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 6 && (
                <Step6_Payment
                  key="step6"
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 7 && <Step7_Success key="step7" />}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Receipt, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useCurrency } from '../context/CurrencyContext';
import { FEES } from '../config/pricing';

/**
 * Demo checkout used while no live payment gateway is connected. It never
 * asks for card details and never charges anything.
 */
export default function DemoCheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format, formatBase, isConverted } = useCurrency();
  const [applicationNo, setApplicationNo] = useState('');
  const [notFound, setNotFound] = useState(false);

  const appId = searchParams.get('app');

  useEffect(() => {
    if (!appId) {
      setNotFound(true);
      return;
    }
    api
      .get(`/applications/${appId}/public-info`)
      .then((res) => setApplicationNo(res.data.application_no))
      .catch(() => setNotFound(true));
  }, [appId]);

  const completeTestPayment = () => {
    navigate(`/apply?payment=success&app=${appId}&mode=demo`);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6">
          {/* Test mode banner */}
          <div className="flex gap-3 items-start p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-amber-900">
            <FlaskConical size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {t('demo_checkout.banner_title', {
                  defaultValue: 'Test mode',
                })}
              </p>
              <p className="text-sm">
                {t('demo_checkout.banner_text', {
                  defaultValue:
                    'This is a demo checkout. No payment is taken and no card details are requested.',
                })}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-slate-200 shadow-sm">
            <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Receipt size={22} />
              {t('demo_checkout.title', { defaultValue: 'Checkout' })}
            </h1>

            {notFound ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  {t('demo_checkout.not_found', {
                    defaultValue:
                      'We could not find this application. Please start a new application.',
                  })}
                </p>
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-2 text-primary font-bold underline">
                  <ArrowLeft size={16} />
                  {t('demo_checkout.back_to_apply', {
                    defaultValue: 'Back to the application',
                  })}
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {t('demo_checkout.application_no', {
                        defaultValue: 'Application number',
                      })}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {applicationNo || '...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {t('form.step6.labels.pricing.govFee')}
                    </span>
                    <span className="font-medium text-gray-800">
                      {format(FEES.government)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {t('form.step6.labels.pricing.serviceFee')}
                    </span>
                    <span className="font-medium text-gray-800">
                      {format(FEES.service)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-800">
                      {t('form.step6.labels.pricing.total')}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {format(FEES.total)}
                    </span>
                  </div>
                  {isConverted && (
                    <p className="text-xs text-gray-500 text-end">
                      {t('currency.charged_in_eur', {
                        amount: formatBase(FEES.total),
                      })}
                    </p>
                  )}
                </div>

                <motion.button
                  type="button"
                  onClick={completeTestPayment}
                  disabled={!applicationNo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-linear-to-r from-primary to-primary-light text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
                  <CheckCircle2 size={20} />
                  {t('demo_checkout.complete', {
                    defaultValue: 'Complete test payment',
                  })}
                </motion.button>
                <Link
                  to="/apply"
                  className="block text-center text-sm text-gray-500 mt-4 hover:text-primary">
                  {t('demo_checkout.cancel', { defaultValue: 'Cancel' })}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, ChevronDown, Check, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Currency switcher. The active currency is auto-detected from the visitor's
 * IP; this lets them pick a different one manually.
 */
const CurrencySwitcher = ({ variant = 'desktop', onSelect }) => {
  const { t } = useTranslation();
  const { currency, meta, currencies, detected, isManual, setCurrency } =
    useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Keep the active currency and the most common ones at the top of the list.
  const orderedCurrencies = useMemo(() => {
    const pinned = [currency, 'EUR', 'USD', 'GBP'].filter(
      (code, index, all) => all.indexOf(code) === index,
    );
    return [
      ...pinned
        .map((code) => currencies.find((item) => item.code === code))
        .filter(Boolean),
      ...currencies.filter((item) => !pinned.includes(item.code)),
    ];
  }, [currencies, currency]);

  const handleSelect = (code) => {
    setCurrency(code);
    setIsOpen(false);
    onSelect?.();
  };

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          {t('currency.label', { defaultValue: 'Currency' })}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(showAll ? orderedCurrencies : orderedCurrencies.slice(0, 6)).map(
            (item) => (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`flex items-center justify-center gap-1 p-2 rounded-lg border text-xs ${
                  item.code === currency
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-gray-100 text-gray-600'
                }`}>
                <span>{item.symbol}</span>
                <span>{item.code}</span>
              </button>
            ),
          )}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-primary text-xs font-bold text-center py-2 underline">
          {showAll
            ? t('currency.show_less', { defaultValue: 'Show less' })
            : t('currency.show_all', { defaultValue: 'Show all currencies' })}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={t('currency.switch_hint', {
          defaultValue: 'Change display currency',
        })}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all border-gray-200 text-gray-700 hover:bg-gray-50">
        <Banknote size={18} />
        <span className="text-xs font-bold uppercase">{currency}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t('currency.label', { defaultValue: 'Currency' })}
                </div>
                {detected && !isManual && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                    <MapPin size={12} className="text-accent" />
                    {t('currency.auto_detected', {
                      defaultValue: 'Detected from your location',
                    })}
                  </div>
                )}
              </div>
              <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
                {orderedCurrencies.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-primary/5 ${
                      item.code === currency
                        ? 'text-primary font-bold bg-primary/5'
                        : 'text-gray-600'
                    }`}>
                    <span className="w-7 text-start">{item.symbol}</span>
                    <span className="font-semibold">{item.code}</span>
                    <span className="text-xs text-gray-400 truncate">
                      {item.name}
                    </span>
                    {item.code === meta.code && (
                      <Check size={14} className="ms-auto text-accent" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySwitcher;

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../api';

/**
 * CurrencyContext
 * ---------------
 * Prices are stored/charged in EUR. On first load we ask the backend which
 * currency suits the visitor (detected from their IP) and convert every
 * displayed price into it. Visitors can override the detection from the
 * currency switcher in the navbar; the choice is remembered in localStorage.
 */

const BASE_CURRENCY = 'EUR';
const STORAGE_KEY = 'preferred_currency';

const DEFAULT_STATE = {
  base: BASE_CURRENCY,
  currency: BASE_CURRENCY,
  country: null,
  detected: false,
  rates: { [BASE_CURRENCY]: 1 },
  currencies: [
    { code: BASE_CURRENCY, symbol: '€', name: 'Euro', decimals: 2, rate: 1 },
  ],
  updatedAt: null,
};

/** Used when a component renders outside the provider (e.g. the admin dashboard) */
const DEFAULT_CONTEXT = {
  base: BASE_CURRENCY,
  currency: BASE_CURRENCY,
  meta: DEFAULT_STATE.currencies[0],
  rate: 1,
  country: null,
  detected: false,
  currencies: DEFAULT_STATE.currencies,
  updatedAt: null,
  isConverted: false,
  isManual: false,
  loading: false,
  convert: (amount) => amount,
  format: (amount) => `€${Number(amount).toFixed(2)}`,
  formatBase: (amount) => `€${Number(amount).toFixed(2)}`,
  setCurrency: () => {},
  resetCurrency: () => {},
};

const CurrencyContext = createContext(DEFAULT_CONTEXT);

const readStoredCurrency = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && /^[A-Z]{3}$/.test(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const CurrencyProvider = ({ children }) => {
  const [info, setInfo] = useState(DEFAULT_STATE);
  const [currency, setCurrencyState] = useState(
    () => readStoredCurrency() || BASE_CURRENCY,
  );
  const [isManual, setIsManual] = useState(() => Boolean(readStoredCurrency()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const detect = async () => {
      try {
        const { data } = await api.get('/currency');
        if (cancelled || !data?.currency) return;

        const rates = (data.currencies || []).reduce(
          (acc, item) => ({ ...acc, [item.code]: item.rate }),
          { [BASE_CURRENCY]: 1 },
        );

        setInfo({
          base: data.base || BASE_CURRENCY,
          currency: data.currency,
          country: data.country || null,
          detected: Boolean(data.detected),
          rates,
          currencies: data.currencies || DEFAULT_STATE.currencies,
          updatedAt: data.updatedAt || null,
        });

        // A manual choice always wins over IP detection.
        const stored = readStoredCurrency();
        if (!stored) setCurrencyState(data.currency);
      } catch (error) {
        console.error('Currency detection failed:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    detect();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    setIsManual(true);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable (private mode) — selection stays for this session */
    }
  }, []);

  const resetCurrency = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setIsManual(false);
    setCurrencyState(info.currency);
  }, [info.currency]);

  const meta = useMemo(() => {
    const found = info.currencies.find((item) => item.code === currency);
    return (
      found || {
        code: currency,
        symbol: currency,
        name: currency,
        decimals: 2,
        rate: info.rates[currency] ?? 1,
      }
    );
  }, [currency, info]);

  const rate = info.rates[currency] ?? 1;

  /** Convert an amount given in EUR into the active currency */
  const convert = useCallback((amountInEur) => amountInEur * rate, [rate]);

  /** Format an EUR amount as a localised string in the active currency */
  const format = useCallback(
    (amountInEur, options = {}) => {
      const value = amountInEur * rate;
      const decimals = options.decimals ?? meta.decimals ?? 2;

      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: meta.code,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      } catch {
        // Unknown ISO code for Intl — fall back to symbol + number
        return `${meta.symbol}${value.toFixed(decimals)}`;
      }
    },
    [meta, rate],
  );

  /** Always format in EUR — used for the "you will be charged" note */
  const formatBase = useCallback((amountInEur, options = {}) => {
    const decimals = options.decimals ?? 2;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: BASE_CURRENCY,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amountInEur);
    } catch {
      return `€${amountInEur.toFixed(decimals)}`;
    }
  }, []);

  const value = useMemo(
    () => ({
      base: BASE_CURRENCY,
      currency,
      meta,
      rate,
      country: info.country,
      detected: info.detected,
      currencies: info.currencies,
      updatedAt: info.updatedAt,
      isConverted: currency !== BASE_CURRENCY,
      isManual,
      loading,
      convert,
      format,
      formatBase,
      setCurrency,
      resetCurrency,
    }),
    [
      currency,
      meta,
      rate,
      info,
      isManual,
      loading,
      convert,
      format,
      formatBase,
      setCurrency,
      resetCurrency,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

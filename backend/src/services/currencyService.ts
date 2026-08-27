/**
 * Currency service
 * -----------------
 * - Maps the visitor's country (resolved from their IP) to a local currency.
 * - Fetches EUR-based exchange rates from a free provider and caches them
 *   in memory so we don't hit the provider on every request.
 *
 * The store always CHARGES in EUR (Lemon Squeezy). Everything here is for
 * display purposes only: showing a visitor an approximate price in the
 * currency they actually think in.
 */

export const BASE_CURRENCY = 'EUR';

export interface CurrencyMeta {
  code: string;
  symbol: string;
  name: string;
  /** Currencies with no minor unit (or huge numbers) are shown without decimals */
  decimals: number;
}

/** Currencies offered in the manual switcher (any detected currency is added on top) */
export const CURRENCIES: Record<string, CurrencyMeta> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', decimals: 0 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', decimals: 2 },
  QAR: { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', decimals: 2 },
  KWD: { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', decimals: 2 },
  BHD: { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', decimals: 2 },
  OMR: { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', decimals: 2 },
  JOD: { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', decimals: 2 },
  MAD: { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham', decimals: 0 },
  DZD: { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar', decimals: 0 },
  TND: { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', decimals: 2 },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimals: 0 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimals: 0 },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimals: 0 },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimals: 0 },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', decimals: 0 },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimals: 0 },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0 },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimals: 0 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimals: 0 },
  UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', decimals: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 0 },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', decimals: 0 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', decimals: 0 },
  LKR: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', decimals: 0 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 0 },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimals: 0 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimals: 0 },
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 0 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimals: 0 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimals: 0 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', decimals: 2 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', decimals: 0 },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', decimals: 0 },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', decimals: 0 },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', decimals: 0 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 0 },
  MXN: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', decimals: 0 },
  ARS: { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso', decimals: 0 },
  CLP: { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso', decimals: 0 },
  COP: { code: 'COP', symbol: 'COL$', name: 'Colombian Peso', decimals: 0 },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', decimals: 2 },
};

/** ISO 3166-1 alpha-2 country code -> ISO 4217 currency code */
export const COUNTRY_CURRENCY: Record<string, string> = {
  // Eurozone
  AT: 'EUR', BE: 'EUR', CY: 'EUR', DE: 'EUR', EE: 'EUR', ES: 'EUR', FI: 'EUR',
  FR: 'EUR', GR: 'EUR', HR: 'EUR', IE: 'EUR', IT: 'EUR', LT: 'EUR', LU: 'EUR',
  LV: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SI: 'EUR', SK: 'EUR', MC: 'EUR',
  AD: 'EUR', SM: 'EUR', VA: 'EUR', ME: 'EUR', XK: 'EUR',
  // Rest of Europe
  GB: 'GBP', CH: 'CHF', LI: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', IS: 'ISK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN', RS: 'RSD', BA: 'BAM',
  MK: 'MKD', AL: 'ALL', MD: 'MDL', UA: 'UAH', BY: 'BYN', RU: 'RUB', TR: 'TRY',
  // Middle East & North Africa
  EG: 'EGP', AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
  JO: 'JOD', LB: 'LBP', IQ: 'IQD', YE: 'YER', SY: 'SYP', IL: 'ILS', PS: 'ILS',
  MA: 'MAD', DZ: 'DZD', TN: 'TND', LY: 'LYD', SD: 'SDG', IR: 'IRR',
  // Africa
  NG: 'NGN', KE: 'KES', ZA: 'ZAR', GH: 'GHS', ET: 'ETB', TZ: 'TZS', UG: 'UGX',
  RW: 'RWF', ZM: 'ZMW', ZW: 'ZWL', AO: 'AOA', MZ: 'MZN', BW: 'BWP', NA: 'NAD',
  SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', NE: 'XOF', TG: 'XOF', BJ: 'XOF',
  CM: 'XAF', GA: 'XAF', CG: 'XAF', TD: 'XAF', CF: 'XAF', GQ: 'XAF',
  // Asia
  IN: 'INR', PK: 'PKR', BD: 'BDT', LK: 'LKR', NP: 'NPR', AF: 'AFN',
  CN: 'CNY', JP: 'JPY', KR: 'KRW', TW: 'TWD', HK: 'HKD', MO: 'MOP',
  SG: 'SGD', MY: 'MYR', ID: 'IDR', TH: 'THB', PH: 'PHP', VN: 'VND',
  KH: 'KHR', LA: 'LAK', MM: 'MMK', BN: 'BND', MN: 'MNT',
  KZ: 'KZT', UZ: 'UZS', AZ: 'AZN', GE: 'GEL', AM: 'AMD', KG: 'KGS', TJ: 'TJS',
  // Americas
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP',
  PE: 'PEN', UY: 'UYU', PY: 'PYG', BO: 'BOB', VE: 'VES', EC: 'USD', PA: 'USD',
  CR: 'CRC', GT: 'GTQ', DO: 'DOP', JM: 'JMD', TT: 'TTD', CU: 'CUP',
  // Oceania
  AU: 'AUD', NZ: 'NZD', FJ: 'FJD', PG: 'PGK',
};

const RATES_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const GEO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 4000;

const RATES_URL =
  process.env.EXCHANGE_RATES_URL || 'https://open.er-api.com/v6/latest/EUR';

/**
 * Offline fallback (approximate, EUR base). Only used when the rates provider
 * is unreachable, so a visitor still sees a sane local price instead of nothing.
 */
const FALLBACK_RATES: Record<string, number> = {
  EUR: 1, USD: 1.08, GBP: 0.85, EGP: 53, AED: 3.97, SAR: 4.06, QAR: 3.94,
  KWD: 0.33, BHD: 0.41, OMR: 0.42, JOD: 0.77, MAD: 10.7, DZD: 145, TND: 3.37,
  TRY: 37, CHF: 0.95, SEK: 11.5, NOK: 11.8, DKK: 7.46, PLN: 4.3, CZK: 25,
  HUF: 395, RON: 4.97, RUB: 105, UAH: 45, INR: 91, PKR: 300, BDT: 129,
  LKR: 320, NGN: 1750, KES: 140, ZAR: 19.5, GHS: 16.5, CNY: 7.8, JPY: 165,
  KRW: 1480, HKD: 8.4, SGD: 1.45, MYR: 4.8, IDR: 17000, THB: 37, PHP: 62,
  VND: 27000, AUD: 1.65, NZD: 1.8, CAD: 1.5, BRL: 6.2, MXN: 21, ARS: 1080,
  CLP: 1030, COP: 4700, ILS: 4,
};

interface RatesCache {
  rates: Record<string, number>;
  fetchedAt: number;
  source: 'live' | 'fallback';
}

let ratesCache: RatesCache | null = null;
const geoCache = new Map<string, { country: string | null; fetchedAt: number }>();

const fetchWithTimeout = async (url: string, timeout = FETCH_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

/** EUR-based exchange rates, cached in memory for RATES_TTL_MS */
export const getRates = async (): Promise<RatesCache> => {
  const now = Date.now();
  if (ratesCache && now - ratesCache.fetchedAt < RATES_TTL_MS) {
    return ratesCache;
  }

  try {
    const response = await fetchWithTimeout(RATES_URL);
    if (!response.ok) throw new Error(`Rates provider returned ${response.status}`);

    const data: any = await response.json();
    const rates = data?.rates || data?.conversion_rates || data?.data;

    if (!rates || typeof rates !== 'object' || !rates.USD) {
      throw new Error('Unexpected rates payload');
    }

    ratesCache = { rates: { ...rates, EUR: 1 }, fetchedAt: now, source: 'live' };
    return ratesCache;
  } catch (error: any) {
    console.error('[currency] Failed to fetch exchange rates:', error.message);
    // Keep serving the last good rates if we have them, even if stale.
    if (ratesCache) return ratesCache;
    ratesCache = { rates: FALLBACK_RATES, fetchedAt: now, source: 'fallback' };
    return ratesCache;
  }
};

/** Best-effort client IP, honouring the proxy headers Vercel/Cloudflare set */
export const getClientIp = (req: any): string | null => {
  const forwarded = req.headers['x-forwarded-for'];
  const candidate =
    (typeof forwarded === 'string' ? forwarded.split(',')[0] : undefined) ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    req.ip;

  if (!candidate) return null;
  return String(candidate).trim().replace(/^::ffff:/, '');
};

const isPrivateIp = (ip: string) =>
  !ip ||
  ip === '::1' ||
  ip === '127.0.0.1' ||
  /^10\./.test(ip) ||
  /^192\.168\./.test(ip) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  /^169\.254\./.test(ip) ||
  /^fc00:/i.test(ip) ||
  /^fe80:/i.test(ip);

/**
 * Resolve the visitor's country.
 * 1. Edge headers (Vercel / Cloudflare) — free and instant.
 * 2. IP geolocation lookup as a fallback (cached per IP).
 */
export const detectCountry = async (req: any): Promise<string | null> => {
  const headerCountry =
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['x-country-code'] ||
    req.headers['x-geo-country'];

  if (typeof headerCountry === 'string' && /^[A-Za-z]{2}$/.test(headerCountry)) {
    return headerCountry.toUpperCase();
  }

  const ip = getClientIp(req);
  if (!ip || isPrivateIp(ip)) return null;

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.fetchedAt < GEO_TTL_MS) {
    return cached.country;
  }

  try {
    const response = await fetchWithTimeout(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
    );
    if (!response.ok) throw new Error(`Geo provider returned ${response.status}`);

    const data: any = await response.json();
    const country =
      typeof data?.country_code === 'string' && /^[A-Za-z]{2}$/.test(data.country_code)
        ? data.country_code.toUpperCase()
        : null;

    geoCache.set(ip, { country, fetchedAt: Date.now() });
    return country;
  } catch (error: any) {
    console.error('[currency] Geo lookup failed:', error.message);
    geoCache.set(ip, { country: null, fetchedAt: Date.now() });
    return null;
  }
};

export const currencyForCountry = (country: string | null): string => {
  if (!country) return BASE_CURRENCY;
  return COUNTRY_CURRENCY[country.toUpperCase()] || BASE_CURRENCY;
};

export const metaForCurrency = (code: string): CurrencyMeta =>
  CURRENCIES[code] || { code, symbol: code, name: code, decimals: 2 };

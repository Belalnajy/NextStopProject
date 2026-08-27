import { Request, Response } from 'express';
import {
  BASE_CURRENCY,
  CURRENCIES,
  currencyForCountry,
  detectCountry,
  getRates,
  metaForCurrency,
} from '../services/currencyService';

/**
 * GET /api/currency
 * Detects the visitor's country from their IP (or edge headers) and returns
 * the matching local currency together with EUR-based exchange rates, so the
 * frontend can display prices locally without another round trip.
 */
export const getCurrencyInfo = async (req: Request, res: Response) => {
  try {
    const [country, ratesCache] = await Promise.all([
      detectCountry(req),
      getRates(),
    ]);

    const { rates, fetchedAt, source } = ratesCache;

    const detectedCurrency = currencyForCountry(country);
    // Only use the detected currency if we actually have a rate for it.
    const currency =
      rates[detectedCurrency] && detectedCurrency !== BASE_CURRENCY
        ? detectedCurrency
        : BASE_CURRENCY;

    // The switcher list: our curated currencies + whatever we detected.
    const codes = new Set([...Object.keys(CURRENCIES), currency]);
    const currencies = [...codes]
      .filter((code) => code === BASE_CURRENCY || typeof rates[code] === 'number')
      .map((code) => ({ ...metaForCurrency(code), rate: rates[code] ?? 1 }))
      .sort((a, b) => a.code.localeCompare(b.code));

    // Response depends on the caller's IP, so it must never be shared by a CDN.
    res.set('Cache-Control', 'private, max-age=3600');

    res.json({
      base: BASE_CURRENCY,
      country,
      currency,
      detected: Boolean(country) && currency !== BASE_CURRENCY,
      rate: rates[currency] ?? 1,
      symbol: metaForCurrency(currency).symbol,
      currencies,
      source,
      updatedAt: new Date(fetchedAt).toISOString(),
    });
  } catch (error: any) {
    console.error('[currency] getCurrencyInfo failed:', error.message);
    // Never break the page over a currency lookup — fall back to EUR.
    res.json({
      base: BASE_CURRENCY,
      country: null,
      currency: BASE_CURRENCY,
      detected: false,
      rate: 1,
      symbol: '€',
      currencies: [{ ...metaForCurrency(BASE_CURRENCY), rate: 1 }],
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * GET /api/currency/convert?amount=97&to=EGP&from=EUR
 * Simple converter endpoint (amounts are for display only — checkout is in EUR).
 */
export const convertCurrency = async (req: Request, res: Response) => {
  try {
    const amount = Number(req.query.amount);
    const from = String(req.query.from || BASE_CURRENCY).toUpperCase();
    const to = String(req.query.to || BASE_CURRENCY).toUpperCase();

    if (!Number.isFinite(amount)) {
      return res.status(400).json({ message: 'A numeric "amount" is required' });
    }

    const { rates, fetchedAt, source } = await getRates();
    const fromRate = from === BASE_CURRENCY ? 1 : rates[from];
    const toRate = to === BASE_CURRENCY ? 1 : rates[to];

    if (!fromRate || !toRate) {
      return res.status(400).json({ message: 'Unsupported currency code' });
    }

    const converted = (amount / fromRate) * toRate;

    res.json({
      amount,
      from,
      to,
      rate: toRate / fromRate,
      converted,
      symbol: metaForCurrency(to).symbol,
      decimals: metaForCurrency(to).decimals,
      source,
      updatedAt: new Date(fetchedAt).toISOString(),
    });
  } catch (error: any) {
    console.error('[currency] convertCurrency failed:', error.message);
    res.status(500).json({ message: 'Currency conversion failed' });
  }
};

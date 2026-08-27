/**
 * Single source of truth for the visa fees, in the base currency (EUR).
 * Checkout always happens in EUR — other currencies are display conversions
 * handled by CurrencyContext.
 */
export const FEES = {
  government: 16,
  service: 81,
  total: 97,
};

export default FEES;

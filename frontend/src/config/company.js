/**
 * Company contact details, used as the fallback whenever the dashboard
 * settings don't provide a value.
 */
export const COMPANY_EMAIL = 'support@nextstopvisa.com';

/** Display form; the tel: link strips the spaces. */
export const COMPANY_PHONE = '+20 12 71602944';

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

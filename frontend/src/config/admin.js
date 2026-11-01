/**
 * The admin login is deliberately not linked from the public site. While the
 * payment gateway reviews the site, reviewers must not run into a login page.
 * Override with VITE_ADMIN_LOGIN_PATH at build time if needed.
 */
export const ADMIN_LOGIN_PATH =
  import.meta.env.VITE_ADMIN_LOGIN_PATH || '/nsv-team-access';

import { motion } from 'framer-motion';

export default function CookiePage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">
            Cookie Policy
          </h1>
          <p className="lead text-xl text-slate-600 mb-8">
            Last updated: February 12, 2026. This Cookie Policy explains how
            NextStop Visa uses cookies and similar technologies to recognize you
            when you visit our website.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            1. What are cookies?
          </h2>
          <p className="text-slate-600 mb-4">
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            2. Why do we use cookies?
          </h2>
          <p className="text-slate-600 mb-4">
            We use essential cookies to ensure our website functions correctly,
            especially during the application process. We also use analytics
            cookies to understand how visitors interact with our site, enabling
            us to improve user experience.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>
              Essential Cookies: Required for the operation of our service.
            </li>
            <li>
              Analytics Cookies: Help us analyze website traffic and usage.
            </li>
            <li>
              Functional Cookies: Remember your preferences and language
              settings.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            3. How can I control cookies?
          </h2>
          <p className="text-slate-600 mb-4">
            You have the right to decide whether to accept or reject cookies.
            You can set or amend your web browser controls to accept or refuse
            cookies. If you choose to reject cookies, you may still use our
            website though your access to some functionality and areas of our
            website may be restricted.
          </p>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-primary mb-2">Contact Us</h3>
            <p className="text-slate-600">
              If you have any questions about our use of cookies, please contact
              us at{' '}
              <a
                href="mailto:privacy@nextstopvisa.com"
                className="text-accent hover:underline">
                privacy@nextstopvisa.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

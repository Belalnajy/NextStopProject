import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">
            Terms and Conditions
          </h1>
          <p className="lead text-xl text-slate-600 mb-8">
            Last updated: February 12, 2026. Please read these terms and
            conditions carefully before using Our Service.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-600 mb-4">
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement. In addition,
            when using these particular services, you shall be subject to any
            posted guidelines or rules applicable to such services.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            2. Service Description
          </h2>
          <p className="text-slate-600 mb-4">
            NextStop Visa provides a private value-added service to assist
            residents with their Electronic Travel Authorization (ETA)
            applications for the United Kingdom. We are not affiliated with the
            UK Government.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            3. Application Processing
          </h2>
          <p className="text-slate-600 mb-4">
            While we strive to ensure all applications are processed correctly
            and in a timely manner, the final decision lies with the UK Home
            Office. We cannot guarantee approval of any application.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            4. Refund Policy
          </h2>
          <p className="text-slate-600 mb-4">
            Our service fees are non-refundable once the application has been
            submitted to the government authorities. If your application is
            rejected, please contact our support team for assistance.
          </p>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-primary mb-2">Contact Us</h3>
            <p className="text-slate-600">
              If you have any questions about these Terms, please contact us at{' '}
              <a
                href="mailto:legal@nextstopvisa.com"
                className="text-accent hover:underline">
                legal@nextstopvisa.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

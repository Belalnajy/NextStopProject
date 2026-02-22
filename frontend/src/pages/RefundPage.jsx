import { motion } from 'framer-motion';

export default function RefundPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">
            Refund Policy
          </h1>
          <p className="lead text-xl text-slate-600 mb-8">
            Last updated: February 12, 2026. This Refund Policy describes our
            procedures concerning refunds and cancellations for ETA
            applications.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            1. Refund Eligibility
          </h2>
          <p className="text-slate-600 mb-4">
            We offer refunds for our service fee ONLY if your application has
            not yet been submitted to the UK Government authorities. Our
            processing team works efficiently, and often applications are
            submitted shortly after we receive your payment and details.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            2. Non-Refundable Fees
          </h2>
          <p className="text-slate-600 mb-4">
            Once an application has been submitted to the government, it becomes
            impossible to withdraw it or recover the government fee. Therefore,
            at that point, the entire fee (including government fee and our
            service fee) is strictly non-refundable. We cannot issue refunds for
            applications that are rejected or delayed by the UK Home Office.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            3. How to Request a Refund
          </h2>
          <p className="text-slate-600 mb-4">
            To request a cancellation and refund, you must contact us
            immediately after applying. Please provide your Application
            Reference Number and your full name.
          </p>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-primary mb-2">Contact Us</h3>
            <p className="text-slate-600">
              For refund inquiries, please contact our support team at{' '}
              <a
                href="mailto:support@nextstopvisa.com"
                className="text-accent hover:underline">
                support@nextstopvisa.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

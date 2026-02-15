import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">
            Privacy Policy
          </h1>
          <p className="lead text-xl text-slate-600 mb-8">
            Your privacy is important to us. It is NextStop Visa's policy to
            respect your privacy regarding any information we may collect from
            you across our website.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-slate-600 mb-4">
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we’re
            collecting it and how it will be used.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Passport details for visa processing</li>
            <li>Contact information (email, phone number)</li>
            <li>
              Payment details (processed securely via third-party providers)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            2. Data Security
          </h2>
          <p className="text-slate-600 mb-4">
            We employ industry-standard security measures to protect your
            personal information from unauthorized access, alteration,
            disclosure, or destruction. All data transmission is encrypted using
            SSL technology.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            3. Sharing of Information
          </h2>
          <p className="text-slate-600 mb-4">
            We do not share any personally identifying information publicly or
            with third-parties, except when required to by law or to process
            your government application.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            4. Cookies
          </h2>
          <p className="text-slate-600 mb-4">
            We use cookies to help improve your experience of our website. This
            privacy policy covers the use of cookies between your device and our
            site.
          </p>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-primary mb-2">Privacy Officer</h3>
            <p className="text-slate-600">
              For any privacy-related concerns, please contact our Data
              Protection Officer at{' '}
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

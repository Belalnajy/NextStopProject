import { motion } from 'framer-motion';

const points = [
  {
    title: 'Who Needs It',
    description:
      'Nationals from countries that do not need a visa to visit the UK for short stays.',
  },
  {
    title: 'Who is Exempt',
    description:
      'British and Irish citizens, and those with legal permission to live, work, or study in the UK (e.g., BRP holders, visas, settled status) do not need an ETA.',
  },
  {
    title: 'Purpose',
    description:
      'Short visits (tourism, family/friends, business, transit) of up to 6 months, or up to 3 months for the Creative Worker visa concession.',
  },
  {
    title: 'Validity',
    description:
      'The ETA lasts for 2 years and allows for multiple journeys.',
  },
];

const EligibilityPage = () => {
  return (
    <div className="bg-slate-50 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-10 sm:px-10 sm:py-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">
              ETA to the UK
            </p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-3">
              Key Eligibility & Requirements
            </h1>
            <p className="text-gray-600">
              Review the key rules below to understand who needs an Electronic
              Travel Authorisation (ETA) before travelling to the UK.
            </p>
          </div>

          <div className="space-y-6">
            {points.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="rounded-2xl bg-slate-50/80 border border-slate-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-primary mb-1">
                  {item.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EligibilityPage;


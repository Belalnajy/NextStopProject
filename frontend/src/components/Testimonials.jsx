import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    name: 'Sarah Al-Rashid',
    country: 'UAE',
    rating: 5,
    text: 'Fast and smooth process. I received my ETA within 2 days. The team was incredibly helpful and responsive throughout the entire application.',
  },
  {
    name: 'Marco Fernandez',
    country: 'Brazil',
    rating: 5,
    text: 'Very professional service. The step-by-step guidance made the application effortless. Highly recommended for anyone traveling to the UK.',
  },
  {
    name: 'Yuki Tanaka',
    country: 'Japan',
    rating: 5,
    text: 'Excellent experience from start to finish. The online process was simple and my ETA was approved quickly. Will definitely use again.',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
        }
      />
    ))}
  </div>
);

const Testimonials = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section className="py-28 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <motion.div
        className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            {t('home.testimonials.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            {t('home.testimonials.title')}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-1 bg-linear-to-r from-accent to-accent-light mx-auto mb-8 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('home.testimonials.subtitle')}
          </motion.p>
        </div>

        {/* Testimonial Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
              whileHover={{ y: -8 }}>
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-accent/20 via-primary/10 to-accent/20 rounded-4xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group-hover:border-accent/30 group-hover:shadow-lg transition-all duration-500 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote
                    size={32}
                    className="text-accent/30 group-hover:text-accent/50 transition-colors"
                  />
                </div>

                {/* Stars */}
                <StarRating rating={testimonial.rating} />

                {/* Quote Text */}
                <p className="text-gray-600 leading-relaxed mb-6 grow italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {testimonial.country}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

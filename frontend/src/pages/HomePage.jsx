import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import TrustIndicators from '../components/TrustIndicators';
import HowToApply from '../components/HowToApply';
import Testimonials from '../components/Testimonials';
import Requirements from '../components/Requirements';
import FAQ from '../components/FAQ';

const HomePage = () => {
  return (
    <div className="bg-white">
      <Hero />
      <InfoSection />
      <TrustIndicators />
      <HowToApply />
      <Testimonials />
      <Requirements />
      <FAQ />
    </div>
  );
};

export default HomePage;

import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import HowToApply from '../components/HowToApply';
import Requirements from '../components/Requirements';
import FAQ from '../components/FAQ';

const HomePage = () => {
  return (
    <div className="bg-white">
      <Hero />
      <HowToApply />
      <Requirements />
      <FAQ />
    </div>
  );
};

export default HomePage;

import HeroSection from '@/components/blocks/hero';
import FeaturesSection from '@/components/blocks/features';
import Features2Section from '@/components/blocks/features2';
import CallToActionSection from '@/components/blocks/calltoaction';
import StatsSection from '@/components/blocks/stats';
import FaqSection from '@/components/blocks/faqs';
import ContentSection from '@/components/blocks/content-section';
import HomeBackground from '@/components/blocks/home-background';

export function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <HomeBackground />
      <div className="relative z-10 flex flex-col">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <Features2Section />
        <ContentSection />
        <FaqSection />
        <CallToActionSection />
      </div>
    </div>
  );
}

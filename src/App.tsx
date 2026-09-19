import React, { Suspense, lazy } from 'react';
import { Navbar, Footer } from './components/layout';
import { HeroSlider } from './components/home/HeroSlider';
import { MarqueeSection } from './components/home/MarqueeSection';
import { WelcomeSection } from './components/home/WelcomeSection';
import { MajorServicesSlider } from './components/home/MajorServicesSlider';
import { EmergencyCtaBanner } from './components/home/EmergencyCtaBanner';
import { PremierHvacSection } from './components/home/PremierHvacSection';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { HvacEstimatorProvider } from './context/HvacEstimatorContext';
import { useSplitTextLinks } from './utils/useSplitTextLinks';
import { useLenis } from './hooks/useLenis';

// Lazy load below-the-fold and heavy 3D components for low-network acceleration
const ServiceAreaGlobe = lazy(() =>
  import('./components/home/ServiceAreaGlobe').then((m) => ({ default: m.ServiceAreaGlobe }))
);
const BeforeAfterSection = lazy(() =>
  import('./components/home/BeforeAfterSection').then((m) => ({ default: m.BeforeAfterSection }))
);
const TestimonialsSection = lazy(() =>
  import('./components/home/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection }))
);
const FinancingCalculator = lazy(() =>
  import('./components/home/FinancingCalculator').then((m) => ({ default: m.FinancingCalculator }))
);
const FaqSection = lazy(() =>
  import('./components/home/FaqSection').then((m) => ({ default: m.FaqSection }))
);
const BlogSection = lazy(() =>
  import('./components/home/BlogSection').then((m) => ({ default: m.BlogSection }))
);
const FloatingHvacWidget = lazy(() =>
  import('./components/home/FloatingHvacWidget').then((m) => ({ default: m.FloatingHvacWidget }))
);

const SectionPlaceholder: React.FC<{ minHeight?: string }> = ({ minHeight = 'min-h-[400px]' }) => (
  <div className={`w-full ${minHeight} bg-slate-50/50 flex items-center justify-center`} />
);

export default function App() {
  useLenis();
  useSplitTextLinks();

  return (
    <HvacEstimatorProvider>
      {/* Global Sticky Navbar */}
      <Navbar />

      <div className="w-full min-h-screen flex flex-col bg-slate-50 text-zinc-900 overflow-x-hidden">
        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[100vw] flex flex-col items-center justify-start p-0 m-0">
          {/* 1. Cinematic Hero with Instant Cost Estimator (Critical LCP - Eager) */}
          <HeroSlider />

          {/* 2. Infinite Scrolling Trust Signals & Credential Marquee (Eager) */}
          <MarqueeSection />

          {/* 3. Cinematic Brand Welcome & Craftsmanship Philosophy (Eager) */}
          <WelcomeSection />

          {/* 4. Major Services Pinned Horizontal Slider with Video BG & Grid Switcher (Eager) */}
          <MajorServicesSlider />

          {/* 5. High-Impact Emergency CTA Banner (Eager) */}
          <EmergencyCtaBanner />

          {/* 6. Premier HVAC Contractor Differentiators & Technical Grid (Eager) */}
          <PremierHvacSection />

          {/* 7. Interactive 3D WebGL Particle Globe Service Area */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[600px]" />}>
            <ServiceAreaGlobe />
          </Suspense>

          {/* 8. 4-Step Process: How It Works From Dispatch to Sign-off */}
          <HowItWorksSection />

          {/* 9. Visual Proof: Interactive Before & After System Replacements */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[500px]" />}>
            <BeforeAfterSection />
          </Suspense>

          {/* 10. Social Proof: Customer Testimonials Masonry Grid */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[500px]" />}>
            <TestimonialsSection />
          </Suspense>

          {/* 11. Financial Affordability: 0% APR Financing Calculator */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[400px]" />}>
            <FinancingCalculator />
          </Suspense>

          {/* 12. Objection Handling: Frequently Asked Questions Accordion */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[400px]" />}>
            <FaqSection />
          </Suspense>

          {/* 13. Authority & Education: HVAC Learning Blog & Article Reader */}
          <Suspense fallback={<SectionPlaceholder minHeight="min-h-[400px]" />}>
            <BlogSection />
          </Suspense>

          {/* 14. Site Footer */}
          <Footer />
        </main>

        {/* Floating Scroll-Driven Cost Estimator Widget */}
        <Suspense fallback={null}>
          <FloatingHvacWidget />
        </Suspense>
      </div>
    </HvacEstimatorProvider>
  );
}




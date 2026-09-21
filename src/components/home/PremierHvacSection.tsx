import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldCheck,
  Wrench,
  BadgeCheck,
  Tag,
  Heart,
  Sparkles,
  FileCheck,
  Building2,
  GalleryHorizontalEnd,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ValueCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const valueCards: ValueCardItem[] = [
  {
    id: 'satisfaction-guarantee',
    number: '01',
    title: '100% Satisfaction Guarantee or Your Money Back',
    description:
      "Our customer-centric approach prioritizes your experience, ensuring it's completely risk-free.",
    icon: ShieldCheck,
    badge: 'Risk-Free Guarantee',
  },
  {
    id: 'makes-and-models',
    number: '02',
    title: 'Service for Many Makes and Models',
    description:
      'Our extensive experience and ready part availability ensure quick solutions, keeping us prepared for any HVAC challenge.',
    icon: Wrench,
    badge: 'Multi-Brand Expertise',
  },
  {
    id: 'certified-technicians',
    number: '03',
    title: 'Certified Technicians',
    description:
      'Our trained staff ensure efficiency and cost-effectiveness, saving you time and money by getting it right the first time with only necessary repairs',
    icon: BadgeCheck,
    badge: 'Licensed Experts',
  },
  {
    id: 'fair-pricing',
    number: '04',
    title: 'Exceptional Service with Fair Pricing',
    description:
      'We prioritize transparency and honesty, ensuring you only pay for what you need—no overcharging or unnecessary add-ons.',
    icon: Tag,
    badge: 'Upfront Quotes',
  },
  {
    id: 'treat-like-family',
    number: '05',
    title: 'Treat Customers Like Family',
    description:
      'We ensure a pleasant, supportive experience from start to finish, making a positive difference during potentially frustrating times.',
    icon: Heart,
    badge: 'Family First',
  },
  {
    id: 'embrace-innovation',
    number: '06',
    title: 'Embrace Innovation',
    description:
      'We continuously learn the latest HVAC technologies to offer smart, effective integration options tailored for your home, enhancing comfort and efficiency.',
    icon: Sparkles,
    badge: 'Smart Tech',
  },
  {
    id: 'free-second-opinions',
    number: '07',
    title: 'Free Second Opinions',
    description:
      'No Pushy Sales: Our non-commission only approach ensures you receive only the best, unbiased options for your HVAC needs.',
    icon: FileCheck,
    badge: 'Unbiased Guidance',
  },
  {
    id: 'locally-owned',
    number: '08',
    title: 'Locally Owned and Operated',
    description:
      "As a local business, we deeply understand and care about our community's needs, offering more personalized service than large, investor-driven firms.",
    icon: Building2,
    badge: 'Community First',
  },
];

interface ValueCardProps {
  item: ValueCardItem;
  className?: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ item, className = '' }) => {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = rectRef.current || cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden block rounded-[8px] border-none p-6 sm:p-7 bg-[#ECEDEF] text-left transform-gpu hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between select-none ${className}`}
    >
      {/* Base Grid Pattern Hover Effect using #2934ce */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(41, 52, 206, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(41, 52, 206, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
        }}
      />

      {/* Interactive Spotlight on #2934ce grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(41, 52, 206, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(41, 52, 206, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(160px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
          WebkitMaskImage: 'radial-gradient(160px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
        }}
      />

      {/* Soft ambient glow in #2934ce centered at cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: 'radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(41, 52, 206, 0.08), transparent 80%)',
        }}
      />

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-[8px] bg-[#121417] text-white flex items-center justify-center group-hover:bg-[#2934ce] group-hover:scale-105 transition-transform duration-300">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-['Delight'] font-bold uppercase tracking-wider text-[#121417]/70 bg-[#FFFFFF] group-hover:bg-[#2934ce]/10 group-hover:text-[#2934ce] px-2.5 py-1 rounded-[8px] border border-[#121417]/10 group-hover:border-[#2934ce]/25 transition-colors">
            {item.badge}
          </span>
        </div>

        {/* Card Title */}
        <h3 className="font-['Delight'] font-medium text-[19px] uppercase tracking-wide text-[#121417] mb-3 group-hover:text-[#2934ce] transition-colors duration-300 leading-snug">
          {item.title}
        </h3>

        {/* Card Description */}
        <p className="font-['Delight'] font-normal text-xs sm:text-sm text-[#121417]/80 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Bottom Card Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#121417]/15 flex items-center justify-between text-xs font-['Delight'] font-bold text-[#121417]/60">
        <span className="text-[#121417] group-hover:text-[#2934ce] transition-colors">{item.number}</span>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#121417] group-hover:text-[#2934ce] transition-colors" />
          <span className="group-hover:text-[#121417] transition-colors">Trusted Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export const PremierHvacSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('grid');

  const sectionRef = useRef<HTMLElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Initialize and manage GSAP Horizontal Pin ScrollTrigger
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const ctx = gsap.context(() => {
      if (viewMode !== 'slider') {
        ScrollTrigger.refresh();
        return;
      }

      const section = sectionRef.current;
      const track = trackRef.current;
      const wrapper = trackWrapperRef.current;
      if (!section || !track || !wrapper) return;

      const getScrollDistance = () => Math.max(0, track.scrollWidth - wrapper.clientWidth);

      // Create hardware-accelerated pin tween
      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'premier-hvac-pin',
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: () => `+=${Math.max(getScrollDistance(), 800)}`,
          scrub: 0.6,
          anticipatePin: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger || null;

      // Delayed refresh to ensure DOM has fully painted
      timer = setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 100);
    }, sectionRef);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      ScrollTrigger.refresh();
    };
  }, [viewMode]);

  return (
    <section
      id="premier-hvac-section"
      ref={sectionRef}
      className="relative w-full max-w-[100vw] min-h-screen bg-[#FFFFFF] text-[#121417] pt-[20px] pr-0 pb-[20px] pl-[20px] overflow-hidden select-none border-t border-b border-[#ECEDEF] flex flex-col justify-between"
    >
      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between flex-1">
        {/* Top Header Row */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ECEDEF] pr-[20px]">
          {/* Heading and Intro Paragraph */}
          <div className="space-y-3 text-left max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECEDEF] border border-[#121417]/10 text-[#121417] text-xs font-['Delight'] font-bold tracking-widest uppercase">
              <span>Why Customers Entrust Us</span>
            </div>
            <h2 className="font-['Nohemi'] font-bold text-3xl sm:text-4xl lg:text-5xl text-[#121417] capitalize tracking-tight leading-tight">
              A Premier HVAC Contractor
            </h2>
            <p className="font-['Delight'] font-normal text-xs sm:text-sm text-[#121417]/80 leading-relaxed">
              Finding a reliable HVAC contractor whom we could refer to our families and friends was
              always a problem. Our experience as distributors had shown us the extremes of the
              industry, inspiring us to establish an HVAC company that defies the negative norms.
              When customers call us looking for heating and cooling experts, we don’t deceive them
              to earn their business dubiously. We offer comprehensive HVAC solutions, providing
              transparent information every step of the way. Here’s why customers entrust us
            </p>
          </div>

          {/* View Mode Pill Toggle */}
          <div className="flex items-center p-1 bg-[#ECEDEF] border border-zinc-300/80 rounded-full relative shadow-inner self-start md:self-end shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              aria-label="Horizontal slider view"
              title="Horizontal slider view"
              className={`relative px-3 py-2 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center z-10 ${
                viewMode === 'slider' ? 'text-white' : 'text-[#121417] hover:text-[#121417]'
              }`}
            >
              {viewMode === 'slider' && (
                <motion.div
                  layoutId="whyUsViewPillInline"
                  className="absolute inset-0 bg-[#121417] rounded-full shadow-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <GalleryHorizontalEnd className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
              className={`relative px-3 py-2 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center z-10 ${
                viewMode === 'grid' ? 'text-white' : 'text-[#121417] hover:text-[#121417]'
              }`}
            >
              {viewMode === 'grid' && (
                <motion.div
                  layoutId="whyUsViewPillInline"
                  className="absolute inset-0 bg-[#121417] rounded-full shadow-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode 1: Pinned Horizontal Scroll Trigger Slider */}
        {viewMode === 'slider' && (
          <div ref={trackWrapperRef} className="w-full my-auto overflow-hidden py-6">
            <div
              ref={trackRef}
              className="flex gap-5 sm:gap-6 w-max transform-gpu will-change-transform"
            >
              {valueCards.map((item) => (
                <ValueCard
                  key={item.id}
                  item={item}
                  className="w-[85vw] sm:w-[44vw] lg:w-[calc((100vw-130px)/4)] min-h-[380px] sm:min-h-[400px] shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Responsive Grid View (Showing 4 Cards per Row) */}
        {viewMode === 'grid' && (
          <div className="w-full my-auto py-6 pr-[20px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {valueCards.map((item) => (
                <ValueCard
                  key={item.id}
                  item={item}
                  className="w-full min-h-[360px]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

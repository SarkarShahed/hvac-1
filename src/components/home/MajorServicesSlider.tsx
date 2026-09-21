import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldCheck,
  Wind,
  Layers,
  ArrowRight,
  CheckCircle2,
  Snowflake,
  Flame,
  Building2,
  Cpu,
  MapPin,
  GalleryHorizontalEnd,
  LayoutGrid
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ServiceCardItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  badge: string;
  features: string[];
  href: string;
}

const serviceItems: ServiceCardItem[] = [
  {
    id: 'ac-heatpumps',
    number: '01',
    title: 'AC & Heat Pumps',
    subtitle: 'Installation, Repairs & Tune-ups',
    description:
      'Install, repair and maintain air conditioners and heat pumps.',
    icon: Snowflake,
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=70&w=750&auto=format&fit=crop',
    badge: 'Cooling Specialist',
    features: ['High-efficiency split systems', 'Heat pump optimization', 'Refrigerant leak fixes'],
    href: '#estimate',
  },
  {
    id: 'furnaces',
    number: '02',
    title: 'Furnaces',
    subtitle: 'Heating Systems & Seasonal Care',
    description:
      'Install, repair and maintain furnaces.',
    icon: Flame,
    image:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=70&w=750&auto=format&fit=crop',
    badge: 'Heating Specialist',
    features: ['Gas & electric setups', 'Heat exchanger audits', 'Pilot & ignition repair'],
    href: '#estimate',
  },
  {
    id: 'mini-splits',
    number: '03',
    title: 'Ductless Mini-Splits',
    subtitle: 'Zoned Comfort & Ductless Setups',
    description:
      'Install, repair and maintain ductless mini-splits.',
    icon: Wind,
    image:
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=70&w=750&auto=format&fit=crop',
    badge: 'Zoned Climate Control',
    features: ['Multi-zone configurations', 'Whisper-quiet performance', 'No ductwork required'],
    href: '#estimate',
  },
  {
    id: 'indoor-air-quality',
    number: '04',
    title: 'Indoor Air Quality',
    subtitle: 'IAQ Verification & Diagnostics',
    description:
      'Indoor air quality services, including IAQ checkups.',
    icon: ShieldCheck,
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=70&w=750&auto=format&fit=crop',
    badge: 'Pure Breathing Air',
    features: ['Full allergen screening', 'HEPA filter setups', 'UV germicidal systems'],
    href: '#estimate',
  },
  {
    id: 'commercial-hvac',
    number: '05',
    title: 'Commercial HVAC',
    subtitle: 'Small Business & Light Commercial',
    description:
      'Small business/light commercial HVAC services.',
    icon: Building2,
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=70&w=750&auto=format&fit=crop',
    badge: 'Business Partner',
    features: ['Rooftop package units', 'Preventative contracts', 'Minimal business downtime'],
    href: '#estimate',
  },
  {
    id: 'smart-thermostats',
    number: '06',
    title: 'Smart Thermostats',
    subtitle: 'Smart Home HVAC Automation',
    description:
      'Programmable/smart thermostat sales and installation.',
    icon: Cpu,
    image:
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=70&w=750&auto=format&fit=crop',
    badge: 'Smart Automation',
    features: ['Nest & Ecobee experts', 'Scheduled heat tuning', 'Mobile app control setup'],
    href: '#estimate',
  },
  {
    id: 'ductwork',
    number: '07',
    title: 'Ductwork',
    subtitle: 'Custom Duct Sealing & Repairs',
    description:
      'Ductwork repair and duct sealing services.',
    icon: Layers,
    image:
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=70&w=750&auto=format&fit=crop',
    badge: 'Energy Savings',
    features: ['Airflow leak detection', 'Sealing with aerosol sealant', 'Insulation wrapping'],
    href: '#estimate',
  },
  {
    id: 'phoenix-repairs',
    number: '08',
    title: 'Phoenix Repairs',
    subtitle: 'Reliable Valley Air Solutions',
    description:
      'Long-lasting HVAC repairs in the Phoenix, AZ, area.',
    icon: MapPin,
    image:
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=70&w=750&auto=format&fit=crop',
    badge: 'Valley Service',
    features: ['Rapid extreme-heat dispatch', 'EPA certified repairs', 'True locally-backed care'],
    href: '#estimate',
  },
];

export const MajorServicesSlider: React.FC = () => {
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('grid');

  const sectionRef = useRef<HTMLElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Initialize and manage GSAP Horizontal Pin ScrollTrigger with proper cleanup and refresh
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
          id: 'major-services-pin',
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
      id="major-services-slider-section"
      ref={sectionRef}
      className="relative w-full max-w-[100vw] bg-[#FFFFFF] text-[#121417] overflow-hidden p-0 select-none border-t border-b border-[#ECEDEF]"
    >
      {/* Lightweight Ambient Pattern Overlay (0% CPU / GPU lag) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#FFFFFF]" />
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#121417 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col justify-between min-h-screen py-8 sm:py-12 px-[20px]">
        {/* Top Header Row: Title & Floating Pill Nav */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ECEDEF]">
          {/* Section Heading */}
          <div className="space-y-2 text-left">
            <h2 className="font-['Nohemi'] font-bold text-3xl sm:text-5xl lg:text-6xl text-[#121417] capitalize tracking-tight leading-none text-left">
              Major Services
            </h2>
            <p className="font-['Delight'] font-normal text-xs sm:text-sm text-zinc-600 max-w-xl text-left">
              Precision climate architecture, master-certified installations, and 24/7 emergency diagnostics engineered for uncompromising indoor comfort.
            </p>
          </div>
          
          {/* View Mode Pill Toggle */}
          <div className="flex items-center p-1 bg-[#121417]/5 border border-zinc-200/80 rounded-full relative shadow-inner self-start md:self-end">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              aria-label="Horizontal slider view"
              title="Horizontal slider view"
              className={`relative px-3 py-2 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center z-10 ${
                viewMode === 'slider' ? 'text-white' : 'text-zinc-600 hover:text-[#121417]'
              }`}
            >
              {viewMode === 'slider' && (
                <motion.div
                  layoutId="servicesViewPillInline"
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
                viewMode === 'grid' ? 'text-white' : 'text-zinc-600 hover:text-[#121417]'
              }`}
            >
              {viewMode === 'grid' && (
                <motion.div
                  layoutId="servicesViewPillInline"
                  className="absolute inset-0 bg-[#121417] rounded-full shadow-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode 1: GSAP Pin Type Horizontal Slider (3 Cards at a time in View) */}
        {viewMode === 'slider' && (
          <div ref={trackWrapperRef} className="w-full my-auto overflow-hidden py-4">
            <div
              ref={trackRef}
              className="flex gap-5 sm:gap-6 w-max transform-gpu will-change-transform"
            >
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="group relative block w-[85vw] sm:w-[46vw] lg:w-[calc((100vw-110px)/3)] h-[480px] sm:h-[500px] lg:h-[520px] shrink-0 rounded-[8px] border-0 overflow-hidden bg-[#121417] shadow-md text-left cursor-pointer transform-gpu hover:-translate-y-1 transition-transform duration-300"
                  >
                    {/* Background Image Layer with Zoom & Contrast */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Backdrop Layer */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/75 to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 w-full h-full p-6 sm:p-7 flex flex-col justify-between text-left">
                      {/* Top Header: Number + Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-['Nohemi'] font-bold text-2xl sm:text-3xl text-white/40 group-hover:text-white transition-colors duration-200">
                          {item.number}
                        </span>
                        <span className="font-['Delight'] font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-black/60 text-white border-0 group-hover:bg-white group-hover:text-[#121417] transition-colors duration-200">
                          {item.badge}
                        </span>
                      </div>

                      {/* Bottom Description & Feature Highlights */}
                      <div className="space-y-3 pt-8 text-left">
                        <div className="w-11 h-11 rounded-[6px] bg-white text-[#121417] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <span className="font-['Delight'] font-medium text-[11px] uppercase tracking-wider text-white/60 block">
                            {item.subtitle}
                          </span>
                          <h3 className="font-['Nohemi'] font-bold text-2xl sm:text-3xl capitalize text-[#FFFFFF] tracking-tight group-hover:translate-x-1 transition-transform duration-200">
                            {item.title}
                          </h3>
                        </div>

                        <p className="font-['Delight'] font-normal text-xs sm:text-[13px] text-white/80 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Bullet Highlights */}
                        <div className="pt-2 border-t border-white/15 space-y-1.5">
                          {item.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs font-['Delight'] text-white/90">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Link Action Row */}
                        <div className="pt-3 flex items-center justify-between text-xs font-['Nohemi'] font-bold uppercase tracking-wider text-white group-hover:text-[#ECEDEF] transition-colors">
                          <span className="flex items-center gap-2">Explore Solution</span>
                          <span className="w-8 h-8 rounded-[4px] bg-white/15 group-hover:bg-white group-hover:text-[#121417] flex items-center justify-center transition-colors duration-200">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: 6-Card Responsive Grid View */}
        {viewMode === 'grid' && (
          <div className="w-full my-auto py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="group relative block w-full h-[460px] sm:h-[480px] rounded-[8px] border-0 overflow-hidden bg-[#121417] shadow-md text-left cursor-pointer transform-gpu hover:-translate-y-1 transition-transform duration-300"
                  >
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/75 to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 w-full h-full p-6 sm:p-7 flex flex-col justify-between text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-['Nohemi'] font-bold text-2xl text-white/40 group-hover:text-white transition-colors duration-200">
                          {item.number}
                        </span>
                        <span className="font-['Delight'] font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-black/60 text-white border-0 group-hover:bg-white group-hover:text-[#121417] transition-colors duration-200">
                          {item.badge}
                        </span>
                      </div>

                      <div className="space-y-3 pt-6 text-left">
                        <div className="w-10 h-10 rounded-[6px] bg-white text-[#121417] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <span className="font-['Delight'] font-medium text-[11px] uppercase tracking-wider text-white/60 block">
                            {item.subtitle}
                          </span>
                          <h3 className="font-['Nohemi'] font-bold text-2xl capitalize text-[#FFFFFF] tracking-tight group-hover:translate-x-1 transition-transform duration-200">
                            {item.title}
                          </h3>
                        </div>

                        <p className="font-['Delight'] font-normal text-xs sm:text-[13px] text-white/80 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 border-t border-white/15 space-y-1">
                          {item.features.slice(0, 2).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs font-['Delight'] text-white/90">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-['Nohemi'] font-bold uppercase tracking-wider text-white group-hover:text-[#ECEDEF] transition-colors">
                          <span className="flex items-center gap-2">Explore Solution</span>
                          <span className="w-8 h-8 rounded-[4px] bg-white/15 group-hover:bg-white group-hover:text-[#121417] flex items-center justify-center transition-colors duration-200">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default MajorServicesSlider;

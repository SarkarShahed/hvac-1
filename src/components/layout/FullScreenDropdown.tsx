import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Phone, Calculator, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FullScreenDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (targetId: string, action?: string) => void;
}

// Custom Analog Watch Component matching Apple World Clock widget styling
const AppleWorldClock: React.FC<{
  city: string;
  diffHours: number;
  timeZone: string;
}> = ({ city, diffHours, timeZone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { hours, minutes, seconds, isPM, timeString } = useMemo(() => {
    const timeStr = time.toLocaleTimeString('en-US', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const [h, m, s] = timeStr.split(':').map(Number);
    const h12Str = time.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return {
      hours: h,
      minutes: m,
      seconds: s,
      isPM: h >= 12,
      timeString: h12Str,
    };
  }, [time, timeZone]);

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const diffLabel =
    diffHours === 0 ? 'TODAY, +0HRS' : diffHours > 0 ? `TODAY, +${diffHours}HRS` : `TODAY, ${diffHours}HRS`;

  return (
    <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800/80 px-3.5 py-2 rounded-xl backdrop-blur-md">
      {/* Clock Face */}
      <div className="relative w-11 h-11 rounded-full bg-[#16171a] border border-zinc-700/60 shadow-inner flex items-center justify-center shrink-0">
        {/* Hour marks: 12, 3, 6, 9 */}
        <span className="absolute top-1 text-[8px] font-mono text-zinc-500 font-bold leading-none">12</span>
        <span className="absolute right-1 text-[8px] font-mono text-zinc-500 font-bold leading-none">3</span>
        <span className="absolute bottom-1 text-[8px] font-mono text-zinc-500 font-bold leading-none">6</span>
        <span className="absolute left-1 text-[8px] font-mono text-zinc-500 font-bold leading-none">9</span>

        {/* Center dot */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FE552F] z-20" />

        {/* Hour hand */}
        <div
          className="absolute w-[2px] h-3 bg-white rounded-full origin-bottom bottom-1/2 left-[calc(50%-1px)] z-10"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />

        {/* Minute hand */}
        <div
          className="absolute w-[1.5px] h-4 bg-zinc-300 rounded-full origin-bottom bottom-1/2 left-[calc(50%-0.75px)] z-10"
          style={{ transform: `rotate(${minDeg}deg)` }}
        />

        {/* Orange Second hand */}
        <div
          className="absolute w-[1px] h-4.5 bg-[#FE552F] rounded-full origin-bottom bottom-1/2 left-[calc(50%-0.5px)] z-15"
          style={{ transform: `rotate(${secDeg}deg)` }}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
          {diffLabel}
        </span>
        <span className="text-sm font-['Nohemi'] font-bold text-white leading-snug">
          {city}
        </span>
        <span className="text-[11px] font-mono text-[#FE552F] font-semibold leading-tight">
          {timeString}
        </span>
      </div>
    </div>
  );
};

export const FullScreenDropdown: React.FC<FullScreenDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  const handleItemClick = (e: React.MouseEvent, targetId: string, action?: string) => {
    e.preventDefault();
    onClose();
    if (onNavigate) {
      onNavigate(targetId, action);
    } else {
      if (action === 'open-estimator') {
        window.dispatchEvent(new CustomEvent('open-estimator-modal'));
      }
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#121417] text-white flex flex-col justify-between px-[20px] py-6 sm:py-10 lg:py-14 border-none overflow-y-auto overflow-x-hidden"
        >
          {/* TOP BAR */}
          <div className="w-full flex items-center justify-between pb-6 border-b border-zinc-800">
            {/* Left: Brand Identity with orange badge */}
            <div className="flex items-center gap-3">
              <a
                href="#hero-section"
                onClick={(e) => handleItemClick(e, '#hero-section')}
                className="group flex items-center select-none cursor-pointer"
              >
                <img
                  src="/Preferred-Air 1.png"
                  alt="Preferred Air"
                  className="h-10 sm:h-12 lg:h-[46px] w-auto max-w-[160px] sm:max-w-[190px] lg:max-w-[215px] object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-md brightness-110"
                />
              </a>
            </div>

            {/* Right: Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Navigation"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-zinc-700/50"
            >
              <span className="text-xs font-mono uppercase tracking-wider">Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN BODY: 5 Columns (Menu, Cooling & Heating, Air Quality, Socials, Newsletter) */}
          <div className="w-full my-auto py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Column 1: Menu */}
            <div className="md:col-span-3 lg:col-span-2 space-y-3.5">
              <h4 className="text-[12px] font-['Delight'] font-medium text-zinc-400 tracking-wider uppercase">
                Menu
              </h4>
              <ul className="space-y-2 font-mono text-[12px] tracking-wide text-zinc-200">
                {[
                  { name: 'HOME', target: '#hero-section' },
                  { name: 'SERVICES', target: '#major-services-slider-section' },
                  { name: 'SERVICE AREA', target: '#service-area-globe-section' },
                  { name: 'ABOUT US', target: '#about-us' },
                  { name: 'CONTACT US', target: '#emergency-cta-banner' },
                  { name: 'ESTIMATOR', target: '#hero-section', action: 'open-estimator' },
                  { name: 'FINANCING', target: '#financing-calculator' },
                  { name: 'REVIEWS', target: '#testimonials' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.target}
                      onClick={(e) => handleItemClick(e, item.target, item.action)}
                      className="inline-block hover:text-[#FE552F] hover:translate-x-1 transition-all duration-150 cursor-pointer text-zinc-200 font-medium"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Cooling & Heating */}
            <div className="md:col-span-4 lg:col-span-3 space-y-3.5">
              <h4 className="text-[12px] font-['Delight'] font-medium text-zinc-400 tracking-wider uppercase">
                Cooling & Heating
              </h4>
              <ul className="space-y-2 font-mono text-[11.5px] tracking-wide text-zinc-400">
                {[
                  { name: 'AC REPAIR & TUNE-UP', target: '#major-services-slider-section' },
                  { name: 'AC INSTALLATION & REPLACEMENT', target: '#major-services-slider-section' },
                  { name: 'HIGH-EFFICIENCY HEAT PUMPS', target: '#major-services-slider-section' },
                  { name: 'GAS & ELECTRIC FURNACES', target: '#major-services-slider-section' },
                  { name: 'DUCTLESS MINI-SPLITS', target: '#major-services-slider-section' },
                  { name: 'COMMERCIAL RTU PACKAGES', target: '#major-services-slider-section' },
                  { name: 'PREVENTATIVE MAINTENANCE', target: '#financing-calculator' },
                  { name: '24/7 EMERGENCY DISPATCH', target: 'tel:6026229851' },
                ].map((service, idx) => (
                  <li key={idx}>
                    <a
                      href={service.target}
                      onClick={(e) => handleItemClick(e, service.target)}
                      className="inline-block hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-zinc-400 hover:text-zinc-100"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Air Quality & Commercial */}
            <div className="hidden lg:block lg:col-span-3 space-y-3.5">
              <h4 className="text-[12px] font-['Delight'] font-medium text-zinc-400 tracking-wider uppercase">
                Air Quality & Commercial
              </h4>
              <ul className="space-y-2 font-mono text-[11.5px] tracking-wide text-zinc-400">
                {[
                  { name: 'AEROSEAL DUCTWORK SEALING', target: '#major-services-slider-section' },
                  { name: 'MERV 13 & HEPA PURIFIERS', target: '#major-services-slider-section' },
                  { name: 'WHOLE-HOME DEHUMIDIFICATION', target: '#major-services-slider-section' },
                  { name: 'GERMICIDAL UV COIL LIGHTS', target: '#major-services-slider-section' },
                  { name: 'THERMAL AIRFLOW BALANCING', target: '#major-services-slider-section' },
                  { name: '0% APR FINANCING PLANS', target: '#financing-calculator' },
                  { name: 'SRP & APS UTILITY REBATES', target: '#financing-calculator' },
                  { name: 'WARRANTY & PARTS CARE', target: '#faq-section' },
                ].map((service, idx) => (
                  <li key={idx}>
                    <a
                      href={service.target}
                      onClick={(e) => handleItemClick(e, service.target)}
                      className="inline-block hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-zinc-400 hover:text-zinc-100"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div className="md:col-span-2 lg:col-span-2 space-y-3.5">
              <h4 className="text-[12px] font-['Delight'] font-medium text-zinc-400 tracking-wider uppercase">
                Socials
              </h4>
              <ul className="space-y-2 font-mono text-[12px] tracking-wide text-zinc-200">
                {[
                  { name: 'FACEBOOK', href: 'https://facebook.com' },
                  { name: 'INSTAGRAM', href: 'https://instagram.com' },
                  { name: 'LINKEDIN', href: 'https://linkedin.com' },
                  { name: 'X', href: 'https://x.com' },
                  { name: 'YOUTUBE', href: 'https://youtube.com' },
                  { name: 'YELP', href: 'https://yelp.com' },
                ].map((soc, idx) => (
                  <li key={idx}>
                    <a
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block hover:text-[#FE552F] hover:translate-x-1 transition-all duration-150 cursor-pointer text-zinc-300"
                    >
                      {soc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Newsletter & Actions */}
            <div className="md:col-span-3 lg:col-span-2 space-y-4">
              <h4 className="text-[13px] font-['Delight'] font-medium text-zinc-400 tracking-wider">
                Newsletter
              </h4>

              {/* Newsletter Input + Sign Up Button */}
              <form onSubmit={handleSubscribe} className="flex items-stretch w-full">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-0 bg-zinc-800/80 border border-zinc-700/80 px-3.5 py-2 text-xs font-['Delight'] text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 rounded-l-[4px]"
                />
                <button
                  type="submit"
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 text-xs font-['Delight'] font-medium rounded-r-[4px] transition-colors cursor-pointer shrink-0"
                >
                  {isSubscribed ? 'Done!' : 'Sign Up'}
                </button>
              </form>

              {isSubscribed && (
                <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  Subscribed to VIP Rebates!
                </p>
              )}

              {/* Fast 24/7 Action Buttons */}
              <div className="pt-4 space-y-2">
                <a
                  href="tel:6026229851"
                  className="w-full flex items-center justify-between px-3 py-2 bg-[#FE552F] hover:bg-[#e04520] text-white text-xs font-mono rounded-[4px] transition-colors"
                >
                  <span>CALL (602) 622-9851</span>
                  <Phone className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={(e) => handleItemClick(e, '#hero-section', 'open-estimator')}
                  className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs font-mono rounded-[4px] transition-colors cursor-pointer"
                >
                  <span>ONLINE ESTIMATOR</span>
                  <Calculator className="w-3.5 h-3.5 text-[#FE552F]" />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR: Credits, Copyright, Privacy, Real-Time Apple World Clock */}
          <div className="w-full pt-6 border-t border-zinc-800 flex flex-col xl:flex-row items-center justify-between gap-6 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            {/* Company Credit Left */}
            <div className="flex items-center gap-2">
              <span>BY PREFERRED AIR AZ</span>
              <span>•</span>
              <span>ALL RIGHTS RESERVED © {new Date().getFullYear()}</span>
              <span>•</span>
              <span>PHOENIX VALLEY HVAC</span>
            </div>

            {/* Center Links */}
            <div className="flex items-center gap-4">
              <a
                href="#about-us"
                onClick={(e) => handleItemClick(e, '#about-us')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                ROC #349892
              </a>
              <span>•</span>
              <a
                href="#faq-section"
                onClick={(e) => handleItemClick(e, '#faq-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                PRIVACY POLICY
              </a>
              <span>•</span>
              <a
                href="#faq-section"
                onClick={(e) => handleItemClick(e, '#faq-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                TERMS OF SERVICE
              </a>
            </div>

            {/* Real-time Analog Clocks Right */}
            <div className="flex items-center gap-3">
              <AppleWorldClock city="Phoenix" diffHours={0} timeZone="America/Phoenix" />
              <div className="hidden sm:block">
                <AppleWorldClock city="Wyoming" diffHours={1} timeZone="America/Denver" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

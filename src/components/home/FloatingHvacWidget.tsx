import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HvacPricingEstimator from './HvacPricingEstimator';
import { X, Minus } from 'lucide-react';

export const FloatingHvacWidget: React.FC = () => {
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const heroEl = document.getElementById('hero-section');
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero section is visible (> 15% threshold), hide floating launcher
        const inView = entry.isIntersecting;
        setIsHeroInView(inView);
        if (inView) {
          // Auto-close floating modal when returning to hero
          setIsOpen(false);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(heroEl);

    const handleOpenWidget = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-hvac-estimator', handleOpenWidget);

    return () => {
      observer.disconnect();
      window.removeEventListener('open-hvac-estimator', handleOpenWidget);
    };
  }, []);

  // Do not render floating button or popup when hero section is actively in view
  if (isHeroInView) return null;

  return (
    <>
      {/* Floating Popup Modal Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[430px] max-h-[85vh] shadow-2xl rounded-[24px]"
          >
            <HvacPricingEstimator
              isFloatingModal
              onClose={() => setIsOpen(false)}
              onMinimize={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button in Bottom-Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-[#121417]/90 hover:bg-[#1a1d22] text-white border border-white/20 rounded-full pl-[6px] pr-[14px] h-[45px] shadow-2xl backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          title="Instant Cost Estimator"
        >
          {/* Calculator SVG Icon */}
          <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FE552F] group-hover:text-white transition-colors duration-200 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calculator text-white"
            >
              <rect width="16" height="20" x="4" y="2" rx="2" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="16" x2="16" y1="14" y2="18" />
              <path d="M16 10h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M12 14h.01" />
              <path d="M8 14h.01" />
              <path d="M12 18h.01" />
              <path d="M8 18h.01" />
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[12px] font-nohemi font-bold uppercase tracking-wider text-white group-hover:text-white whitespace-nowrap">
              Instant Estimate
            </span>
            <span className="text-[10px] text-white/60 font-subheading whitespace-nowrap">
              {isOpen ? 'Click to minimize' : 'Get instant quote'}
            </span>
          </div>

          {isOpen ? (
            <Minus className="w-4 h-4 ml-1 text-white/70 group-hover:text-white transition-colors shrink-0" />
          ) : (
            <X className="w-4 h-4 ml-1 text-white/70 group-hover:text-white transition-colors hidden shrink-0" />
          )}
        </button>
      </motion.div>
    </>
  );
};

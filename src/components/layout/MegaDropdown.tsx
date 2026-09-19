import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { SplitTextHover } from '../ui/SplitTextHover';

export interface DropdownItem {
  name: string;
  href: string;
  badge?: string;
  description?: string;
}

export interface DropdownColumn {
  category: string;
  items: DropdownItem[];
}

export interface MegaDropdownData {
  title: string;
  ctaText: string;
  ctaHref: string;
  columns: DropdownColumn[];
  footerNote?: string;
}

interface MegaDropdownProps {
  isOpen: boolean;
  activeKey: string | null;
  data: MegaDropdownData | null;
  onClose: () => void;
  onSelectTab: (key: string) => void;
  availableTabs: { key: string; label: string }[];
}

export const MegaDropdown: React.FC<MegaDropdownProps> = ({
  isOpen,
  activeKey,
  data,
  onClose,
  onSelectTab,
  availableTabs,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const isClosingRef = useRef(false);

  // Synchronize render state with isOpen
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      isClosingRef.current = false;
    }
  }, [isOpen]);

  // GSAP Smooth Slide & Fade In Animation
  useEffect(() => {
    if (isRendered && isOpen && cardRef.current && overlayRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        // 1. Overlay Fade (now just an invisible click catcher, but we can fade it if we want)
        tl.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.1 },
          0
        );

        // 2. Smooth Card Slide & Fade Down
        tl.fromTo(
          cardRef.current,
          {
            y: -16,
            scale: 0.98,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          0.02
        );

        // 3. Staggered Smooth Fade for Columns and Links
        if (contentRef.current) {
          const items = contentRef.current.querySelectorAll('.flip-target');
          tl.fromTo(
            items,
            {
              y: 8,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              stagger: 0.015,
              ease: 'power3.out',
            },
            0.1
          );
        }
      });

      return () => ctx.revert();
    }
  }, [isRendered, isOpen]);

  // GSAP Smooth Slide & Fade on Tab Switch
  useEffect(() => {
    if (isOpen && contentRef.current && activeKey) {
      const items = contentRef.current.querySelectorAll('.flip-target');
      gsap.fromTo(
        items,
        {
          y: 8,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.32,
          stagger: 0.012,
          ease: 'power3.out',
        }
      );
    }
  }, [activeKey, isOpen]);

  // Animated Smooth Close Handler
  const handleAnimatedClose = () => {
    if (isClosingRef.current || !cardRef.current || !overlayRef.current) {
      onClose();
      return;
    }

    isClosingRef.current = true;

    const closeTl = gsap.timeline({
      onComplete: () => {
        setIsRendered(false);
        isClosingRef.current = false;
        onClose();
      },
    });

    // GSAP Smooth exit
    closeTl.to(
      cardRef.current,
      {
        y: -12,
        scale: 0.98,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      },
      0
    );

    closeTl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.1,
      },
      0.02
    );
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleAnimatedClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isRendered || !data) return null;

  return (
    <>
      {/* Invisible fixed overlay to catch clicks outside the dropdown */}
      <div
        id="mega-dropdown-overlay"
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-transparent"
        onClick={handleAnimatedClose}
      />
      {/* Dropdown Card Positioned Under Navbar */}
      <div
        id="mega-dropdown-modal"
        ref={cardRef}
        className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-50 w-[680px] max-w-[calc(100vw-40px)] bg-[#121417]/85 backdrop-blur-md text-white rounded-[20px] overflow-hidden shadow-2xl border border-white/10 origin-top"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          willChange: 'transform, opacity',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Content Body with GSAP Flip targets */}
        <div ref={contentRef} className="p-8 pb-5 relative">
          {/* Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 pb-12">
            {data.columns.map((col, idx) => (
              <div key={idx} className="flip-target">
                {/* Column Items: styled with refined typography */}
                <ul className="space-y-3.5 m-0 p-0 list-none">
                  {col.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flip-target">
                      <a
                        href={item.href}
                        onClick={handleAnimatedClose}
                        className="group flex items-center gap-1 text-[13.5px] font-body font-semibold text-[#D1D1D1] hover:text-white transition-colors"
                      >
                        <SplitTextHover text={item.name} />
                        {/* Adding subtle arrow if it's external or important (screenshot has it for Releases/Resources) */}
                        {item.name.includes('Releases') || item.name.includes('Resources') || item.name.includes('SEC') ? (
                          <span className="text-[10px] ml-1 opacity-70 group-hover:opacity-100 transition-opacity">↗</span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Action Buttons (Get In Touch / Careers) */}
          <div className="flex flex-col sm:flex-row gap-4 flip-target border-t border-white/5 pt-5">
            <a
              href="#get-in-touch"
              onClick={handleAnimatedClose}
              className="flex-[1.2] flex items-center justify-between px-6 py-4 rounded-[16px] bg-[#F4F3ED] text-[#121417] hover:bg-white transition-all cursor-pointer group"
            >
              <span className="font-mono text-[13px] font-bold uppercase tracking-wider">GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#careers"
              onClick={handleAnimatedClose}
              className="flex-1 flex items-center justify-between px-6 py-4 rounded-[16px] bg-[#535353] text-white hover:bg-[#606060] transition-all cursor-pointer group"
            >
              <span className="font-['Nohemi'] text-[14px] font-bold uppercase tracking-wider">CAREERS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

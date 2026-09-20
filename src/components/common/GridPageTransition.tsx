import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const GridPageTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // 12 Columns Array
  const columns = Array.from({ length: 12 });

  useEffect(() => {
    // Initial Page Entrance Transition: 12 Columns stagger up and away
    const cols = colsRef.current.filter(Boolean);
    
    if (cols.length > 0) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = 'none';
          }
        },
      });

      // Stagger columns away smoothly on load
      tl.to(cols, {
        scaleY: 0,
        transformOrigin: 'top',
        stagger: {
          amount: 0.35,
          from: 'center',
          ease: 'sine.inOut',
        },
        duration: 0.75,
        ease: 'power3.inOut',
        force3D: true,
        delay: 0.1,
      });
    }

    // Custom Event Listener for dynamic route / page transitions
    const handleTriggerTransition = (e: Event) => {
      const customEvent = e as CustomEvent;
      const onCompleteCallback = customEvent.detail?.onComplete;

      if (containerRef.current) {
        containerRef.current.style.pointerEvents = 'all';
      }
      setIsAnimating(true);

      const cols = colsRef.current.filter(Boolean);
      const tl = gsap.timeline();

      // Wipe 12 columns down smoothly
      tl.set(cols, { transformOrigin: 'bottom' })
        .to(cols, {
          scaleY: 1,
          stagger: {
            amount: 0.3,
            from: 'edges',
            ease: 'sine.inOut',
          },
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        })
        .add(() => {
          if (onCompleteCallback) onCompleteCallback();
        })
        .set(cols, { transformOrigin: 'top' })
        .to(cols, {
          scaleY: 0,
          stagger: {
            amount: 0.35,
            from: 'center',
            ease: 'sine.inOut',
          },
          duration: 0.75,
          ease: 'power3.inOut',
          force3D: true,
        })
        .add(() => {
          setIsAnimating(false);
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = 'none';
          }
        });
    };

    window.addEventListener('trigger-12grid-transition', handleTriggerTransition);

    // Global interceptor for inner links to trigger the 12-grid sweep smoothly
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        // Prevent default harsh jump and do smooth 12-grid transition sweep
        e.preventDefault();
        const element = document.querySelector(href);
        
        window.dispatchEvent(
          new CustomEvent('trigger-12grid-transition', {
            detail: {
              onComplete: () => {
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              },
            },
          })
        );
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('trigger-12grid-transition', handleTriggerTransition);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[99999] pointer-events-none overflow-hidden ${
        isAnimating ? 'pointer-events-auto' : ''
      }`}
    >
      {/* 12 Columns Grid overlay in Color #2934CE */}
      <div className="w-full h-full grid grid-cols-12 gap-0 relative">
        {columns.map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              colsRef.current[idx] = el;
            }}
            className="h-full bg-[#2934ce] border-r border-white/5 transform-gpu scale-y-100 origin-top"
            style={{
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </div>
  );
};

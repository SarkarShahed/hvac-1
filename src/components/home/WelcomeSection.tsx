import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const paragraphText =
  "Do you want to partner with a people-centric HVAC company that provides family-like treatment to its customers? As a local business, we deeply understand and care about our community's needs, offering more personalized service than large, investor-driven firms. Our team takes pride in our work, delivering services with joy and passion. We recognize how important quality HVAC services are for your Phoenix, AZ, home, working tirelessly to make a positive and lasting impact that your family cherishes. Experience the Preferred Air difference.";

export const WelcomeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  wordsRef.current = [];

  const addToWordsRef = (el: HTMLSpanElement | null) => {
    if (el && !wordsRef.current.includes(el)) {
      wordsRef.current.push(el);
    }
  };

  const words = paragraphText.split(' ');

  useEffect(() => {
    if (!containerRef.current || wordsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(wordsRef.current, { opacity: 0.18, color: '#71717a' });

      gsap.to(wordsRef.current, {
        opacity: 1,
        color: '#121417',
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [words.length]);

  return (
    <section
      id="about-us"
      className="w-full max-w-[100vw] min-h-[120vh] bg-[#FFFFFF] text-[#121417] pt-0 px-0 pb-0 border-b border-zinc-200 overflow-hidden flex flex-col justify-center"
    >
      <div
        ref={containerRef}
        className="w-full bg-[#FFFFFF] rounded-none px-[20px] py-6 sm:py-10 lg:py-14 border-0 shadow-none flex flex-col justify-center gap-8 lg:gap-10 my-auto"
      >
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#ECEDEF]">
          <div className="space-y-3 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#ECEDEF] text-[#121417] text-xs font-['Delight'] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#121417]" />
              <span>Phoenix, Arizona • Local Family-First HVAC</span>
            </div>
            
            <h2 className="font-['Nohemi'] font-bold text-3xl sm:text-5xl lg:text-[60px] text-[#121417] capitalize tracking-tight leading-[1.05] text-left">
              Welcome to Preferred Air — Your HVAC Experts in Phoenix, AZ
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start">
            <a
              href="#estimate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#121417] hover:bg-[#ECEDEF] hover:text-[#121417] text-[#FFFFFF] border border-[#121417] font-['Nohemi'] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Get Estimate</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Cinematic Scroll-Driven Animated Content */}
        <div className="w-full py-4 lg:py-6 text-left">
          <p className="w-full max-w-[1200px] font-['Delight'] font-normal text-lg sm:text-2xl lg:text-3xl leading-relaxed sm:leading-[1.7] lg:leading-[1.8] tracking-normal text-zinc-400 select-none">
            {words.map((word, index) => {
              const isAccent =
                word.toLowerCase().includes('people-centric') ||
                word.toLowerCase().includes('preferred') ||
                word.toLowerCase().includes('air') ||
                word.toLowerCase().includes('family-like') ||
                word.toLowerCase().includes('phoenix');

              return (
                <span
                  key={index}
                  ref={addToWordsRef}
                  className={`inline-block mr-[0.3em] transition-all duration-75 will-change-transform ${
                    isAccent ? 'font-medium' : ''
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

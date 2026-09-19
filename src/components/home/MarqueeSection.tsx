import React from 'react';
import { Trophy, BadgeCheck, Coins, Clock, Star, Receipt } from 'lucide-react';

const marqueeItems = [
  { icon: Trophy, title: "15 years in business", sub: "Est. 2009 · Phoenix Metro, AZ" },
  { icon: BadgeCheck, title: "Licensed & bonded", sub: "State certified · Insured" },
  { icon: Coins, title: "Price match guarantee", sub: "Beat any written quote" },
  { icon: Clock, title: "Same-day service", sub: "Avg. 47 min response" },
  { icon: Star, title: "4.9-star rated", sub: "847 Google reviews" },
  { icon: Receipt, title: "No surprise fees", sub: "Upfront pricing always" },
];

export const MarqueeSection = () => {
  // We duplicate the items several times to ensure it can scroll infinitely
  // and seamlessly on very wide screens by translating -50% of the total width.
  const repeatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section className="w-full bg-theme-main py-8 border-b border-theme-secondary overflow-hidden flex items-center relative">
      {/* Gradient masks for smooth fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-theme-main to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-theme-main to-transparent z-10 pointer-events-none" />

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-scroll {
            display: flex;
            width: max-content;
            animation: marquee 60s linear infinite;
          }
          .animate-marquee-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="animate-marquee-scroll gap-4 md:gap-6 px-3">
        {repeatedItems.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 bg-theme-third border-none shadow-none rounded-[24px] p-4 md:px-6 min-w-[280px] md:min-w-[320px] shrink-0 hover:bg-theme-third/90 transition-colors duration-300 cursor-default"
          >
            <div className="w-12 h-12 rounded-full bg-theme-fourth/10 flex items-center justify-center shrink-0 border border-theme-fourth/20">
              <item.icon size={22} className="text-theme-fourth" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-subheading font-medium text-theme-main text-[15px] leading-tight mb-1">
                {item.title}
              </span>
              <span className="font-body text-theme-main/70 text-[13px] leading-none">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

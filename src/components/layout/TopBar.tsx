import React from 'react';
import {
  Facebook,
  Instagram,
  Youtube,
  Music2,
  Store,
  CreditCard,
  BadgePercent,
  Star,
  MessageSquarePlus,
  ShoppingBag,
  LogIn,
} from 'lucide-react';
import { SplitTextHover } from '../ui/SplitTextHover';

export const TopBar: React.FC = () => {
  return (
    <div
      id="top-bar-nav"
      style={{ backgroundColor: '#121417', height: '40px' }}
      className="w-full max-w-[100vw] h-[40px] px-3 sm:px-4 flex items-center text-[#ECEDEF] select-none border-b border-white/10"
    >
      <div className="w-full h-full flex items-center justify-between gap-4 text-xs font-['Delight'] font-normal">
        {/* Left Side: Social Media Icons (Clean, No Hover Animations) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <span className="hidden xl:inline-block font-['Delight'] font-medium text-[#ECEDEF]/80 text-[11px] uppercase tracking-wider mr-1">
            Follow Us:
          </span>
          <a
            id="topbar-social-fb"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-6 h-6 rounded-full bg-white/10 text-[#ECEDEF] hover:bg-[#FFFFFF] hover:text-[#121417] flex items-center justify-center transition-colors duration-150 border border-white/10 cursor-pointer"
            title="Facebook"
          >
            <Facebook className="w-3 h-3 stroke-[2.2]" />
          </a>
          <a
            id="topbar-social-insta"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-6 h-6 rounded-full bg-white/10 text-[#ECEDEF] hover:bg-[#FFFFFF] hover:text-[#121417] flex items-center justify-center transition-colors duration-150 border border-white/10 cursor-pointer"
            title="Instagram"
          >
            <Instagram className="w-3 h-3 stroke-[2.2]" />
          </a>
          <a
            id="topbar-social-youtube"
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-6 h-6 rounded-full bg-white/10 text-[#ECEDEF] hover:bg-[#FFFFFF] hover:text-[#121417] flex items-center justify-center transition-colors duration-150 border border-white/10 cursor-pointer"
            title="YouTube"
          >
            <Youtube className="w-3 h-3 stroke-[2.2]" />
          </a>
          <a
            id="topbar-social-tiktok"
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-6 h-6 rounded-full bg-white/10 text-[#ECEDEF] hover:bg-[#FFFFFF] hover:text-[#121417] flex items-center justify-center transition-colors duration-150 border border-white/10 cursor-pointer"
            title="TikTok"
          >
            <Music2 className="w-3 h-3 stroke-[2.2]" />
          </a>
          <a
            id="topbar-social-yelp"
            href="https://yelp.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Yelp"
            className="w-6 h-6 rounded-full bg-white/10 text-[#ECEDEF] hover:bg-[#FFFFFF] hover:text-[#121417] flex items-center justify-center transition-colors duration-150 border border-white/10 cursor-pointer"
            title="Yelp Reviews"
          >
            <Store className="w-3 h-3 stroke-[2.2]" />
          </a>
        </div>

        {/* Right Side: Links & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none h-full">
          {/* Informational & Review Links */}
          <div className="hidden lg:flex items-center gap-4 text-[12px] sm:text-[13px] text-[#ECEDEF] h-full">
            <a
              id="topbar-link-finance"
              href="#finance"
              className="group flex items-center gap-1.5 py-1 font-['Delight'] font-normal whitespace-nowrap cursor-pointer text-[#ECEDEF] hover:text-[#FFFFFF] transition-colors"
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white/15 text-[#ECEDEF] flex items-center justify-center shrink-0 border border-white/10">
                <CreditCard className="w-2.5 h-2.5 stroke-[2.2]" />
              </span>
              <SplitTextHover text="Get Finance" />
            </a>

            <span className="text-white/20 select-none">•</span>

            <a
              id="topbar-link-specials"
              href="#specials"
              className="group flex items-center gap-1.5 py-1 font-['Delight'] font-normal whitespace-nowrap cursor-pointer text-[#ECEDEF] hover:text-[#FFFFFF] transition-colors"
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white/15 text-[#ECEDEF] flex items-center justify-center shrink-0 border border-white/10">
                <BadgePercent className="w-2.5 h-2.5 stroke-[2.2]" />
              </span>
              <SplitTextHover text="See Special" />
            </a>

            <span className="text-white/20 select-none">•</span>

            <a
              id="topbar-link-read-review"
              href="#testimonials"
              className="group flex items-center gap-1.5 py-1 font-['Delight'] font-normal whitespace-nowrap cursor-pointer text-[#ECEDEF] hover:text-[#FFFFFF] transition-colors"
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white/15 text-[#ECEDEF] flex items-center justify-center shrink-0 border border-white/10">
                <Star className="w-2.5 h-2.5 fill-[#ECEDEF] stroke-[2.2]" />
              </span>
              <SplitTextHover text="Read Review" />
            </a>

            <span className="text-white/20 select-none">•</span>

            <a
              id="topbar-link-leave-review"
              href="#leave-review"
              className="group flex items-center gap-1.5 py-1 font-['Delight'] font-normal whitespace-nowrap cursor-pointer text-[#ECEDEF] hover:text-[#FFFFFF] transition-colors"
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white/15 text-[#ECEDEF] flex items-center justify-center shrink-0 border border-white/10">
                <MessageSquarePlus className="w-2.5 h-2.5 stroke-[2.2]" />
              </span>
              <SplitTextHover text="Leave Review" />
            </a>
          </div>

          {/* Action Buttons: Shop & Login */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="topbar-shop-button"
              type="button"
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECEDEF] text-[#121417] hover:bg-[#FFFFFF] hover:text-[#121417] font-['Delight'] font-medium text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3 h-3 stroke-[2.2]" />
              <SplitTextHover text="Shop" />
            </button>

            <button
              id="topbar-login-button"
              type="button"
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#ECEDEF]/30 hover:border-[#FFFFFF] hover:bg-white/10 text-[#ECEDEF] font-['Delight'] font-normal text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3 h-3 text-[#ECEDEF] transition-colors stroke-[2.2]" />
              <SplitTextHover text="Login" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

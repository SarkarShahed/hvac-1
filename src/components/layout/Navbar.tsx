import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Calendar, ArrowRight, ChevronDown, PhoneCall, Facebook, Instagram, Youtube, Store, Star } from 'lucide-react';
import { MegaDropdown, MegaDropdownData } from './MegaDropdown';
import { FullScreenDropdown } from './FullScreenDropdown';
import { SplitTextHover } from '../ui/SplitTextHover';

interface NavItemConfig {
  id: string;
  name: string;
  href: string;
  hasDropdown: boolean;
  dropdownData?: MegaDropdownData;
}

export const Navbar: React.FC = () => {
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Cache the last active dropdown data to allow smooth exit animations
  const lastDropdownDataRef = useRef<MegaDropdownData | null>(null);

  // Smart sticky header logic
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search Mock Database
  const searchItems = [
    { name: 'Air Conditioning Repair & Installs', targetId: 'major-services-slider-section' },
    { name: 'High Efficiency Heat Pumps', targetId: 'major-services-slider-section' },
    { name: 'Ductless Mini-Split Air Handlers', targetId: 'major-services-slider-section' },
    { name: 'Indoor Air Quality Checkups & Filtration', targetId: 'major-services-slider-section' },
    { name: 'Smart Programmable Thermostats', targetId: 'major-services-slider-section' },
    { name: 'Duct Sealing & Aeroseal Repair', targetId: 'major-services-slider-section' },
    { name: 'Commercial & Light Commercial HVAC', targetId: 'major-services-slider-section' },
    { name: 'Precision Heating & Furnaces', targetId: 'major-services-slider-section' },
    { name: 'Latest Climate Guides & Articles', targetId: 'blog-section' },
  ];

  const filteredSearch = searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Exact Dropdown Structures designed to match Atlas 3-Column Visual Layout with authentic HVAC content
  const servicesDropdownData: MegaDropdownData = {
    title: 'HVAC Services',
    ctaText: 'GET INSTANT ESTIMATE',
    ctaHref: '#hero-section',
    footerNote: 'NATE Certified Technicians • Upfront Guaranteed Pricing • 24/7 Rapid Response',
    columns: [
      {
        category: 'COOLING & AC',
        items: [
          { name: 'AC Repair & Diagnostics', href: '#major-services-slider-section', badge: 'Same Day' },
          { name: 'New AC System Installation', href: '#major-services-slider-section' },
          { name: 'High-Efficiency Heat Pumps', href: '#major-services-slider-section' },
          { name: '24/7 Emergency AC Service', href: '#emergency-cta-banner', badge: 'Urgent' },
        ],
      },
      {
        category: 'HEATING & DUCTS',
        items: [
          { name: 'Gas & Electric Furnaces', href: '#major-services-slider-section' },
          { name: 'Ductless Mini-Split Systems', href: '#major-services-slider-section' },
          { name: 'Duct Sealing & Airflow Balance', href: '#major-services-slider-section' },
          { name: 'Seasonal Heating Tune-Ups', href: '#major-services-slider-section' },
        ],
      },
      {
        category: 'AIR QUALITY & CONTROLS',
        items: [
          { name: 'Indoor Air Quality Checkups', href: '#major-services-slider-section' },
          { name: 'HEPA & UV Air Purifiers', href: '#major-services-slider-section' },
          { name: 'Smart Thermostat Automation', href: '#major-services-slider-section' },
          { name: 'Commercial & Light Business HVAC', href: '#major-services-slider-section' },
        ],
      },
      {
        category: 'PRICING & OFFERS',
        items: [
          { name: 'Instant Price Estimator', href: '#hero-section', badge: 'Interactive' },
          { name: '0% APR Flexible Financing', href: '#finance', badge: '0% APR' },
          { name: 'Utility & Federal Rebates', href: '#blog-section' },
          { name: '100% Upfront Price Guarantee', href: '#before-after-section' },
        ],
      },
    ],
  };

  const learnMoreDropdownData: MegaDropdownData = {
    title: 'Learn More',
    ctaText: 'Download Rebate Guide',
    ctaHref: '#blog-section',
    footerNote: 'Interactive Learning Guides • EPA & NATE Resource Hub',
    columns: [
      {
        category: 'RESOURCES & GUIDES',
        items: [
          { name: "HVAC Homeowner's Guide", href: '#blog-section' },
          { name: 'Heat Survival Routines', href: '#blog-section' },
          { name: 'Pricing Estimator Guide', href: '#hero-section' },
        ],
      },
      {
        category: 'FEDERAL REBATES',
        items: [
          { name: 'Inflation Reduction Act (IRA)', href: '#blog-section', badge: 'Rebates' },
          { name: 'Local Utility Incentives', href: '#blog-section' },
          { name: 'Tax Credit Optimizers', href: '#blog-section' },
        ],
      },
      {
        category: 'WARRANTIES & PLANS',
        items: [
          { name: '10-Year Part Warranties', href: '#blog-section' },
          { name: 'Preventative Maintenance Care', href: '#blog-section' },
          { name: 'Our Comfort Guarantee', href: '#blog-section' },
        ],
      },
    ],
  };

  const aboutUsDropdownData: MegaDropdownData = {
    title: 'About Preferred Air',
    ctaText: 'Meet Our Experts',
    ctaHref: '#about-us',
    footerNote: 'Proudly Family-Owned & Phoenix Valley Focused Since 2009',
    columns: [
      {
        category: 'OUR HERITAGE',
        items: [
          { name: 'Our Founders & Local Story', href: '#about-us' },
          { name: 'Meet Our Master Techs', href: '#about-us' },
          { name: 'Our Craftsmanship Standards', href: '#about-us' },
          { name: 'Real Before & After Proof', href: '#before-after-section' },
        ],
      },
      {
        category: 'OUR SERVICE FOCUS',
        items: [
          { name: 'Phoenix Valley Coverage', href: '#service-area-globe-section' },
          { name: 'High-SEER2 Energy Efficiency', href: '#about-us' },
          { name: 'How Our Process Works', href: '#how-it-works' },
          { name: 'Customer Verified Reviews', href: '#testimonials', badge: '4.9★' },
        ],
      },
      {
        category: 'CREDENTIALS',
        items: [
          { name: 'AZ ROC #324150 Licensed', href: '#about-us' },
          { name: 'NATE Certified Professionals', href: '#about-us' },
          { name: 'EPA Clean Air Certified', href: '#about-us' },
          { name: '100% Upfront Price Guarantee', href: '#finance' },
        ],
      },
    ],
  };

  const contactUsDropdownData: MegaDropdownData = {
    title: 'Contact Us',
    ctaText: 'Call Live Dispatch Now',
    ctaHref: 'tel:6026229851',
    footerNote: '24/7 Rapid Emergency Response • Avg. 47 Min On-Site Arrival',
    columns: [
      {
        category: 'DISPATCH & BOOKING',
        items: [
          { name: 'Instant Online Estimator', href: '#hero-section', badge: 'Fastest' },
          { name: 'Book Service Appointment', href: '#emergency-cta-banner' },
          { name: '24/7 Emergency Dispatch', href: '#emergency-cta-banner', badge: 'Urgent' },
          { name: 'Request Replacement Quote', href: '#finance' },
        ],
      },
      {
        category: 'DIRECT CONTACT',
        items: [
          { name: '24/7 Phone: (602) 622-9851', href: 'tel:6026229851' },
          { name: 'Email: info@preferredairaz.com', href: 'mailto:info@preferredairaz.com' },
          { name: 'Main Office: Phoenix, AZ', href: '#service-area-globe-section' },
          { name: 'Hours: 24/7/365 Emergency', href: '#emergency-cta-banner' },
        ],
      },
      {
        category: 'CUSTOMER CARE',
        items: [
          { name: 'Frequently Asked Questions', href: '#faq-section' },
          { name: '0% Financing Inquiries', href: '#finance' },
          { name: 'Maintenance & Warranty Plans', href: '#blog-section' },
          { name: 'Client Feedback & Reviews', href: '#testimonials' },
        ],
      },
    ],
  };

  const navItems: NavItemConfig[] = [
    { id: 'nav-home', name: 'Home', href: '#hero-section', hasDropdown: false },
    { id: 'nav-services', name: 'Services', href: '#major-services-slider-section', hasDropdown: true, dropdownData: servicesDropdownData },
    { id: 'nav-service-area', name: 'Service Area', href: '#service-area-globe-section', hasDropdown: false },
    { id: 'nav-about-us', name: 'About Us', href: '#about-us', hasDropdown: true, dropdownData: aboutUsDropdownData },
    { id: 'nav-contact-us', name: 'Contact Us', href: '#emergency-cta-banner', hasDropdown: true, dropdownData: contactUsDropdownData },
  ];

  const handleNavItemClick = (item: NavItemConfig, e: React.MouseEvent) => {
    if (item.hasDropdown) {
      e.preventDefault();
      setIsFullScreenMenuOpen(prev => !prev);
    } else {
      setIsFullScreenMenuOpen(false);
      const element = document.getElementById(item.href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeItem = navItems.find(i => i.id === activeDropdownKey);
  
  if (activeItem?.dropdownData) {
    lastDropdownDataRef.current = activeItem.dropdownData;
  }

  const availableDropdownTabs = navItems
    .filter(i => i.hasDropdown)
    .map(i => ({ key: i.id, label: i.name }));

  return (
    <>
      {/* Standalone Fixed Top Utility Bar with mix-blend-mode: difference */}
      {/* Being a standalone fixed element prevents parent stacking context isolation so it blends directly against all page content */}
      <div
        id="navbar-top-utility-bar"
        className="fixed top-[8px] right-[10px] z-[70] hidden lg:flex items-center justify-end gap-3 pb-1 px-1 text-[10.5px] font-['Delight'] font-semibold text-white uppercase tracking-wider mix-blend-difference pointer-events-auto select-none"
        style={{ mixBlendMode: 'difference' }}
      >
        {/* Left side: See Specials, Get Financing, Location, Read Reviews, HVAC License */}
        <div className="flex items-center gap-2.5 text-white">
          <a
            href="#specials"
            className="text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            SEE SPECIALS
          </a>
          <span className="text-white">•</span>
          <a
            href="#finance"
            className="text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            GET FINANCING
          </a>
          <span className="text-white">•</span>
          <a
            href="#service-area-globe-section"
            className="text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            LOCATION
          </a>
          <span className="text-white">•</span>
          <a
            href="#testimonials"
            className="text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            READ REVIEWS
          </a>
          <span className="text-white">•</span>
          <span className="text-white font-normal tracking-wide">
            HVAC LICENSE: ROC #349892
          </span>
        </div>

        {/* Right side: Social & reviews icons */}
        <div className="flex items-center gap-1.5 ml-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="w-5 h-5 rounded border border-white hover:opacity-75 text-white flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Facebook className="w-2.5 h-2.5 text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="w-5 h-5 rounded border border-white hover:opacity-75 text-white flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Instagram className="w-2.5 h-2.5 text-white" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            className="w-5 h-5 rounded border border-white hover:opacity-75 text-white flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Youtube className="w-2.5 h-2.5 text-white" />
          </a>
          <a
            href="https://yelp.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Yelp Reviews"
            className="w-5 h-5 rounded border border-white hover:opacity-75 text-white flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Store className="w-2.5 h-2.5 text-white" />
          </a>
          <a
            href="#testimonials"
            title="5-Star Rated"
            className="w-5 h-5 rounded border border-white hover:opacity-75 text-white flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Star className="w-2.5 h-2.5 fill-current text-white" />
          </a>
        </div>
      </div>

      {/* Main Transparent Navbar floating over screen with top space 10px, left/right space 10px */}
      <nav
        id="main-navbar"
        className="fixed top-[10px] left-[10px] right-[10px] z-[60] flex items-center lg:items-end justify-between pointer-events-auto"
      >
        {/* div 1: Logo Wrapper */}
        <div className="flex-1 lg:flex-none flex items-center justify-start shrink-0">
          <div 
            onClick={() => {
              const el = document.getElementById('hero-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center select-none cursor-pointer group"
          >
            <img
              src="/Preferred-Air 1.png"
              alt="Preferred Air"
              className="h-10 sm:h-12 lg:h-[50px] w-auto max-w-[160px] sm:max-w-[190px] lg:max-w-[215px] object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-md"
            />
          </div>
        </div>

        {/* div 2: Desktop Header Container with Navigation Menu */}
        <div className="hidden lg:flex flex-col items-end ml-auto select-none pt-[22px]">
          {/* Navigation Menu Bar + Action Buttons */}
          <div className="flex items-stretch shadow-xl rounded-[2px] overflow-hidden">
            {/* White Nav Links Bar */}
            <div className="flex items-stretch h-[40px] bg-white select-none rounded-l-[2px] overflow-hidden">
              {/* Home Link */}
              <button
                type="button"
                onClick={() => {
                  setActiveDropdownKey(null);
                  document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 text-[11.5px] font-['Nohemi'] font-bold uppercase tracking-[0.05em] text-[#121417] hover:text-[#1E24E6] hover:bg-neutral-50 transition-colors flex items-center cursor-pointer border-r border-black/5"
              >
                HOME
              </button>

              {/* Nav items */}
              {navItems.slice(1).map((item) => {
                const isDropdownActive = isFullScreenMenuOpen && item.hasDropdown;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => handleNavItemClick(item, e)}
                    className={`px-3.5 text-[11.5px] font-['Nohemi'] font-bold uppercase tracking-[0.05em] transition-colors flex items-center gap-1 cursor-pointer border-r border-black/5 ${
                      isDropdownActive
                        ? 'bg-[#F4F4F5] text-[#1E24E6]'
                        : 'text-[#121417] hover:text-[#1E24E6] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform pointer-events-none ${isDropdownActive ? 'rotate-180 text-[#1E24E6]' : 'text-[#121417]/60'}`} />
                    )}
                  </button>
                );
              })}

              {/* Quick Search Trigger inside white bar */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="px-3 text-[#121417]/70 hover:text-[#1E24E6] hover:bg-neutral-50 transition-colors flex items-center cursor-pointer"
                title="Search Site"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Right Side Action Buttons */}
            <div className="flex items-stretch h-[40px] overflow-hidden rounded-r-[2px]">
              {/* 1. Electric Royal Blue CALL TODAY Block */}
              <a
                id="navbar-call-today"
                href="tel:6026229851"
                className="flex items-center justify-center gap-2 px-3.5 bg-[#2934ce] hover:bg-[#181DC4] text-white transition-colors duration-150 cursor-pointer select-none group min-w-[132px]"
                title="Call Today (602) 622-9851"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                  <PhoneCall className="w-3.5 h-3.5 text-white stroke-[2.4]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-['Delight'] font-semibold text-[8px] uppercase tracking-[0.06em] text-white/95 leading-tight">
                    CALL TODAY
                  </span>
                  <span className="font-['Nohemi'] font-bold text-[12.5px] text-white tracking-tight leading-none mt-0.5 whitespace-nowrap group-hover:scale-[1.01] transition-transform">
                    (602) 622-9851
                  </span>
                </div>
              </a>

              {/* 2. Deep Jet Black BOOK ONLINE Block */}
              <button
                id="navbar-book-online"
                type="button"
                onClick={() => {
                  const el = document.getElementById('hero-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-1.5 px-4 bg-[#000000] hover:bg-[#121417] text-white transition-colors duration-150 cursor-pointer select-none group min-w-[110px] rounded-r-[2px]"
              >
                <Calendar className="w-3.5 h-3.5 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                <span className="font-['Nohemi'] font-bold text-[11.5px] uppercase tracking-[0.06em] text-white whitespace-nowrap group-hover:scale-[1.01] transition-transform">
                  BOOK ONLINE
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* div 3: Mobile Compact Menu trigger */}
        <div className="lg:hidden flex flex-1 justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="bg-[#121417]/80 backdrop-blur-md p-2 rounded-full border border-white/10 text-white"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullScreenMenuOpen(true)}
            className="bg-[#121417]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[11px] font-subheading font-medium text-white uppercase tracking-wider cursor-pointer"
          >
            Menu
          </button>
        </div>

        {/* Full Screen 100vw x 100vh Dropdown Menu with #2934ce Pixel Grid Wipe */}
        <FullScreenDropdown
          isOpen={isFullScreenMenuOpen}
          onClose={() => setIsFullScreenMenuOpen(false)}
        />
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 lg:hidden animate-fadeIn">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <img
                  src="/Preferred-Air 1.png"
                  alt="Preferred Air"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex flex-col items-start">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-nohemi font-bold text-2xl text-white uppercase"
              >
                Home
              </button>

              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.hasDropdown) {
                      setActiveDropdownKey(item.id);
                    } else {
                      document.getElementById(item.href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="font-nohemi font-bold text-2xl text-white uppercase flex items-center gap-2"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && <span className="text-xs text-zinc-400">Dropdown</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 flex flex-col gap-2.5">
            <a
              href="tel:6026229851"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 flex flex-col items-center justify-center bg-[#1E24E6] hover:bg-[#181DC4] text-white transition-colors select-none cursor-pointer"
            >
              <span className="font-['Delight'] font-semibold text-[11px] uppercase tracking-wider text-white/95">
                CALL TODAY
              </span>
              <span className="font-['Nohemi'] font-bold text-[20px] text-white tracking-tight leading-none mt-1">
                (602) 622-9851
              </span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full h-12 flex items-center justify-center bg-[#000000] hover:bg-zinc-900 text-white font-['Nohemi'] font-bold text-[14px] uppercase tracking-wider border border-zinc-800 transition-colors select-none cursor-pointer"
            >
              BOOK ONLINE
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Interactive Search Dialog Screen */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#1A1D21] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-5 relative">
            
            {/* Header / Input */}
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search climate services..."
                className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-zinc-500 font-body text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-zinc-500 hover:text-white rounded-full bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Match Listings */}
            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1">
              <span className="text-[10px] font-subheading font-bold uppercase tracking-wider text-zinc-500 block text-left mb-1">
                {filteredSearch.length > 0 ? 'INSTANT SERVICE RECOMMENDATIONS' : 'NO MATCHES FOUND'}
              </span>
              {filteredSearch.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    document.getElementById(item.targetId)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left p-3 rounded-lg bg-[#121417]/80 hover:bg-white/10 hover:border-white/20 border border-transparent text-sm font-subheading font-semibold text-zinc-200 hover:text-white flex items-center justify-between transition-all duration-200 cursor-pointer"
                >
                  <span>{item.name}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                </button>
              ))}
            </div>

            {/* Quick Helper Banner */}
            <div className="mt-4 pt-3.5 border-t border-zinc-800 text-left text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Press <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">ESC</kbd> to close</span>
              <span>24/7 Priority Support Ready</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

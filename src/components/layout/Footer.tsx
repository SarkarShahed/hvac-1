import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sliders,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { SplitTextHover } from '../ui/SplitTextHover';

interface FooterColumn {
  title: string;
  links: {
    label: string;
    href?: string;
    action?: string;
    isBadge?: boolean;
    badgeText?: string;
  }[];
}

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'cookies' | 'terms' | null>(null);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    performance: true,
    marketing: false,
  });
  const [cookiesSavedToast, setCookiesSavedToast] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, action?: string, href?: string) => {
    if (action) {
      e.preventDefault();
      if (action === 'open-estimator') {
        window.dispatchEvent(new CustomEvent('open-hvac-estimator'));
        const heroEl = document.getElementById('hero-section');
        heroEl?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-financing') {
        const el = document.getElementById('financing-calculator');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-reviews') {
        const el = document.getElementById('testimonials');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-why-us') {
        const el = document.getElementById('premier-hvac-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-services') {
        const el = document.getElementById('major-services-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-how-it-works') {
        const el = document.getElementById('how-it-works');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'scroll-faq') {
        const el = document.getElementById('faq-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveCookies = () => {
    setActiveModal(null);
    setCookiesSavedToast(true);
    setTimeout(() => setCookiesSavedToast(false), 3500);
  };

  const footerColumns: FooterColumn[] = [
    {
      title: 'Cooling & Heating',
      links: [
        { label: 'AC Installation & Replacement', action: 'scroll-services' },
        { label: '24/7 Emergency AC Repair', href: 'tel:4805554822', isBadge: true, badgeText: '24/7' },
        { label: 'High-Efficiency Heat Pumps', action: 'scroll-services' },
        { label: 'Gas & Electric Furnaces', action: 'scroll-services' },
        { label: 'Ductless Mini-Split Systems', action: 'scroll-services' },
        { label: 'Commercial Rooftop Packages', action: 'scroll-services' },
      ],
    },
    {
      title: 'Commercial HVAC',
      links: [
        { label: 'VRF & Multi-Split Systems' },
        { label: 'Preventative Maintenance Care', action: 'scroll-financing' },
        { label: 'Building Automation Controls' },
        { label: 'Industrial Chiller Overhauls' },
        { label: 'Restaurant Make-Up Air & Hoods' },
        { label: 'Multi-Family Property Retrofits' },
      ],
    },
    {
      title: 'Air Quality & Ducts',
      links: [
        { label: 'Aeroseal Ductwork Sealing', isBadge: true, badgeText: '98% Leak Free' },
        { label: 'MERV 13 & HEPA Air Purifiers' },
        { label: 'Whole-Home Dehumidification' },
        { label: 'Germicidal UV Coil Lights' },
        { label: 'Thermal Airflow Balancing' },
        { label: 'Carbon Monoxide & IAQ Testing' },
      ],
    },
    {
      title: 'Company & Values',
      links: [
        { label: 'About Preferred Air', action: 'scroll-why-us' },
        { label: 'Why Customers Entrust Us', action: 'scroll-why-us' },
        { label: 'Certified Technicians (NATE)', action: 'scroll-why-us' },
        { label: 'Verified Client Reviews', action: 'scroll-reviews', isBadge: true, badgeText: '4.96 ★' },
        { label: 'SRP & APS Utility Rebates', action: 'scroll-financing' },
        { label: 'Careers & Apprenticeships' },
      ],
    },
    {
      title: 'Client Resources',
      links: [
        { label: 'Instant Cost Estimator', action: 'open-estimator', isBadge: true, badgeText: 'Interactive' },
        { label: 'Financing & 0% APR Plans', action: 'scroll-financing' },
        { label: 'Seasonal Maintenance Guide', action: 'scroll-how-it-works' },
        { label: 'SEER2 Energy Savings Calc', action: 'scroll-financing' },
        { label: 'Frequently Asked Questions', action: 'scroll-faq' },
        { label: 'Warranty & Parts Registration' },
      ],
    },
    {
      title: 'Service Areas (AZ)',
      links: [
        { label: 'Phoenix Metro' },
        { label: 'Scottsdale & Paradise Valley' },
        { label: 'Mesa & East Valley' },
        { label: 'Chandler & Gilbert' },
        { label: 'Tempe & Ahwatukee' },
        { label: 'Glendale, Peoria & Surprise' },
      ],
    },
  ];

  return (
    <footer
      id="site-footer"
      className="w-full max-w-[100vw] bg-white p-0 border-none flex flex-col items-center justify-center select-none"
    >
      {/* Outer Card Container */}
      <div className="w-full max-w-[100vw] rounded-none overflow-hidden bg-white shadow-none border-0 border-none flex flex-col">
        {/* Crisp White Content Canvas */}
        <div className="w-full max-w-[100vw] border-0 border-none bg-white p-7 sm:p-12 lg:p-16 flex flex-col rounded-none">
          {/* Top Header Row: Call to Action + Contact Email / Phone */}
          <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 sm:pb-16 border-b border-zinc-100">
            {/* Left Headline */}
            <div className="space-y-3 text-left">
              <img
                src="/Preferred-Air 1.png"
                alt="Preferred Air"
                className="h-9 sm:h-11 w-auto object-contain cursor-pointer"
              />
              <div className="space-y-1">
                <h3 className="font-['Nohemi'] font-bold text-2xl sm:text-3xl lg:text-[38px] text-[#121417] tracking-tight leading-tight">
                  Need AC repair or a new system?
                </h3>
                <p className="font-['Delight'] font-normal text-2xl sm:text-3xl lg:text-[34px] text-zinc-400 tracking-tight leading-tight">
                  We're ready to restore your home comfort.
                </p>
              </div>
            </div>

            {/* Right Contact Details */}
            <div className="flex flex-col items-start md:items-end gap-3 text-left md:text-right shrink-0">
              <a
                href="mailto:info@preferredairaz.com"
                className="group font-['Delight'] text-xl sm:text-2xl lg:text-[32px] font-normal text-[#121417] underline underline-offset-8 decoration-1 hover:text-[#FE552F] hover:decoration-[#FE552F] transition-colors"
              >
                <SplitTextHover text="info@preferredairaz.com" />
              </a>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-['Delight'] text-zinc-500">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Live Dispatch
                </span>
                <span className="text-zinc-300">•</span>
                <a
                  href="tel:4805554822"
                  className="group text-zinc-800 font-semibold hover:text-[#2934ce] transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2934ce]" />
                  <SplitTextHover text="(480) 555-HVAC" />
                </a>
              </div>
            </div>
          </div>

          {/* Middle Section: Multi-Column HVAC Pages Navigation Links */}
          <div className="w-full py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 text-left">
            {footerColumns.map((col, idx) => (
              <div key={idx} className="flex flex-col space-y-3.5">
                {/* Column Title in Delight / SF Pro */}
                <h4 className="font-['Delight'] text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                  {col.title}
                </h4>

                {/* Column Links List */}
                <ul className="space-y-2.5">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href || '#'}
                        onClick={(e) => handleLinkClick(e, link.action, link.href)}
                        className="group inline-flex items-center gap-2 font-['Delight'] text-sm text-zinc-700 hover:text-[#2934ce] transition-colors leading-snug cursor-pointer"
                      >
                        <SplitTextHover text={link.label} />
                        {link.isBadge && (
                          <span className="text-[10px] font-['Delight'] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#ECEDEF] group-hover:bg-[#2934ce]/10 text-zinc-700 group-hover:text-[#2934ce] transition-colors shrink-0">
                            {link.badgeText}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar: Social Icons, Policies, Copyright & Credits */}
          <div className="w-full pt-10 sm:pt-14 border-t border-zinc-100 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-xs font-['Delight'] text-zinc-500">
            {/* Social Links on Left */}
            <div className="flex items-center gap-4 text-[#121417] order-1 lg:order-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preferred Air Instagram"
                className="w-8 h-8 rounded-[8px] bg-zinc-100 hover:bg-[#2934ce] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preferred Air Facebook"
                className="w-8 h-8 rounded-[8px] bg-zinc-100 hover:bg-[#2934ce] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preferred Air LinkedIn"
                className="w-8 h-8 rounded-[8px] bg-zinc-100 hover:bg-[#2934ce] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preferred Air X Twitter"
                className="w-8 h-8 rounded-[8px] bg-zinc-100 hover:bg-[#2934ce] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preferred Air YouTube"
                className="w-8 h-8 rounded-[8px] bg-zinc-100 hover:bg-[#2934ce] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Policy Links in Center */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-600 order-3 lg:order-2">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="group hover:text-[#121417] transition-colors cursor-pointer"
              >
                <SplitTextHover text="Privacy Policy" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('cookies')}
                className="group hover:text-[#121417] transition-colors cursor-pointer"
              >
                <SplitTextHover text="Cookie Preferences" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="group hover:text-[#121417] transition-colors cursor-pointer"
              >
                <SplitTextHover text="Terms of Service" />
              </button>
              <span className="text-zinc-400 hidden sm:inline">|</span>
              <span className="text-zinc-500 font-medium">Licensed & Bonded AZ ROC #324150</span>
            </div>

            {/* Copyright and Credits on Right */}
            <div className="flex items-center gap-3 text-zinc-500 order-2 lg:order-3">
              <span>2026 © Preferred Air Group</span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-700 font-medium">
                Credits:{' '}
                <a
                  href="https://www.dalfstudio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-semibold text-[#121417] hover:text-[#2934ce] transition-colors underline underline-offset-2 decoration-zinc-300 hover:decoration-[#2934ce]"
                >
                  <SplitTextHover text="Dalf Studio" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Cookie Preferences */}
      {activeModal === 'cookies' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[16px] p-6 shadow-2xl border border-zinc-200 text-left space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-[#121417]">
                <Sliders className="w-5 h-5 text-[#2934ce]" />
                <h3 className="font-['Nohemi'] font-bold text-lg">Cookie Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-['Delight'] text-xs text-zinc-600 leading-relaxed">
              We use essential cookies to maintain system functionality and optional performance cookies to optimize
              our HVAC cost estimator calculations and regional dispatching.
            </p>

            <div className="space-y-3 font-['Delight'] text-xs">
              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-[8px]">
                <div>
                  <p className="font-bold text-zinc-800">Strictly Necessary Cookies</p>
                  <p className="text-zinc-500 text-[11px]">Required for core security and estimator states.</p>
                </div>
                <span className="text-zinc-400 font-bold">Always Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-[8px]">
                <div>
                  <p className="font-bold text-zinc-800">Performance & Diagnostics</p>
                  <p className="text-zinc-500 text-[11px]">Help us refine load speeds and service area lookup.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.performance}
                  onChange={(e) =>
                    setCookieSettings({ ...cookieSettings, performance: e.target.checked })
                  }
                  className="w-4 h-4 text-[#2934ce] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-[8px]">
                <div>
                  <p className="font-bold text-zinc-800">Regional Marketing & Utility Rebates</p>
                  <p className="text-zinc-500 text-[11px]">Provides localized APS/SRP rebate notices.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.marketing}
                  onChange={(e) =>
                    setCookieSettings({ ...cookieSettings, marketing: e.target.checked })
                  }
                  className="w-4 h-4 text-[#2934ce] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-['Delight'] font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCookies}
                className="px-5 py-2 text-xs font-['Delight'] font-semibold text-white bg-[#121417] hover:bg-[#2934ce] rounded-[8px] transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Privacy Policy */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[16px] p-6 shadow-2xl border border-zinc-200 text-left space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-[#121417]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-['Nohemi'] font-bold text-lg">Privacy Commitment</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="font-['Delight'] text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Preferred Air Conditioning & Heating ("Preferred Air", AZ ROC #324150) respects your privacy. We collect
                contact information solely to schedule service appointments, dispatch certified technicians, and generate
                transparent HVAC estimates.
              </p>
              <p>
                <strong>We never sell or rent your personal data</strong> to third-party marketing companies. Your address and
                HVAC equipment specs are protected by enterprise encryption and used only by our certified in-house service team.
              </p>
              <p>
                For questions regarding your records or to request data removal, email{' '}
                <a href="mailto:info@preferredairaz.com" className="text-[#2934ce] underline">
                  info@preferredairaz.com
                </a>{' '}
                or call (480) 555-HVAC.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-['Delight'] font-semibold text-white bg-[#121417] hover:bg-[#2934ce] rounded-[8px] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Terms of Service */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[16px] p-6 shadow-2xl border border-zinc-200 text-left space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-[#121417]">
                <CheckCircle2 className="w-5 h-5 text-[#2934ce]" />
                <h3 className="font-['Nohemi'] font-bold text-lg">Terms of Service & Guarantee</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="font-['Delight'] text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                All HVAC repair, maintenance, and system installation services performed by Preferred Air Conditioning &
                Heating are backed by our 100% Satisfaction Guarantee. All technicians are licensed, bonded, and insured
                under Arizona Registrar of Contractors license #ROC 324150.
              </p>
              <p>
                Written estimates are valid for 30 calendar days. Manufacturer warranties on heat pump compressors, coils,
                and heat exchangers are governed by standard manufacturer terms.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-['Delight'] font-semibold text-white bg-[#121417] hover:bg-[#2934ce] rounded-[8px] transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Confirmation for Cookie Settings */}
      {cookiesSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121417] text-white text-xs font-['Delight'] px-4 py-3 rounded-[8px] shadow-lg flex items-center gap-2 border border-zinc-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Your privacy and cookie preferences have been updated.</span>
        </div>
      )}
    </footer>
  );
};

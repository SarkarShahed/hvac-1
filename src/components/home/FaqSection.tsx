import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const hvacFaqs: FaqItem[] = [
  {
    id: 'tune-up-scope',
    question: 'What is included in a comprehensive HVAC tune-up?',
    answer:
      'Our multi-point seasonal tune-up covers heat exchanger inspection, electrical component testing, refrigerant level calibration, condensate drain flush, blower motor cleaning, thermostat calibration, and airflow balance checks to ensure peak efficiency and avoid unexpected mid-season breakdowns.',
  },
  {
    id: 'maintenance-frequency',
    question: 'How often should I service my heating and air conditioning system?',
    answer:
      'We recommend scheduling maintenance twice a year: once in the spring for your cooling and heat pump systems, and once in the autumn for your heating equipment. Regular service protects manufacturer warranties, prevents 95% of unexpected breakdowns, and lowers monthly energy bills by up to 15%.',
  },
  {
    id: 'repair-vs-replace',
    question: 'How do I know if my system needs repair or a complete replacement?',
    answer:
      'If your system is over 10–12 years old, requires frequent repairs costing more than 50% of a new unit, uses phased-out R-22 refrigerant, or causes unexplained spikes in utility bills, replacement with a high-efficiency inverter heat pump or dual-fuel system is typically more economical than ongoing repairs.',
  },
  {
    id: 'sizing-calculation',
    question: 'How is the correct HVAC system size calculated for my home?',
    answer:
      'We perform a certified Manual J load calculation analyzing your home’s square footage, insulation R-values, window orientations, ceiling heights, and local climate data. An oversized unit causes humidity issues and rapid short-cycling, while an undersized unit runs constantly without reaching your desired comfort level.',
  },
  {
    id: 'heat-pump-difference',
    question: 'What is the difference between a heat pump and a traditional furnace?',
    answer:
      'A heat pump moves ambient heat into or out of your home rather than burning fuel, providing both high-efficiency cooling in summer and whisper-quiet heating in winter. When paired with secondary electric or gas backup for extreme cold, modern cold-climate heat pumps deliver up to 300% efficiency.',
  },
  {
    id: 'warranties-financing',
    question: 'Do you offer emergency repairs, warranties, and financing options?',
    answer:
      'Yes. Our licensed technicians provide 24/7 priority emergency service for critical heating and cooling failures. Every installation includes full manufacturer coverage and our 10-year craftsmanship guarantee, backed by competitive 0% APR financing terms tailored to your budget.',
  },
];

export const FaqSection: React.FC = () => {
  // First item open by default matching the reference design
  const [openId, setOpenId] = useState<string | null>('tune-up-scope');

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faqs"
      className="w-full bg-[#F6F7FA] py-20 md:py-28 lg:py-32 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column — Header and Context */}
          <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-32">
            {/* Pill / Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-[#ECEEF2] text-[#6B7280] text-[13px] font-['Rinter'] font-medium tracking-wide mb-6">
              FAQs
            </div>

            {/* Main Section Heading */}
            <h2 className="text-4xl sm:text-5xl font-['SF_Pro'] font-bold text-[#121417] tracking-tight leading-[1.12] mb-5">
              Questions? Answers.
            </h2>

            {/* Subheading / Description */}
            <p className="text-[#6B7280] font-['Rinter'] text-base sm:text-lg leading-relaxed max-w-sm">
              Your most frequently asked questions, all in one place. If you don't see what you need, reach out to us.
            </p>
          </div>

          {/* Right Column — Accordion Cards Stack */}
          <div className="lg:col-span-7 flex flex-col space-y-3.5 w-full">
            {hvacFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl p-6 md:p-7 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                  >
                    <span className="font-['SF_Pro'] font-medium text-[17px] sm:text-[18px] text-[#121417] leading-snug pr-4 transition-colors group-hover:text-black">
                      {faq.question}
                    </span>

                    <span className="shrink-0 ml-2 w-7 h-7 flex items-center justify-center rounded-full text-zinc-500 group-hover:text-[#121417] transition-colors">
                      {isOpen ? (
                        <Minus className="w-5 h-5" strokeWidth={1.75} />
                      ) : (
                        <Plus className="w-5 h-5" strokeWidth={1.75} />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.22, delay: 0.05 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.15 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="font-['Rinter'] text-[#5A6270] text-[15px] sm:text-[15.5px] leading-relaxed pt-3.5 pr-8">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

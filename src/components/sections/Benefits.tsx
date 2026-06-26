import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

export default function Benefits() {
  const benefitsList = [
    {
      title: 'Save 6+ hours per semester per student',
      description: 'Eliminate tedious manual handwriting and diagram tracing. Focus on actual coding and learning engineering concepts.',
    },
    {
      title: 'Faculty evaluate on their own schedule',
      description: 'Ditch the heavy bundles of record books. Access submissions anywhere, anytime, with quick comment templates.',
    },
    {
      title: 'No lost or damaged physical records',
      description: 'Paper tears and ink spills are a thing of the past. Everything is backed up and securely cached for JNTU board reviews.',
    },
    {
      title: 'Automatic semester-end compilation',
      description: 'Never worry about missing indexes. Your entire semester record book compiles into a flawless PDF index in one tap.',
    },
  ];

  return (
    <section
      id="benefits"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Value Prop Block) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left select-none">
            {/* Eyebrow */}
            <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5">
              <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
                Why RecordFlow
              </span>
            </div>

            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white mb-6">
              No more last-minute printing. Ever.
            </h2>
            <p className="text-[15px] sm:text-[16px] text-text-secondary leading-relaxed font-satoshi mb-8 max-w-md">
              RecordFlow removes the friction from weekly lab submissions. No more late nights copying codes onto paper or stressing over faculty signature deadlines. 
            </p>

            <Button
              variant="primary"
              size="md"
              showArrow
              data-interactive="true"
              onClick={() => {
                const ctaSec = document.getElementById('cta-section');
                if (ctaSec) ctaSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started free
            </Button>
          </div>

          {/* Right Column (Framer Motion Staggered Stack) */}
          <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
            {benefitsList.map((benefit, idx) => {
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-2xl bg-bg-secondary/40 border border-white/4 backdrop-blur-sm select-none"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-satoshi text-white mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-satoshi">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

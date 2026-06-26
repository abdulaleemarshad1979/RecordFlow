import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqList: FAQItem[] = [
    {
      question: 'Is RecordFlow free for students?',
      answer: 'Yes! RecordFlow is 100% free for individual engineering students to upload, manage, and compile their weekly laboratory practical files.',
    },
    {
      question: 'What file formats can students upload?',
      answer: 'We support code source files (.c, .cpp, .java, .py, .html, .js) as well as standardized document files like PDF, DOCX, and PNG/JPEG images for electronic circuits or hand-drawn schematics.',
    },
    {
      question: 'Can one student submit to multiple faculty members?',
      answer: 'Absolutely. Every class assignment is linked directly to a unique Subject Code and instructor name. Students can enroll in all of their semester labs simultaneously.',
    },
    {
      question: 'How is the semester PDF generated?',
      answer: 'Our digital engine compiles all evaluated practical submissions, matches them against the index page, calculates the cumulative grade averages, and outputs a standardized, JNTU-compliant PDF ready for direct printing.',
    },
    {
      question: 'Is student data secure and private?',
      answer: 'Yes. All source code and file submissions are stored securely in cloud arrays. Access is strictly permission-gated: only the submitting student, the assigned faculty grader, and authorized department inspectors can view the data.',
    },
    {
      question: 'Does RecordFlow work on mobile?',
      answer: 'Yes, fully. The platform is responsive down to smallest screens. Students can easily snap a picture of their hardware outputs or physical diagrams in the lab, upload files, and check evaluation feedback on their smartphones.',
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-center items-center select-none">
          <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5">
            <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
              FAQ
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-secondary font-medium font-satoshi max-w-md leading-relaxed">
            Everything you need to know about migrating your engineering labs to RecordFlow.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="flex flex-col border-t border-white/6 select-none">
          {faqList.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-white/6"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between py-6 text-left hover:text-white transition-colors duration-150 cursor-pointer group"
                  data-interactive="true"
                >
                  <span className="font-bold text-base md:text-lg font-satoshi text-slate-200 group-hover:text-white">
                    {faq.question}
                  </span>
                  
                  {/* Rotating Plus Icon */}
                  <div
                    className={`w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-300 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-accent-blue border-accent-blue/20 bg-accent-blue/10' : ''
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Animated expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.15 } }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { height: { duration: 0.2, ease: 'easeIn' }, opacity: { duration: 0.1 } }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-6 text-xs md:text-sm leading-relaxed text-text-secondary font-satoshi">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

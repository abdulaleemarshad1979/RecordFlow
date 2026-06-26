import React from 'react';
import { motion } from 'motion/react';

interface WorkflowStepItem {
  num: string;
  title: string;
  description: string;
}

export default function Workflow() {
  const steps: WorkflowStepItem[] = [
    {
      num: '01',
      title: 'Faculty creates assignment',
      description: 'Sets course code, experiment topic, grading rubric, and deadline parameters.',
    },
    {
      num: '02',
      title: 'Students upload work',
      description: 'Submit diagrams or code via mobile/web with instant receipt validation.',
    },
    {
      num: '03',
      title: 'Faculty evaluates',
      description: 'Examines PDF attachments directly on-screen, inputs grades, and writes remarks.',
    },
    {
      num: '04',
      title: 'Marks stored instantly',
      description: 'Scores automatically map to profiles, calculating running averages in real-time.',
    },
    {
      num: '05',
      title: 'Semester archive generated',
      description: 'Our engine compiles all evaluated work and metadata into a standardized ledger.',
    },
    {
      num: '06',
      title: 'Student downloads record',
      description: 'One-click generates a perfectly formatted, JNTU-compliant printable PDF.',
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="workflow"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden px-6"
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 md:mb-20 text-center items-center">
          {/* Eyebrow */}
          <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5 select-none">
            <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
              Workflow
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white max-w-2xl select-none mb-4">
            Flawless coordination, <br />
            from Exp 1 to Externals.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-secondary font-medium font-satoshi max-w-lg leading-relaxed select-none">
            How RecordFlow streamlines lab administration for students and instructors alike.
          </p>
        </div>

        {/* Steps Grid / Timeline Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {steps.map((step, idx) => {
            return (
              <motion.div
                key={idx}
                variants={stepVariants}
                className="relative rounded-2xl bg-bg-secondary/60 border border-white/5 p-6 backdrop-blur-sm select-none flex flex-col justify-between overflow-hidden group min-h-[180px]"
              >
                {/* Large Background Numeral */}
                <div className="absolute right-3 -bottom-4 text-7xl md:text-8xl font-black font-satoshi text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.05] transition-all duration-300">
                  {step.num}
                </div>

                {/* Top indicator & Glow dot */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent-blue font-satoshi">
                    Step {step.num}
                  </span>
                  {/* Glowing active indicator dot */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-3 h-3 rounded-full bg-accent-blue/30 animate-ping" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="relative z-10 mt-auto">
                  <h3 className="text-base md:text-lg font-bold font-satoshi text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-satoshi">
                    {step.description}
                  </p>
                </div>

                {/* Custom dashed line connector (Only visible on Desktop, between columns) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-5 w-10 border-t border-dashed border-white/10 z-20 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

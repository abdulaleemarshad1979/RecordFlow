import React from 'react';
import { motion } from 'motion/react';
import { UploadCloud, Award, FileText, Library, Activity, ShieldCheck } from 'lucide-react';

interface FeatureItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export default function Features() {
  const featuresList: FeatureItem[] = [
    {
      icon: UploadCloud,
      title: 'Digital Submission',
      description: 'Upload experiments, code, and diagrams any time, from any mobile or desktop browser. No more bulky hand-written books.',
    },
    {
      icon: Award,
      title: 'Faculty Evaluation',
      description: 'Review submissions, insert contextual comments, and grade in batches at your convenience. Absolute control for lab instructors.',
    },
    {
      icon: FileText,
      title: 'Auto PDF Generation',
      description: 'Generate a perfectly compiled, standardized index and record book at semester-end, formatted exactly to meet board regulations.',
    },
    {
      icon: Library,
      title: 'Subject Organization',
      description: 'Experiments are automatically organized by subject code, batch, date, and assigned faculty, keeping files perfectly indexed.',
    },
    {
      icon: Activity,
      title: 'Progress Tracking',
      description: 'Real-time timeline graphs let students know when their submissions are checked, graded, or require corrections.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure File Storage',
      description: 'Secure cloud hosting preserves submissions and evaluation audit trails all year, safely accessible for JNTU/AICTE inspection.',
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section
      id="features"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-16 md:mb-20 text-left">
          {/* Section Eyebrow */}
          <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5 select-none">
            <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
              Features
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white max-w-2xl select-none mb-4">
            Everything you need. <br />
            Nothing you don't.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-secondary font-medium font-satoshi max-w-lg leading-relaxed select-none">
            Built from scratch to match the workflows and audit regulations of Indian engineering colleges.
          </p>
        </div>

        {/* 3-Column Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative rounded-3xl bg-bg-secondary/80 border border-white/6 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent-blue/30 hover:bg-bg-tertiary/60 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_20px_40px_rgba(0,0,0,0.4)] cursor-default select-none"
                style={{
                  willChange: 'transform, box-shadow, border-color, background-color',
                }}
              >
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue transition-all duration-300 group-hover:scale-105 group-hover:bg-accent-blue/20 group-hover:border-accent-blue/30">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold font-satoshi text-white mt-5">
                  {feature.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-satoshi mt-2.5">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

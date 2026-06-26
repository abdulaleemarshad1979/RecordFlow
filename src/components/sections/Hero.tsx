import React from 'react';
import { motion } from 'motion/react';
import Button from '../ui/Button';
import { Laptop, Play, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1] 
      } 
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 md:pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center bg-bg-primary"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] max-w-5xl rounded-full radial-glow pointer-events-none opacity-80" />

      {/* Grid background overlay for technical texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.div
          id="hero-eyebrow"
          variants={itemVariants}
          className="flex items-center pl-3 border-l-2 border-accent-blue mb-6 self-center h-5 select-none"
        >
          <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
            For Engineering Colleges · India
          </span>
        </motion.div>

        {/* H1 Headline */}
        <motion.h1
          id="hero-title"
          variants={titleVariants}
          className="text-[42px] sm:text-[56px] md:text-[72px] leading-[1.1] font-bold font-satoshi tracking-[-2px] text-white mb-6 select-none"
        >
          Lab records, <br />
          <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
            finally digital.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          id="hero-subheadline"
          variants={itemVariants}
          className="text-[16px] sm:text-[18px] text-text-secondary font-medium font-satoshi max-w-xl mx-auto leading-relaxed mb-10 select-none"
        >
          Submit lab work digitally, get faculty feedback instantly, 
          and download a print-ready semester record in one click.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          id="hero-ctas"
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button
            variant="primary"
            size="lg"
            showArrow
            className="w-full sm:w-auto h-12 text-sm md:text-base font-semibold px-8"
            data-interactive="true"
            onClick={() => handleScrollTo('cta-section')}
          >
            Start for free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto group text-sm md:text-base h-12"
            data-interactive="true"
            onClick={() => handleScrollTo('workflow')}
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current text-accent-cyan" />
              See how it works
            </span>
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          id="hero-social-proof"
          variants={itemVariants}
          className="flex items-center justify-center gap-3.5 mb-20 select-none"
        >
          <div className="flex -space-x-3.5">
            {['#2563EB', '#0D9488', '#4F46E5', '#0284C7'].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                style={{ backgroundColor: color }}
              >
                {['SR', 'AP', 'KV', 'YV'][i]}
              </div>
            ))}
          </div>
          <span className="text-xs md:text-sm font-medium font-satoshi text-text-secondary">
            Trusted by <strong className="text-white font-semibold">2,400+ students</strong> across Andhra Pradesh
          </span>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div
          id="hero-visual-container"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-5xl rounded-2xl border border-white/6 bg-bg-secondary/80 backdrop-blur-xl p-1 shadow-2xl select-none"
        >
          {/* Subtle glow behind the window */}
          <div className="absolute inset-0 rounded-2xl bg-accent-blue/5 -z-10 blur-xl" />

          {/* Browser Chrome Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 text-xs text-text-muted">
            {/* Window controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Address Bar */}
            <div className="bg-bg-primary/90 border border-white/4 px-6 py-1 rounded-full text-[11px] font-mono tracking-tight text-text-secondary/80 w-1/2 md:w-1/3 flex items-center justify-center gap-1.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              recordflow.in/dashboard
            </div>
            {/* Actions placeholder */}
            <Laptop className="w-4 h-4 text-text-muted/60" />
          </div>

          {/* Dashboard Inside Mockup (HTML-based CSS preview) */}
          <div className="bg-bg-primary/50 p-4 md:p-6 text-left overflow-x-auto min-w-[340px]">
            {/* Header stats row */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
              {[
                { label: 'Total Submissions', val: '18 / 20', color: 'text-accent-blue', bar: true, barPercent: '90%' },
                { label: 'Average Score', val: '9.2 / 10', color: 'text-accent-cyan', bar: false, barPercent: '' },
                { label: 'Faculty Remarks', val: '2 New', color: 'text-green-400', bar: false, barPercent: '' },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-tertiary border border-white/6 p-3 md:p-4 rounded-xl">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-text-muted font-satoshi mb-1">
                    {stat.label}
                  </span>
                  <span className={`block text-lg md:text-2xl font-bold font-satoshi text-white ${stat.color}`}>
                    {stat.val}
                  </span>
                  {stat.bar && (
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-accent-blue h-full rounded-full" style={{ width: stat.barPercent }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Experiment Log Table Preview */}
            <div className="bg-bg-tertiary border border-white/6 rounded-xl overflow-hidden">
              <div className="border-b border-white/6 bg-white/2 px-4 py-3 flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-text-secondary font-satoshi">
                  Recent Practical Submissions
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-medium">
                  Verified JNTU-AP Schema
                </span>
              </div>
              
              <div className="divide-y divide-white/4">
                {[
                  { exp: 'Exp 5: Socket Programming in C', date: '25 Jun 2026', status: 'Evaluated', marks: '9.5 / 10', remarks: 'Excellent error-handling routines.' },
                  { exp: 'Exp 6: Distance Vector Routing Simulation', date: '26 Jun 2026', status: 'Evaluated', marks: '9.0 / 10', remarks: 'Good latency explanations.' },
                  { exp: 'Exp 7: Dynamic Host Configuration Protocol', date: '26 Jun 2026', status: 'Pending', marks: 'Awaiting', remarks: 'Under review by Dr. Priya' },
                ].map((row, idx) => (
                  <div key={idx} className="p-3.5 md:p-4 grid grid-cols-12 gap-2 text-xs items-center hover:bg-white/1 transition-all">
                    <div className="col-span-6 md:col-span-4 font-semibold text-white font-satoshi truncate">
                      {row.exp}
                    </div>
                    <div className="col-span-3 md:col-span-2 text-text-secondary font-mono text-[11px]">
                      {row.date}
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                        ${row.status === 'Evaluated' 
                          ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                          : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${row.status === 'Evaluated' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {row.status}
                      </span>
                    </div>
                    <div className="hidden md:block md:col-span-1.5 text-white font-bold font-mono">
                      {row.marks}
                    </div>
                    <div className="hidden md:block md:col-span-2.5 text-text-muted truncate italic">
                      {row.remarks}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

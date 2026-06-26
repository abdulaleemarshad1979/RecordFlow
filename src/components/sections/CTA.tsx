import React, { useState } from 'react';
import Button from '../ui/Button';
import { Mail, CheckSquare, GraduationCap, ThumbsUp } from 'lucide-react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccess(true);
    setEmail('');
  };

  return (
    <section
      id="cta-section"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden px-6"
    >
      {/* Background glowing sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full radial-glow pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto relative z-10 select-none">
        <div className="rounded-3xl border border-white/6 bg-bg-secondary/70 backdrop-blur-2xl p-8 md:p-14 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle glowing borders or corner elements */}
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

          {/* Icon badge */}
          <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue mx-auto mb-6">
            <GraduationCap className="w-5 h-5 animate-bounce" />
          </div>

          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold font-satoshi tracking-tight text-white mb-4">
            Ready to digitize your engineering lab?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-satoshi max-w-xl mx-auto mb-10">
            Join engineering departments across Andhra Pradesh in eliminating physical records. Save hours of tedious manual copying and ensure absolute compliance.
          </p>

          {success ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-accent-blue/5 border border-accent-blue/20 flex flex-col items-center gap-3">
              <ThumbsUp className="w-8 h-8 text-accent-cyan" />
              <h4 className="text-sm font-bold font-satoshi text-white">
                Awesome! You're on the list!
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Thank you for your interest! We have received your request and will send onboarding steps to your inbox shortly.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your college email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-primary/90 border border-white/10 rounded-full px-5 py-3 text-xs md:text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors font-satoshi shadow-inner h-11"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  showArrow
                  className="px-6 h-11"
                  data-interactive="true"
                >
                  Join Waiting List
                </Button>
              </form>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-text-muted font-mono mt-4">
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-accent-cyan" /> Free for students
                </span>
                <span className="hidden sm:inline-block text-white/5">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-accent-cyan" /> Compliant with Board Audits
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

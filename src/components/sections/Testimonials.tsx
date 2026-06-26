import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  college: string;
  avatarColor: string;
  initials: string;
  quote: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Rohan Deshmukh',
      role: 'B.Tech IT Student',
      college: 'Aditya College of Engineering (ACET), AP',
      avatarColor: 'bg-indigo-600',
      initials: 'RD',
      quote: 'We used to copy code snippets onto paper for hours before exam internals. RecordFlow lets me submit clean GitHub links directly. Absolute lifesaver!',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Assistant Professor (CSE)',
      college: 'JNTU Kakinada, AP',
      avatarColor: 'bg-emerald-600',
      initials: 'PS',
      quote: 'Evaluating 120 students weekly was a administrative nightmare. Now I batch-grade on RecordFlow, insert quick code corrections, and generate reports instantly.',
    },
    {
      name: 'Dr. K. Srinivas Rao',
      role: 'Department HOD (CSE)',
      college: 'KL University, AP',
      avatarColor: 'bg-cyan-600',
      initials: 'KR',
      quote: 'RecordFlow ensures 100% compliance during board checks. The semester compilation is flawless, giving us perfect digital transparency for student internal reviews.',
    },
  ];

  return (
    <section
      id="students"
      className="py-24 md:py-32 bg-bg-secondary relative overflow-hidden px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-16 md:mb-20 text-center items-center">
          {/* Eyebrow */}
          <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5 select-none">
            <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
              Testimonials
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white max-w-2xl select-none mb-4">
            Loved by students. <br />
            Trusted by administration.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-secondary font-medium font-satoshi max-w-lg leading-relaxed select-none">
            Read how engineering departments in Andhra Pradesh are transforming their lab records.
          </p>
        </div>

        {/* 3-Column Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
          {testimonials.map((test, idx) => {
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl bg-bg-primary/80 border border-white/6 p-8 backdrop-blur-xl hover:border-accent-blue/20 transition-all duration-300"
              >
                {/* 5 Golden Stars */}
                <div className="flex items-center gap-1 mb-5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm md:text-[15px] italic text-slate-300 font-satoshi leading-relaxed mb-6">
                  "{test.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-5 mt-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner ${test.avatarColor}`}>
                    {test.initials}
                  </div>
                  <div className="truncate">
                    <span className="block text-sm font-bold font-satoshi text-white">
                      {test.name}
                    </span>
                    <span className="block text-[11px] text-text-secondary truncate">
                      {test.role}
                    </span>
                    <span className="block text-[9.5px] text-text-muted font-mono truncate">
                      {test.college}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

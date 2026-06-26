import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, AlertTriangle, Loader2, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function DownloadRecord() {
  const { user } = useAuth();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Download PDF";
  }, []);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1500);
  };

  const inclusions = [
    "Cover page with student details",
    "Index / table of contents",
    "All experiment files",
    "Faculty remarks and grades",
    "Submission and evaluation dates",
    "Final grade summary"
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 items-center relative h-full">
      {/* Page Header */}
      <div className="w-full max-w-[640px] flex flex-col gap-2">
        <h2 className="text-xl font-bold font-satoshi text-white text-center md:text-left">
          Semester Record
        </h2>
        <p className="text-[13px] text-[#475569] font-satoshi text-center md:text-left">
          Download your complete evaluated lab record book
        </p>
      </div>

      {/* Main Download Card */}
      <div className="w-full max-w-[640px] flex flex-col gap-6">
        
        {/* Semester Summary Card */}
        <div
          className="glass-panel border border-white/[0.05] rounded-[16px] p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
          style={{
            background: 'rgba(9, 11, 20, 0.7)',
          }}
        >
          <div className="flex items-start md:items-center gap-4 min-w-0">
            {/* Left Book Icon */}
            <div className="w-14 h-14 rounded-[12px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-accent-blue flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>

            {/* Middle info */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-base font-bold font-satoshi text-white">
                Semester 4 Lab Record Book
              </h3>
              <p className="text-xs text-[#475569] font-satoshi mt-1 leading-normal">
                14 evaluated experiments · 4 subjects · AY {user?.academicYear || '2025–26'}
              </p>

              {/* Subject Progress Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5 select-none">
                <span className="text-[10.5px] font-semibold text-slate-500 font-satoshi uppercase bg-green-500/10 border border-green-500/20 text-[#22C55E] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  DS Lab (5/6)
                </span>
                <span className="text-[10.5px] font-semibold text-slate-500 font-satoshi uppercase bg-green-500/10 border border-green-500/20 text-[#22C55E] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  Web Tech (4/6)
                </span>
                <span className="text-[10.5px] font-semibold text-slate-500 font-satoshi uppercase bg-green-500/10 border border-green-500/20 text-[#22C55E] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  OS Lab (6/6)
                </span>
                <span className="text-[10.5px] font-semibold text-slate-500 font-satoshi uppercase bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  DBMS Lab (3/6)
                </span>
              </div>
            </div>
          </div>

          {/* Download Trigger */}
          <Button
            variant="primary"
            size="md"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full md:w-auto h-11 rounded-[10px] text-xs font-semibold px-6 select-none cursor-pointer flex items-center justify-center flex-shrink-0 mt-2 md:mt-0"
            data-interactive="true"
          >
            {isDownloading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Compiling...
              </span>
            ) : (
              'Download PDF →'
            )}
          </Button>
        </div>

        {/* Missing Records Warning Alert */}
        <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-[10px] p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-amber-500 font-satoshi uppercase tracking-wider select-none">
              Attention Required
            </h4>
            <p className="text-xs text-[#94A3B8] font-satoshi leading-normal mt-0.5">
              DBMS Lab is missing 3 experiments. These won't appear in your PDF. Ensure all missing works are evaluated prior to final submissions.
            </p>
          </div>
        </div>

        {/* What's Included details card */}
        <div
          className="glass-panel border border-white/[0.04] rounded-[16px] p-6 flex flex-col gap-4"
          style={{
            background: 'rgba(9, 11, 20, 0.5)',
          }}
        >
          <h4 className="text-sm font-bold text-white font-satoshi tracking-tight">
            Your PDF will include
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inclusions.map((inc) => (
              <div key={inc} className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span className="text-xs text-[#94A3B8] font-satoshi">
                  {inc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Download Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 glass-panel bg-[#090B14]/90 border border-[#3B82F6]/30 rounded-[12px] p-4 shadow-xl flex items-center gap-3 max-w-sm"
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-4.5 h-4.5 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-white font-satoshi">Download Complete</span>
              <span className="text-xs text-[#94A3B8] font-satoshi leading-normal truncate max-w-[240px]">
                record_book_sem4_{user?.name ? user.name.replace(/\s+/g, '') : 'Student'}.pdf downloaded
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

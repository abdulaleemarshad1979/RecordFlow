import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import ReviewCard from '../../components/dashboard/ReviewCard';

export default function ReviewSubmissions() {
  const { pendingSubmissions, gradedSubmissions, gradeSubmission } = useDashboard();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Review Submissions";
  }, []);

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded state for already graded
  const [isGradedExpanded, setIsGradedExpanded] = useState(false);

  // Filtered and sorted pending list
  const filteredPending = useMemo(() => {
    return pendingSubmissions
      .filter((sub) => {
        const matchSubject = selectedSubject === 'all' || sub.subjectId === selectedSubject;
        const matchSearch =
          sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSubject && matchSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.submittedAt).getTime();
        const timeB = new Date(b.submittedAt).getTime();
        return sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
      });
  }, [pendingSubmissions, selectedSubject, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-xl font-bold font-satoshi text-white">
          Review Submissions
        </h2>
        <p className="text-[13px] text-[#475569] font-satoshi">
          {pendingSubmissions.length} {pendingSubmissions.length === 1 ? 'submission' : 'submissions'} waiting for your evaluation
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="all">All Subjects</option>
            <option value="web">Web Technologies Lab</option>
            <option value="dbms">DBMS Lab</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'oldest' | 'newest')}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
        </div>

        {/* Search bar input */}
        <div className="relative w-full sm:w-64 flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student or exp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090B14] border border-white/[0.08] rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-white font-satoshi placeholder-slate-600 focus:border-accent-blue/50 outline-none"
          />
        </div>
      </div>

      {/* Pending Evaluations List */}
      <div className="flex flex-col gap-4">
        {filteredPending.length === 0 ? (
          <div className="glass-panel border border-white/[0.04] bg-[#090B14]/40 py-16 text-center text-xs text-[#475569] font-satoshi select-none">
            No matching submissions found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPending.map((sub) => (
                <ReviewCard
                  key={sub.id}
                  submission={sub}
                  onGradeSubmit={gradeSubmission}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Already Graded Collapsible Section */}
      {gradedSubmissions.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => setIsGradedExpanded(!isGradedExpanded)}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest font-satoshi hover:text-white select-none cursor-pointer"
            data-interactive="true"
          >
            {isGradedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Show {gradedSubmissions.length} recently graded submissions</span>
          </button>

          <AnimatePresence>
            {isGradedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                {gradedSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-[#090B14]/40 border border-white/[0.04] rounded-[14px] p-5 flex flex-col gap-3 shadow select-none"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-[#94A3B8] font-satoshi">
                          {sub.studentName}
                        </span>
                        <span className="text-[11px] text-[#475569] font-satoshi">
                          {sub.rollNo}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold font-satoshi uppercase bg-green-500/10 border border-green-500/20 text-[#22C55E] px-2.5 py-0.5 rounded-full select-none">
                          Graded: {sub.grade}/10
                        </span>
                        <span className="text-[11px] text-[#475569] font-satoshi">
                          {sub.gradedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-[#334155] uppercase tracking-wider font-satoshi">
                        Exp 0{sub.expNo}
                      </span>
                      <h4 className="text-sm font-medium text-[#64748B] font-satoshi">
                        {sub.title}
                      </h4>
                    </div>

                    {sub.remarks && (
                      <div className="bg-white/[0.005] border border-white/[0.03] rounded-[8px] p-3 text-[13px] text-[#475569] font-satoshi italic leading-relaxed">
                        "{sub.remarks}"
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

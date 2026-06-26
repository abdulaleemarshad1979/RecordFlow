import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Download, X, FileSearch, Calendar, User, Tag } from 'lucide-react';
import { subjects, Submission } from '../../data/mockData';
import { useDashboard } from '../../hooks/useDashboard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/dashboard/EmptyState';

export default function MyRecords() {
  const { submissions } = useDashboard();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — My Records";
  }, []);

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Filter logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSubject = selectedSubject === 'all' || sub.subjectId === selectedSubject;
      const matchStatus = selectedStatus === 'all' || sub.status === selectedStatus;
      return matchSubject && matchStatus;
    });
  }, [selectedSubject, selectedStatus, submissions]);

  // Handle simulated downloads
  const handleDownload = (sub: Submission) => {
    alert(`Downloading evaluated file: ${sub.title.replace(/\s+/g, '_')}_graded.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header section with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold font-satoshi text-white">
          My Records
        </h2>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="all">All Statuses</option>
            <option value="graded">Graded</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Main Database Table/Card List container */}
      <div className="w-full">
        {filteredSubmissions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#090B14] border border-white/[0.05] rounded-[14px] overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B1120] border-b border-white/[0.05] text-[11px] font-bold uppercase tracking-wider text-[#475569] font-satoshi select-none">
                    <th className="py-4 px-6">Experiment</th>
                    <th className="py-4 px-5">Subject</th>
                    <th className="py-4 px-5 lg:table-cell hidden">Faculty</th>
                    <th className="py-4 px-5">Submitted</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Grade</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px] text-[#94A3B8] font-satoshi">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-white truncate max-w-xs">
                            {sub.title}
                          </span>
                          <span className="text-[11px] text-[#475569] uppercase font-medium">
                            Exp {sub.expNo} · Lab Record
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 truncate max-w-[140px]">
                        {subjects.find((s) => s.id === sub.subjectId)?.name || sub.subjectId}
                      </td>
                      <td className="py-4 px-5 lg:table-cell hidden text-slate-400">
                        {sub.faculty}
                      </td>
                      <td className="py-4 px-5">
                        {sub.submittedAt}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-4 px-5 font-semibold">
                        {sub.status === 'graded' ? (
                          <span className="text-[#22C55E] bg-green-500/10 px-2 py-0.5 border border-green-500/10 rounded">
                            {sub.grade} / 10
                          </span>
                        ) : (
                          <span className="text-slate-600 pl-3">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="w-7 h-7 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                            title="View Feedback"
                            data-interactive="true"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {sub.status === 'graded' && (
                            <button
                              onClick={() => handleDownload(sub)}
                              className="w-7 h-7 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                              title="Download File"
                              data-interactive="true"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="glass-panel border border-white/[0.06] bg-[#090B14]/80 rounded-[12px] p-4 flex flex-col gap-4"
                  style={{
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-satoshi select-none">
                      Exp {sub.expNo} · {subjects.find((s) => s.id === sub.subjectId)?.name.split(' ')[0] || sub.subjectId}
                    </span>
                    <h3 className="text-sm font-semibold text-white font-satoshi truncate leading-normal">
                      {sub.title}
                    </h3>
                  </div>

                  {/* Meta items */}
                  <div className="grid grid-cols-2 gap-y-2 text-xs font-satoshi text-[#64748B]">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span className="truncate">{sub.faculty}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{sub.submittedAt}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.05]" />

                  {/* Actions & Status row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} />
                      {sub.status === 'graded' && (
                        <span className="text-xs font-bold text-[#22C55E] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-satoshi select-none">
                          {sub.grade}/10
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-xs text-[#3B82F6] hover:text-[#60A5FA] font-satoshi font-semibold flex items-center gap-1 cursor-pointer"
                        data-interactive="true"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      {sub.status === 'graded' && (
                        <button
                          onClick={() => handleDownload(sub)}
                          className="text-xs text-slate-400 hover:text-white font-satoshi font-semibold flex items-center gap-1 cursor-pointer"
                          data-interactive="true"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get File</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Remarks/Evaluation Feedback Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-[#090B14] border border-white/[0.08] w-full max-w-[480px] rounded-[16px] p-6 lg:p-7 relative z-10 shadow-2xl flex flex-col gap-5 select-none"
            >
              {/* Close icon */}
              <button
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                data-interactive="true"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Subject meta */}
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
                  Experiment {selectedSubmission.expNo} Evaluation
                </span>
                <h3 className="text-lg font-bold font-satoshi text-white leading-snug">
                  {selectedSubmission.title}
                </h3>
                <span className="text-xs text-[#475569] font-satoshi mt-1.5">
                  {subjects.find((s) => s.id === selectedSubmission.subjectId)?.name || selectedSubmission.subjectId}
                </span>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Status and Grade Display */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-slate-500 uppercase font-satoshi">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedSubmission.status} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[11px] text-slate-500 uppercase font-satoshi">Grade Earned</span>
                  <span className="text-2xl font-bold font-satoshi text-[#3B82F6] mt-0.5 select-none">
                    {selectedSubmission.status === 'graded' ? `${selectedSubmission.grade} / 10` : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Faculty Remarks Text Block */}
              {selectedSubmission.status === 'graded' ? (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] text-slate-500 uppercase font-satoshi">Faculty Remarks</span>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-[8px] p-4 font-satoshi italic text-[13.5px] text-[#94A3B8] leading-relaxed">
                    "{selectedSubmission.remarks || 'No remarks provided.'}"
                  </div>
                  <span className="text-xs font-semibold text-[#475569] font-satoshi text-right select-none">
                    — {selectedSubmission.faculty}
                  </span>
                </div>
              ) : (
                <div className="bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[8px] p-4 text-center text-xs text-[#475569] font-satoshi select-none">
                  Feedback and grading remarks will be available once evaluated.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

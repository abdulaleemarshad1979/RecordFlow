import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Eye, BookOpen, GraduationCap, School } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { StudentListItem } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

export default function StudentsList() {
  const { students, subjects } = useDashboard();
  const { user } = useAuth();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Students";
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortOrder, setSortOrder] = useState('name');
  const [activeStudent, setActiveStudent] = useState<StudentListItem | null>(null);

  // Compute student stats
  const stats = useMemo(() => {
    const total = students.length;
    let onTrack = 0;
    let attention = 0;

    students.forEach((st) => {
      let sum = 0;
      let count = 0;
      (Object.values(st.grades) as (number | null)[][]).forEach((gradesArr) => {
        gradesArr.forEach((g) => {
          if (g !== null) {
            sum += g;
            count++;
          }
        });
      });
      const avg = count > 0 ? sum / count : 0;
      if (count > 0 && avg >= 7.5) {
        onTrack++;
      } else {
        attention++;
      }
    });

    return { total, onTrack, attention };
  }, [students]);

  // Filter and sort students list
  const filteredStudents = useMemo(() => {
    return students
      .filter((st) => {
        const matchSearch =
          st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSection = selectedSection === 'all' || st.section === selectedSection;
        return matchSearch && matchSection;
      })
      .map((st) => {
        let sum = 0;
        let count = 0;
        (Object.values(st.grades) as (number | null)[][]).forEach((gradesArr) => {
          gradesArr.forEach((g) => {
            if (g !== null) {
              sum += g;
              count++;
            }
          });
        });
        const avg = count > 0 ? sum / count : 0;
        
        let status: 'on_track' | 'falling_behind' | 'at_risk' = 'on_track';
        let statusLabel = 'On track';
        let statusClass = 'bg-green-500/10 border-green-500/20 text-[#22C55E]';

        if (count === 0 || avg < 5) {
          status = 'at_risk';
          statusLabel = 'At risk';
          statusClass = 'bg-red-500/10 border-red-500/20 text-[#EF4444]';
        } else if (avg < 7.5) {
          status = 'falling_behind';
          statusLabel = 'Falling behind';
          statusClass = 'bg-amber-500/10 border-amber-500/20 text-[#F59E0B]';
        }

        return {
          ...st,
          avg,
          avgLabel: count > 0 ? avg.toFixed(1) : '—',
          status,
          statusLabel,
          statusClass
        };
      })
      .sort((a, b) => {
        if (sortOrder === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortOrder === 'grade-desc') {
          return b.avg - a.avg;
        } else if (sortOrder === 'submissions-desc') {
          return b.submissions.length - a.submissions.length;
        }
        return 0;
      });
  }, [students, searchQuery, selectedSection, sortOrder]);

  // Subject breakdown computations for active student drawer
  const subjectBreakdown = useMemo(() => {
    if (!activeStudent) return [];

    // Faculty only teaches subjects assigned to them (or fallback to 'web' and 'dbms')
    const facultySubjects = subjects.filter((s) => s.faculty === user?.name || s.id === 'web' || s.id === 'dbms');

    return facultySubjects.map((sub) => {
      const grades = activeStudent.grades[sub.id] || [];
      const totalSubmitted = grades.length;
      const progressPercent = Math.round((totalSubmitted / sub.total) * 100);

      // Determine progress bar color
      let barColor = 'bg-[#EF4444]';
      if (progressPercent === 100) {
        barColor = 'bg-[#22C55E]';
      } else if (progressPercent > 50) {
        barColor = 'bg-[#3B82F6]';
      } else if (progressPercent > 0) {
        barColor = 'bg-[#F59E0B]';
      }

      // Format experiments history list
      const experiments = Array.from({ length: sub.total }, (_, i) => {
        const expNo = i + 1;
        const gradeVal = grades[i];
        
        let label = 'Not submitted';
        let colorClass = 'text-slate-600';
        
        if (gradeVal !== undefined) {
          if (gradeVal === null) {
            label = 'Pending';
            colorClass = 'text-[#F59E0B] font-medium';
          } else {
            label = `${gradeVal} / 10`;
            colorClass = 'text-[#22C55E] font-semibold';
          }
        }

        return { expNo, label, colorClass };
      });

      return {
        ...sub,
        totalSubmitted,
        progressPercent,
        barColor,
        experiments
      };
    });
  }, [activeStudent]);

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 pb-12 relative">
      {/* Page Header */}
      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-xl font-bold font-satoshi text-white">
          Students
        </h2>
        <p className="text-[13px] text-[#475569] font-satoshi">
          {user?.section || '—'} · {stats.total} students enrolled
        </p>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3 items-center select-none">
        <span className="text-[13px] font-medium font-satoshi bg-white/[0.03] border border-white/[0.06] text-slate-300 px-4 py-1.5 rounded-full">
          {stats.total} enrolled
        </span>
        <span className="text-[13px] font-medium font-satoshi bg-green-500/5 border border-green-500/15 text-[#22C55E] px-4 py-1.5 rounded-full">
          {stats.onTrack} on track
        </span>
        <span className="text-[13px] font-medium font-satoshi bg-red-500/5 border border-red-500/15 text-[#EF4444] px-4 py-1.5 rounded-full">
          {stats.attention} need attention
        </span>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="all">All sections</option>
            {Array.from(new Set(students.map((s) => s.section).filter(Boolean))).map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          {/* Sort order filter */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-[13px] bg-[#090B14] border border-white/[0.08] rounded-[8px] py-2 px-3 text-[#94A3B8] font-satoshi font-medium focus:border-accent-blue/50 outline-none select-none cursor-pointer"
            data-interactive="true"
          >
            <option value="name">Name A–Z</option>
            <option value="grade-desc">Grade: High to Low</option>
            <option value="submissions-desc">Submissions: Most</option>
          </select>
        </div>

        {/* Search bar input */}
        <div className="relative w-full sm:w-64 flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student or roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090B14] border border-white/[0.08] rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-white font-satoshi placeholder-slate-600 focus:border-accent-blue/50 outline-none"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#090B14] border border-white/[0.05] rounded-[14px] overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B1120] border-b border-white/[0.05] text-[11px] font-bold uppercase tracking-wider text-[#475569] font-satoshi select-none">
              <th className="py-4 px-6">Student</th>
              <th className="py-4 px-5">Section</th>
              <th className="py-4 px-5">Submitted</th>
              <th className="py-4 px-5">Avg Grade</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-[13px] text-[#94A3B8] font-satoshi">
            {filteredStudents.map((st) => {
              // Grade average coloring
              let avgColor = 'text-red-400';
              if (st.avg >= 8) {
                avgColor = 'text-[#22C55E]';
              } else if (st.avg >= 6) {
                avgColor = 'text-[#F59E0B]';
              }

              return (
                <tr
                  key={st.id}
                  onClick={() => setActiveStudent(st)}
                  className="hover:bg-white/[0.015] transition-colors duration-150 cursor-pointer"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-blue/15 text-accent-blue text-[11px] font-bold flex items-center justify-center select-none flex-shrink-0">
                        {getInitials(st.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-white truncate max-w-xs">
                          {st.name}
                        </span>
                        <span className="text-[11px] text-[#475569] mt-0.5">
                          {st.rollNo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 select-none">
                    {st.section}
                  </td>
                  <td className="py-3.5 px-5 select-none">
                    {st.submissions.length} / 12 total
                  </td>
                  <td className={`py-3.5 px-5 font-bold ${avgColor}`}>
                    {st.avgLabel}
                  </td>
                  <td className="py-3.5 px-5 select-none">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${st.statusClass}`}>
                      {st.statusLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveStudent(st)}
                      className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                      title="View Report Card"
                      data-interactive="true"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Responsive Drawer Overlay (Student Detail drawer) */}
      <AnimatePresence>
        {activeStudent && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-out Panel Sheet */}
            <motion.div
              initial={{ x: '100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.95 }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-full sm:max-w-[360px] bg-[#090B14] border-l border-white/[0.08] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {/* Header profile details */}
              <div className="p-6 flex flex-col gap-4 relative select-none">
                {/* Close trigger */}
                <button
                  onClick={() => setActiveStudent(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  data-interactive="true"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div className="flex items-center gap-3.5 mt-2">
                  <div className="w-11 h-11 rounded-full bg-accent-blue/15 border border-accent-blue/30 text-accent-blue font-satoshi font-bold text-sm flex items-center justify-center">
                    {getInitials(activeStudent.name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-bold font-satoshi text-white truncate max-w-[200px]">
                      {activeStudent.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-satoshi mt-0.5">
                      {activeStudent.rollNo}
                    </span>
                  </div>
                </div>

                {/* College particulars */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-4 text-xs font-satoshi text-slate-400">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Section</span>
                    <span className="font-semibold text-slate-300">{activeStudent.section}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Semester</span>
                    <span className="font-semibold text-slate-300">4</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Glance</span>
                    <span className={`font-semibold ${activeStudent.statusClass.split(' ')[2]}`}>
                      {activeStudent.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable list content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-5 border-t border-white/[0.05] pt-5">
                {subjectBreakdown.map((subj) => (
                  <div key={subj.id} className="flex flex-col gap-3.5">
                    
                    {/* Subject info row */}
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-slate-300 font-satoshi leading-tight">
                        {subj.name}
                      </h4>
                      <div className="flex justify-between items-center text-[10.5px] text-[#475569] font-satoshi mt-1 select-none">
                        <span>Submitted</span>
                        <span>{subj.totalSubmitted} / {subj.total} Exps</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden select-none">
                      <div
                        className={`h-full rounded-full ${subj.barColor}`}
                        style={{ width: `${subj.progressPercent}%` }}
                      />
                    </div>

                    {/* Exps details sub-list */}
                    <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/[0.03] rounded-[8px] p-3 font-satoshi">
                      {subj.experiments.map((exp) => (
                        <div key={exp.expNo} className="flex justify-between items-center text-[11.5px] py-1 border-b border-white/[0.02] last:border-0 last:pb-0 first:pt-0">
                          <span className="text-slate-400">Exp {exp.expNo}</span>
                          <span className={exp.colorClass}>{exp.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

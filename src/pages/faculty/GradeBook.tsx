import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadCloud, Check, AlertTriangle, TrendingUp, Star, Users } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { subjects, StudentListItem } from '../../data/mockData';

export default function GradeBook() {
  const { students, pendingSubmissions, gradedSubmissions } = useDashboard();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Grade Book";
  }, []);

  const [activeTab, setActiveTab] = useState<'web' | 'dbms'>('web');
  const [showToast, setShowToast] = useState(false);

  // Helper to lookup cell data dynamically for a student and subject
  const getCellData = (studentId: string, subjectId: string, expNo: number) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return { status: 'none', grade: null };

    // 1. Check local pending submissions in context
    const pending = pendingSubmissions.find(
      (p) => p.studentId === studentId && p.subjectId === subjectId && p.expNo === expNo
    );
    if (pending) {
      return { status: 'pending', grade: null };
    }

    // 2. Check local graded submissions in context
    const graded = gradedSubmissions.find(
      (g) => {
        const isSubjectMatch =
          (subjectId === 'web' && g.subjectName.toLowerCase().includes('web')) ||
          (subjectId === 'dbms' && g.subjectName.toLowerCase().includes('db'));
        return g.rollNo === student.rollNo && isSubjectMatch && g.expNo === expNo;
      }
    );
    if (graded) {
      return { status: 'graded', grade: graded.grade };
    }

    // 3. Fallback to student profile seed grades (mockData initial values)
    // s1: web [9, null] (exp 3 is graded 9, wait, exp 3 is index 0 of web, and exp 4 is index 1 which is null/pending)
    // let's do a mock matching index mapping if needed:
    if (student.id === 's1' && subjectId === 'web' && expNo === 3) return { status: 'graded', grade: 9 };
    if (student.id === 's1' && subjectId === 'web' && expNo === 4) return { status: 'pending', grade: null };
    if (student.id === 's1' && subjectId === 'dbms' && expNo === 3) return { status: 'graded', grade: 7 };

    if (student.id === 's2' && subjectId === 'web' && expNo === 3) return { status: 'graded', grade: 8 };
    if (student.id === 's2' && subjectId === 'web' && expNo === 2) return { status: 'graded', grade: 7 };
    if (student.id === 's2' && subjectId === 'dbms' && expNo === 3) return { status: 'graded', grade: 6 };

    if (student.id === 's3' && subjectId === 'web' && expNo === 2) return { status: 'graded', grade: 6 };

    if (student.id === 's4' && subjectId === 'web' && expNo === 4) return { status: 'graded', grade: 10 };
    if (student.id === 's4' && subjectId === 'web' && expNo === 5) return { status: 'graded', grade: 9 };
    if (student.id === 's4' && subjectId === 'dbms' && expNo === 4) return { status: 'graded', grade: 8 };
    if (student.id === 's4' && subjectId === 'dbms' && expNo === 5) return { status: 'graded', grade: 9 };

    if (student.id === 's5' && subjectId === 'web' && expNo === 9) return { status: 'graded', grade: 7 }; // wait, expNo 1-6 only, let's keep it clean
    if (student.id === 's5' && subjectId === 'web' && expNo === 3) return { status: 'graded', grade: 7 };
    if (student.id === 's5' && subjectId === 'dbms' && expNo === 2) return { status: 'graded', grade: 5 };

    if (student.id === 's6' && subjectId === 'web' && expNo === 5) return { status: 'graded', grade: 9 };
    if (student.id === 's6' && subjectId === 'web' && expNo === 6) return { status: 'graded', grade: 8 };
    if (student.id === 's6' && subjectId === 'dbms' && expNo === 5) return { status: 'graded', grade: 7 };
    if (student.id === 's6' && subjectId === 'dbms' && expNo === 6) return { status: 'graded', grade: 8 };

    return { status: 'none', grade: null };
  };

  // Compute rows data
  const gridRows = useMemo(() => {
    return students.map((st) => {
      let sum = 0;
      let count = 0;
      const cells = Array.from({ length: 6 }, (_, i) => {
        const expNo = i + 1;
        const cell = getCellData(st.id, activeTab, expNo);
        if (cell.status === 'graded') {
          sum += cell.grade!;
          count++;
        }
        return { expNo, ...cell };
      });

      const avg = count > 0 ? sum / count : 0;
      const avgLabel = count > 0 ? avg.toFixed(1) : '—';

      return {
        id: st.id,
        name: st.name,
        rollNo: st.rollNo,
        cells,
        avg,
        avgLabel
      };
    });
  }, [students, activeTab, pendingSubmissions, gradedSubmissions]);

  // Compute summary metrics for bottom cards
  const classStats = useMemo(() => {
    let highestAvg = 0;
    let highestStudentName = '—';
    let totalSum = 0;
    let totalCount = 0;
    let attentionStudents = 0;

    gridRows.forEach((row) => {
      if (row.avg > highestAvg) {
        highestAvg = row.avg;
        highestStudentName = row.name;
      }
      if (row.avg > 0) {
        totalSum += row.avg;
        totalCount++;
      }
      if (row.avg === 0 || row.avg < 7.5) {
        attentionStudents++;
      }
    });

    const classAverage = totalCount > 0 ? (totalSum / totalCount).toFixed(1) : '—';

    return {
      highestStudentName,
      highestAvg: highestAvg > 0 ? highestAvg.toFixed(1) : '—',
      classAverage,
      attentionStudents
    };
  }, [gridRows]);

  // CSV generation logic
  const handleExportCSV = () => {
    let csv = "Student,Roll No,Exp 1,Exp 2,Exp 3,Exp 4,Exp 5,Exp 6,Average\n";
    gridRows.forEach((row) => {
      let line = `"${row.name}","${row.rollNo}"`;
      row.cells.forEach((cell) => {
        if (cell.status === 'graded') {
          line += `,${cell.grade}`;
        } else if (cell.status === 'pending') {
          line += `,"?"`;
        } else {
          line += `,"—"`;
        }
      });
      line += `,${row.avgLabel}\n`;
      csv += line;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `grades_${activeTab === 'web' ? 'WebTech' : 'DBMS'}_IT-B.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Toast alert trigger
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 relative">
      {/* Header and CSV export button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold font-satoshi text-white">
            Grade Book
          </h2>
          <p className="text-[13px] text-[#475569] font-satoshi">
            Summary of all evaluated submissions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="h-10 border border-white/10 hover:border-accent-blue/30 hover:bg-[#3B82F6]/[0.08] px-4 rounded-[10px] text-xs font-semibold font-satoshi text-slate-300 hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          data-interactive="true"
        >
          <DownloadCloud className="w-4 h-4 text-slate-400" />
          <span>Export grades</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="w-full max-w-sm">
        <div className="bg-[#0B1120]/80 border border-white/[0.06] rounded-[10px] p-1 flex relative overflow-hidden">
          {(['web', 'dbms'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-center text-xs font-semibold font-satoshi rounded-[8px] transition-colors relative z-10 select-none cursor-pointer ${
                activeTab === tab ? 'text-white' : 'text-[#64748B]'
              }`}
              data-interactive="true"
            >
              {tab === 'web' ? 'Web Technologies Lab' : 'DBMS Lab'}
              {activeTab === tab && (
                <motion.div
                  layoutId="gradeTabIndicator"
                  className="absolute inset-0 bg-[#3B82F6]/15 border border-[#3B82F6]/30 rounded-[8px] -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grade Book Grid Table */}
      <div className="bg-[#090B14] border border-white/[0.05] rounded-[14px] overflow-hidden shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#0B1120] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-[#475569] font-satoshi select-none">
              <th className="py-4 px-6 sticky left-0 bg-[#0B1120] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">Student</th>
              <th className="py-4 px-3 text-center">Exp 1</th>
              <th className="py-4 px-3 text-center">Exp 2</th>
              <th className="py-4 px-3 text-center">Exp 3</th>
              <th className="py-4 px-3 text-center">Exp 4</th>
              <th className="py-4 px-3 text-center">Exp 5</th>
              <th className="py-4 px-3 text-center">Exp 6</th>
              <th className="py-4 px-6 text-right">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-[13px] font-satoshi">
            {gridRows.map((row) => {
              // Row average coloring
              let avgColor = 'text-red-400';
              if (row.avg >= 8) {
                avgColor = 'text-[#22C55E]';
              } else if (row.avg >= 6) {
                avgColor = 'text-[#F59E0B]';
              }

              return (
                <tr key={row.id} className="hover:bg-white/[0.01]">
                  {/* Sticky student identifier */}
                  <td className="py-3.5 px-6 font-medium text-white sticky left-0 bg-[#090B14] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="truncate">{row.name}</span>
                      <span className="text-[10px] text-[#475569] mt-0.5">{row.rollNo}</span>
                    </div>
                  </td>
                  
                  {/* Experiment columns */}
                  {row.cells.map((cell) => {
                    let cellVal: string | number = '—';
                    let cellClass = 'text-slate-600';

                    if (cell.status === 'graded') {
                      cellVal = cell.grade!;
                      cellClass = 'text-[#22C55E] font-semibold';
                    } else if (cell.status === 'pending') {
                      cellVal = '?';
                      cellClass = 'text-[#F59E0B] font-bold';
                    }

                    return (
                      <td key={cell.expNo} className={`py-3.5 px-3 text-center ${cellClass} select-none`}>
                        {cellVal}
                      </td>
                    );
                  })}

                  {/* Row final average */}
                  <td className={`py-3.5 px-6 text-right font-extrabold text-[14px] ${avgColor}`}>
                    {row.avgLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Class Statistics below grid */}
      <div className="flex flex-col gap-3 select-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
          Class statistics summary
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel border border-white/[0.04] bg-[#090B14]/40 rounded-[12px] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[10px] bg-green-500/10 flex items-center justify-center text-[#22C55E]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-satoshi font-semibold">Highest Average</span>
              <span className="text-sm font-bold text-white font-satoshi mt-0.5">
                {classStats.highestStudentName}
              </span>
              <span className="text-[10px] text-[#475569] font-satoshi">
                Score average: {classStats.highestAvg}
              </span>
            </div>
          </div>

          <div className="glass-panel border border-white/[0.04] bg-[#090B14]/40 rounded-[12px] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
              <Star className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-satoshi font-semibold">Class Average</span>
              <span className="text-sm font-bold text-white font-satoshi mt-0.5">
                {classStats.classAverage} / 10
              </span>
              <span className="text-[10px] text-[#475569] font-satoshi">
                Across all graded labs
              </span>
            </div>
          </div>

          <div className="glass-panel border border-white/[0.04] bg-[#090B14]/40 rounded-[12px] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[10px] bg-red-500/10 flex items-center justify-center text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-satoshi font-semibold">Needs Attention</span>
              <span className="text-sm font-bold text-white font-satoshi mt-0.5">
                {classStats.attentionStudents} {classStats.attentionStudents === 1 ? 'student' : 'students'}
              </span>
              <span className="text-[10px] text-[#475569] font-satoshi">
                Average below 7.5 or ungraded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CSV Download Success Toast */}
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
              <span className="text-sm font-semibold text-white font-satoshi">Export Complete</span>
              <span className="text-xs text-[#94A3B8] font-satoshi leading-normal truncate max-w-[240px]">
                grades_{activeTab === 'web' ? 'WebTech' : 'DBMS'}_IT-B.csv downloaded
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

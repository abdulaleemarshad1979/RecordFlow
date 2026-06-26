import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  Download, 
  Users, 
  CheckSquare, 
  GraduationCap, 
  Settings, 
  Plus, 
  Calendar,
  Sparkles,
  ArrowRight,
  FileCheck2,
  ThumbsUp
} from 'lucide-react';
import Button from '../ui/Button';

// Types for interactive demo
interface Submission {
  id: string;
  expName: string;
  subject: string;
  faculty: string;
  status: 'Graded' | 'Pending' | 'Overdue';
  grade: number | null;
  date: string;
}

interface PendingEvaluation {
  id: string;
  studentName: string;
  rollNo: string;
  expName: string;
  subject: string;
  daysWaiting: number;
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<'student' | 'faculty'>('student');

  // Interactive Student State
  const [studentSubmissions, setStudentSubmissions] = useState<Submission[]>([
    { id: '1', expName: 'Exp 5: Socket Programming in C', subject: 'Computer Networks', faculty: 'Dr. Priya Sharma', status: 'Graded', grade: 9.5, date: '24 Jun 2026' },
    { id: '2', expName: 'Exp 6: Distance Vector Routing Simulation', subject: 'Computer Networks', faculty: 'Dr. Priya Sharma', status: 'Graded', grade: 9.0, date: '25 Jun 2026' },
    { id: '3', expName: 'Exp 7: DHCP Server Configuration', subject: 'Computer Networks', faculty: 'Dr. Priya Sharma', status: 'Pending', grade: null, date: '26 Jun 2026' },
  ]);

  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpSubject, setNewExpSubject] = useState('Computer Networks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive Faculty State
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([
    { id: 'p1', studentName: 'Ranya Reddy', rollNo: '22A31A0502', expName: 'Exp 6: Client-Server Chat app', subject: 'Web Technologies Lab', daysWaiting: 2 },
    { id: 'p2', studentName: 'Sai Teja', rollNo: '22A31A0512', expName: 'Exp 6: Client-Server Chat app', subject: 'Web Technologies Lab', daysWaiting: 3 },
    { id: 'p3', studentName: 'Vikram Rao', rollNo: '22A31A0541', expName: 'Exp 5: Flexbox Responsive Landing', subject: 'Web Technologies Lab', daysWaiting: 4 },
  ]);

  const [facultyStats, setFacultyStats] = useState({
    pending: 3,
    gradedThisWeek: 9,
    classAvg: 7.8,
  });

  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});

  // Handlers for Student View
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newSubmission: Submission = {
        id: Date.now().toString(),
        expName: newExpTitle,
        subject: newExpSubject,
        faculty: 'Dr. Priya Sharma',
        status: 'Pending',
        grade: null,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };

      setStudentSubmissions([newSubmission, ...studentSubmissions]);
      setNewExpTitle('');
      setIsSubmitting(false);
      
      // Also append to faculty queue to show dual-role sync
      const newPending: PendingEvaluation = {
        id: 'p-' + Date.now(),
        studentName: 'Abdul Aleem',
        rollNo: '22A31A0501',
        expName: newExpTitle,
        subject: newExpSubject + ' Lab',
        daysWaiting: 1,
      };
      setPendingEvaluations((prev) => [newPending, ...prev]);
      setFacultyStats((prev) => ({ ...prev, pending: prev.pending + 1 }));
    }, 800);
  };

  // Handlers for Faculty View
  const handleGradeChange = (id: string, val: string) => {
    setGradeInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmitGrade = (id: string, studentName: string, expName: string, subject: string) => {
    const rawGrade = gradeInputs[id];
    const numericGrade = parseFloat(rawGrade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 10) {
      alert('Please enter a valid grade between 0 and 10.');
      return;
    }

    // Process evaluation
    setPendingEvaluations((prev) => prev.filter((item) => item.id !== id));
    
    // Update faculty analytics
    setFacultyStats((prev) => {
      const newGraded = prev.gradedThisWeek + 1;
      const newAvg = parseFloat(((prev.classAvg * prev.gradedThisWeek + numericGrade) / newGraded).toFixed(1));
      return {
        pending: Math.max(0, prev.pending - 1),
        gradedThisWeek: newGraded,
        classAvg: newAvg,
      };
    });

    // If Abdul Aleem was the student, update his student log as well
    if (studentName === 'Abdul Aleem') {
      setStudentSubmissions((prev) =>
        prev.map((sub) =>
          sub.expName === expName ? { ...sub, status: 'Graded', grade: numericGrade } : sub
        )
      );
    }
  };

  return (
    <section
      id="faculty"
      className="py-24 md:py-32 bg-bg-secondary relative overflow-hidden px-6"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-accent-cyan/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-accent-blue/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 select-none">
          <div className="flex items-center pl-3 border-l-2 border-accent-blue mb-5 h-5">
            <span className="text-xs tracking-[2px] font-bold uppercase text-accent-blue font-satoshi">
              Live Interactive Demo
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] font-bold font-satoshi tracking-[-1.5px] text-white max-w-2xl mb-4">
            Experience the Lab Console.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-secondary font-medium font-satoshi max-w-lg leading-relaxed mb-8">
            Click between views to simulate submitting work as a student and grading as a faculty member.
          </p>

          {/* Toggle Switcher */}
          <div className="p-1.5 bg-bg-primary/80 border border-white/6 rounded-full flex items-center gap-1 shadow-lg max-w-[340px] w-full">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-bg-primary shadow-sm scale-100'
                  : 'text-text-secondary hover:text-white'
              }`}
              data-interactive="true"
            >
              Student Portal
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'faculty'
                  ? 'bg-white text-bg-primary shadow-sm scale-100'
                  : 'text-text-secondary hover:text-white'
              }`}
              data-interactive="true"
            >
              Faculty Evaluation
            </button>
          </div>
        </div>

        {/* Dashboard Mockup frame */}
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-white/6 bg-bg-primary/95 shadow-2xl overflow-hidden min-h-[580px] flex flex-col">
          {/* Browser controls bar */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/6 bg-bg-secondary select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="bg-bg-primary border border-white/4 px-6 py-1 rounded-full text-[11px] font-mono tracking-tight text-text-secondary w-2/3 md:w-1/3 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
              recordflow.in/{activeTab === 'student' ? 'student/dashboard' : 'faculty/evaluation'}
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold tracking-wider">
                <Sparkles className="w-3 h-3 text-accent-cyan" /> Interactive Simulation
              </span>
            </div>
          </div>

          {/* Dual layout container (Sidebar + Content) */}
          <div className="flex flex-1 flex-col md:flex-row">
            {/* Mock Sidebar (Desktop) */}
            <div className="w-full md:w-56 border-r border-white/6 bg-bg-secondary/40 p-4 flex flex-col justify-between select-none">
              <div className="flex flex-col gap-6">
                {/* User Card */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/2 border border-white/4">
                  <div className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {activeTab === 'student' ? 'AA' : 'PS'}
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-bold font-satoshi text-white">
                      {activeTab === 'student' ? 'Abdul Aleem' : 'Dr. Priya Sharma'}
                    </span>
                    <span className="block text-[10px] text-text-muted font-mono truncate">
                      {activeTab === 'student' ? '22A31A0501 · Sec A' : 'Professor · CSE'}
                    </span>
                  </div>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
                  {activeTab === 'student' ? (
                    <>
                      {[
                        { label: 'Overview', icon: LayoutDashboard, active: true },
                        { label: 'My Records', icon: FileText },
                        { label: 'Submit Work', icon: UploadCloud },
                        { label: 'Download PDF', icon: Download },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={i}
                            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-full text-left whitespace-nowrap ${
                              item.active 
                                ? 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue' 
                                : 'text-text-secondary hover:text-white hover:bg-white/2 border border-transparent'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {[
                        { label: 'Review Queue', icon: CheckSquare, active: true },
                        { label: 'My Students', icon: Users },
                        { label: 'Class Stats', icon: GraduationCap },
                        { label: 'Settings', icon: Settings },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={i}
                            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-full text-left whitespace-nowrap ${
                              item.active 
                                ? 'bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan' 
                                : 'text-text-secondary hover:text-white hover:bg-white/2 border border-transparent'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Institution badge */}
              <div className="hidden md:block pt-4 border-t border-white/4">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-text-muted">
                  Affiliated Board
                </span>
                <span className="block text-[11px] font-semibold text-text-secondary font-satoshi">
                  JNTU-AP Regulations
                </span>
              </div>
            </div>

            {/* Mock Main Content Area */}
            <div className="flex-1 p-5 md:p-6 bg-bg-primary/30 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {activeTab === 'student' ? (
                  /* ==================================== */
                  /*          STUDENT VIEW PANEL          */
                  /* ==================================== */
                  <motion.div
                    key="student-panel"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Welcome Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold font-satoshi text-white flex items-center gap-2">
                          Good morning, Abdul 👋
                        </h3>
                        <p className="text-xs text-text-secondary">
                          Aditya College of Engineering & Technology · Web Technologies Lab
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                        <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                        Semester 6 · Batch A
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {[
                        { label: 'Submissions', val: `${studentSubmissions.length} Submitted` },
                        { label: 'Evaluated', val: `${studentSubmissions.filter(s => s.status === 'Graded').length} Checked` },
                        { 
                          label: 'Cumulative GPA', 
                          val: (
                            studentSubmissions.filter(s => s.grade !== null).reduce((acc, curr) => acc + (curr.grade || 0), 0) / 
                            (studentSubmissions.filter(s => s.grade !== null).length || 1)
                          ).toFixed(2) + ' / 10' 
                        },
                      ].map((card, i) => (
                        <div key={i} className="bg-bg-tertiary border border-white/5 p-3 md:p-4 rounded-xl">
                          <span className="block text-[10px] uppercase font-bold text-text-muted font-satoshi mb-0.5">
                            {card.label}
                          </span>
                          <span className="block text-sm md:text-lg font-bold font-mono text-white">
                            {card.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Submit New Experiment Drawer Form */}
                    <div className="bg-bg-tertiary/60 border border-accent-blue/15 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold font-satoshi text-accent-blue mb-3">
                        <Plus className="w-4 h-4" />
                        Simulate Experiment Submission
                      </div>

                      <form onSubmit={handleStudentSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter experiment name (e.g. Exp 8: AJAX Dynamic Content Loading)"
                            value={newExpTitle}
                            onChange={(e) => setNewExpTitle(e.target.value)}
                            className="w-full bg-bg-primary/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors font-satoshi"
                          />
                        </div>
                        <div className="w-full sm:w-44">
                          <select
                            value={newExpSubject}
                            onChange={(e) => setNewExpSubject(e.target.value)}
                            className="w-full bg-bg-primary/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-accent-blue transition-colors font-satoshi"
                          >
                            <option value="Computer Networks">Computer Networks</option>
                            <option value="Web Technologies">Web Technologies</option>
                            <option value="Java Programming">Java Programming</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !newExpTitle}
                          className="px-5 py-2 text-xs font-bold text-white bg-accent-blue rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer font-satoshi"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Experiment'}
                        </button>
                      </form>
                    </div>

                    {/* Submissions Log Table */}
                    <div className="bg-bg-tertiary border border-white/5 rounded-xl overflow-hidden">
                      <div className="border-b border-white/6 px-4 py-3 bg-white/1 flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight text-white font-satoshi">
                          Student Journal Log
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono">
                          Auto-Sorted: Newest First
                        </span>
                      </div>

                      <div className="divide-y divide-white/4">
                        {studentSubmissions.map((sub) => (
                          <div key={sub.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs hover:bg-white/1 transition-colors">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-white font-satoshi">{sub.expName}</span>
                              <span className="text-[10px] text-text-secondary font-satoshi">
                                {sub.subject} · Evaluator: {sub.faculty}
                              </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className="text-[10px] text-text-muted font-mono">{sub.date}</span>
                              
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                                ${sub.status === 'Graded' 
                                  ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                                }`}
                              >
                                <span className={`w-1 h-1 rounded-full ${sub.status === 'Graded' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                {sub.status}
                              </span>

                              <div className="w-12 text-right font-bold font-mono text-white">
                                {sub.grade !== null ? `${sub.grade.toFixed(1)} / 10` : '—'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ==================================== */
                  /*          FACULTY VIEW PANEL          */
                  /* ==================================== */
                  <motion.div
                    key="faculty-panel"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Faculty Header */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold font-satoshi text-white">
                        Dr. Priya Sharma
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Department of Computer Science & Engineering · Web Technologies Lab
                      </p>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {[
                        { label: 'Pending Evaluation', val: `${pendingEvaluations.length} Student files`, color: 'text-accent-cyan' },
                        { label: 'Checked This Week', val: `${facultyStats.gradedThisWeek} Records` },
                        { label: 'Class Average', val: `${facultyStats.classAvg.toFixed(1)} / 10` },
                      ].map((card, i) => (
                        <div key={i} className="bg-bg-tertiary border border-white/5 p-3 md:p-4 rounded-xl">
                          <span className="block text-[10px] uppercase font-bold text-text-muted font-satoshi mb-0.5">
                            {card.label}
                          </span>
                          <span className={`block text-sm md:text-lg font-bold font-mono text-white ${card.color || ''}`}>
                            {card.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pending Evaluation Queue */}
                    <div className="bg-bg-tertiary border border-white/5 rounded-xl overflow-hidden">
                      <div className="border-b border-white/6 px-4 py-3 bg-white/1 flex items-center justify-between select-none">
                        <span className="text-xs font-bold tracking-tight text-white font-satoshi">
                          Pending Grading Queue
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-semibold">
                          JNTU Compliance Auto-Checks Ready
                        </span>
                      </div>

                      {pendingEvaluations.length === 0 ? (
                        <div className="p-8 text-center text-text-secondary">
                          <ThumbsUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-xs font-bold font-satoshi text-white">All caught up!</p>
                          <p className="text-[11px]">No student records are pending grading currently.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/4">
                          {pendingEvaluations.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:bg-white/1 transition-all">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white font-satoshi">{item.studentName}</span>
                                  <span className="text-[10px] font-mono text-text-muted">{item.rollNo}</span>
                                </div>
                                <span className="text-[11px] text-text-secondary font-satoshi font-medium">
                                  {item.expName} · <strong className="text-accent-cyan">{item.subject}</strong>
                                </span>
                                <span className="text-[10px] text-yellow-500 font-medium">
                                  Waiting for {item.daysWaiting} days
                                </span>
                              </div>

                              {/* Action Grade Entry Area */}
                              <div className="flex items-center gap-2.5">
                                <div className="w-32 flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="Marks /10"
                                    value={gradeInputs[item.id] || ''}
                                    onChange={(e) => handleGradeChange(item.id, e.target.value)}
                                    className="w-full bg-bg-primary border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent-cyan font-mono"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSubmitGrade(item.id, item.studentName, item.expName, item.subject.replace(' Lab', ''))}
                                  className="px-4 py-1.5 text-xs font-bold text-bg-primary bg-white rounded hover:bg-slate-200 transition-colors font-satoshi cursor-pointer select-none"
                                >
                                  Grade Record
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

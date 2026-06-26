import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Upload,
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  FileText,
  Download,
  AlertTriangle
} from 'lucide-react';
import { subjects } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import MetricCard from '../../components/dashboard/MetricCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submissions } = useDashboard();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Dashboard";
  }, []);

  // Compute metrics from submissions dynamically
  const metrics = useMemo(() => {
    const totalSubmitted = submissions.length;
    const graded = submissions.filter((s) => s.status === 'graded');
    const evaluatedCount = graded.length;
    const pendingCount = submissions.filter((s) => s.status === 'pending').length;

    const grades = graded.map((s) => s.grade).filter((g): g is number => g !== null);
    const avgGrade =
      grades.length > 0
        ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1)
        : '—';

    return {
      totalSubmitted,
      evaluatedCount,
      avgGrade,
      pendingCount
    };
  }, [submissions]);

  // Compute progress for each subject
  const subjectProgress = useMemo(() => {
    return subjects.map((subject) => {
      const submitted = submissions.filter((s) => s.subjectId === subject.id).length;
      const percentage = Math.round((submitted / subject.total) * 100);
      
      // Determine color
      let barColor = 'bg-[#EF4444]'; // Red if 0%
      if (percentage === 100) {
        barColor = 'bg-[#22C55E]'; // Green
      } else if (percentage > 50) {
        barColor = 'bg-[#3B82F6]'; // Blue
      } else if (percentage > 0) {
        barColor = 'bg-[#F59E0B]'; // Amber
      }

      return {
        ...subject,
        submitted,
        percentage,
        barColor
      };
    });
  }, [submissions]);

  // Sort and filter recent activity (last 4 submissions, descending date)
  const recentSubmissions = useMemo(() => {
    return [...submissions]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 4);
  }, [submissions]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold font-satoshi text-white">
            Good morning, {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
          </h2>
          <p className="text-[13px] text-[#475569] font-satoshi">
            Week 11 · Semester 4 · {user?.section || '—'} · AY {user?.academicYear || '2025–26'}
          </p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          showArrow
          onClick={() => navigate('/student/submit')}
          className="h-10.5 rounded-[10px] text-xs font-semibold self-start md:self-auto"
          data-interactive="true"
        >
          Submit record
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Submitted"
          value={metrics.totalSubmitted}
          subtext="Labs submitted this sem"
          icon={Upload}
          color="blue"
          index={0}
        />
        <MetricCard
          label="Evaluated"
          value={metrics.evaluatedCount}
          subtext="Graded by faculty"
          icon={CheckCircle}
          color="green"
          index={1}
        />
        <MetricCard
          label="Avg Grade"
          value={metrics.avgGrade}
          subtext="Out of 10 max points"
          icon={Star}
          color="amber"
          index={2}
        />
        <MetricCard
          label="Pending Review"
          value={metrics.pendingCount}
          subtext="Waiting for review"
          icon={Clock}
          color={metrics.pendingCount > 0 ? 'red' : 'green'}
          index={3}
        />
      </div>

      {/* Two column layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject progress */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
            Completion progress
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectProgress.map((subj, idx) => (
              <div
                key={subj.id}
                className="glass-panel rounded-[12px] p-5 flex flex-col justify-between h-[115px] border border-white/[0.04]"
                style={{
                  background: 'rgba(9, 11, 20, 0.7)',
                }}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate font-satoshi">
                    {subj.name}
                  </h3>
                  <span className="text-xs text-[#475569] font-satoshi">
                    {subj.faculty}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-baseline text-xs font-satoshi select-none">
                    <span className="text-[#64748B]">Progress</span>
                    <span className="font-semibold text-slate-300">
                      {subj.submitted} / {subj.total} Exps
                    </span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subj.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${subj.barColor}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent submissions */}
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
            Recent submissions
          </span>

          <div className="glass-panel border border-white/[0.04] rounded-[12px] p-5 flex flex-col divide-y divide-white/[0.05]">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate font-satoshi">
                    {sub.title}
                  </h4>
                  <span className="text-xs text-[#475569] font-satoshi truncate">
                    {subjects.find((s) => s.id === sub.subjectId)?.name.split(' ')[0] || sub.subjectId} · {sub.faculty.split(' ')[1] || sub.faculty} · {sub.submittedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <StatusBadge status={sub.status} />
                  {sub.status === 'graded' && (
                    <span className="text-xs font-bold text-[#22C55E] font-satoshi bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 select-none">
                      {sub.grade}/10
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
          Quick actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Submit New Record",
              title: "Upload Lab File",
              desc: "Assign record files to faculty",
              icon: Upload,
              path: "/student/submit"
            },
            {
              label: "View All Records",
              title: "My Submissions",
              desc: "Track feedback and grades",
              icon: FileText,
              path: "/student/records"
            },
            {
              label: "Download Semester PDF",
              title: "Export Record Book",
              desc: "Generate compiled evaluated PDF",
              icon: Download,
              path: "/student/download"
            }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => navigate(action.path)}
                className="border border-dashed border-[#3B82F6]/25 hover:border-solid hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/[0.04] bg-transparent rounded-[14px] p-5 flex items-center justify-between cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[10px] bg-accent-blue/10 flex items-center justify-center text-accent-blue flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-satoshi select-none">
                      {action.label}
                    </span>
                    <span className="text-base font-bold text-white font-satoshi mt-0.5">
                      {action.title}
                    </span>
                    <span className="text-[11px] text-[#475569] font-satoshi">
                      {action.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hover:text-white" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

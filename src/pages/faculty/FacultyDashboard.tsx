import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, BarChart2, Users, FileText, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { facultyProfile } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import MetricCard from '../../components/dashboard/MetricCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import Button from '../../components/ui/Button';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pendingSubmissions, gradedSubmissions, students } = useDashboard();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Faculty Dashboard";
  }, []);

  // Compute metrics
  const metrics = useMemo(() => {
    const pendingCount = pendingSubmissions.length;
    const gradedCount = gradedSubmissions.length;
    const studentCount = students.length;

    // Class average calculation
    let sum = 0;
    let count = 0;
    students.forEach((st) => {
      (Object.values(st.grades) as (number | null)[][]).forEach((gradesArr) => {
        gradesArr.forEach((g) => {
          if (g !== null) {
            sum += g;
            count++;
          }
        });
      });
    });

    const classAvg = count > 0 ? (sum / count).toFixed(1) : '0.0';

    return {
      pendingCount,
      gradedCount,
      classAvg,
      studentCount
    };
  }, [pendingSubmissions, gradedSubmissions, students]);

  // Compute student table details
  const topStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 4)
      .map((st) => {
        let studentSum = 0;
        let studentCount = 0;
        (Object.values(st.grades) as (number | null)[][]).forEach((gradesArr) => {
          gradesArr.forEach((g) => {
            if (g !== null) {
              studentSum += g;
              studentCount++;
            }
          });
        });

        const avg = studentCount > 0 ? studentSum / studentCount : 0;
        
        let status: 'on_track' | 'falling_behind' | 'at_risk' = 'on_track';
        let statusLabel = 'On track';
        let statusClass = 'bg-green-500/10 border-green-500/20 text-[#22C55E]';

        if (studentCount === 0 || avg < 5) {
          status = 'at_risk';
          statusLabel = 'At risk';
          statusClass = 'bg-red-500/10 border-red-500/20 text-[#EF4444]';
        } else if (avg < 7.5) {
          status = 'falling_behind';
          statusLabel = 'Falling behind';
          statusClass = 'bg-amber-500/10 border-amber-500/20 text-[#F59E0B]';
        }

        return {
          id: st.id,
          name: st.name,
          rollNo: st.rollNo,
          submitted: st.submissions.length,
          avg: studentCount > 0 ? avg.toFixed(1) : '—',
          statusLabel,
          statusClass
        };
      });
  }, [students]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold font-satoshi text-white">
            Good morning, {user?.name ? user.name.split(' ')[0] : 'Faculty'} 👋
          </h2>
          <p className="text-[13px] text-[#475569] font-satoshi">
            Web Technologies Lab · DBMS Lab · IT-B · AY 2025–26
          </p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          showArrow
          onClick={() => navigate('/faculty/review')}
          className="h-10.5 rounded-[10px] text-xs font-semibold self-start md:self-auto"
          data-interactive="true"
        >
          Review pending
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pending Review"
          value={metrics.pendingCount}
          subtext="Submissions waiting"
          icon={Clock}
          color="amber"
          index={0}
        />
        <MetricCard
          label="Graded This Week"
          value={metrics.gradedCount}
          subtext="Evaluated lab records"
          icon={CheckCircle}
          color="green"
          index={1}
        />
        <MetricCard
          label="Class Avg Grade"
          value={metrics.classAvg}
          subtext="Mean marks out of 10"
          icon={BarChart2}
          color="blue"
          index={2}
        />
        <MetricCard
          label="Students Total"
          value={metrics.studentCount}
          subtext="Enrolled in IT-B section"
          icon={Users}
          color="blue"
          index={3}
        />
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Needs Review List + Class Glance */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Pending Submissions Quick List */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
              Needs your review
            </span>

            {pendingSubmissions.length === 0 ? (
              <div className="glass-panel border border-white/[0.04] bg-[#090B14]/40 p-6 rounded-[12px] text-center text-xs text-[#475569] font-satoshi select-none">
                All clear! No pending submissions to evaluate.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingSubmissions.slice(0, 3).map((sub) => {
                  const isOld = sub.daysAgo >= 5;
                  return (
                    <div
                      key={sub.id}
                      className="glass-panel border border-white/[0.04] bg-[#090B14]/70 rounded-[12px] p-4.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue flex-shrink-0">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-white font-satoshi truncate">
                              {sub.studentName}
                            </span>
                            <span className="text-[11px] text-[#475569] font-satoshi">
                              {sub.rollNo}
                            </span>
                          </div>
                          <span className="text-xs text-[#94A3B8] font-satoshi truncate max-w-sm mt-0.5">
                            {sub.title}
                          </span>
                          <span className="text-[11px] text-[#475569] font-satoshi mt-0.5">
                            {sub.subjectName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border select-none ${
                          isOld 
                            ? 'bg-amber-500/10 border-amber-500/20 text-[#F59E0B]' 
                            : 'bg-blue-500/10 border-blue-500/20 text-[#3B82F6]'
                        }`}>
                          {sub.daysAgo} {sub.daysAgo === 1 ? 'day' : 'days'} ago
                        </span>

                        <button
                          onClick={() => navigate('/faculty/review')}
                          className="text-xs text-[#3B82F6] hover:text-[#60A5FA] font-satoshi font-semibold flex items-center gap-0.5 cursor-pointer"
                          data-interactive="true"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {pendingSubmissions.length > 3 && (
                  <Link
                    to="/faculty/review"
                    className="text-xs font-semibold text-[#3B82F6] hover:underline self-start font-satoshi select-none ml-1"
                    data-interactive="true"
                  >
                    View all {pendingSubmissions.length} pending submissions →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Class at a Glance Table */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
              Class at a glance
            </span>

            <div className="bg-[#090B14] border border-white/[0.05] rounded-[14px] overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B1120] border-b border-white/[0.05] text-[11px] font-bold uppercase tracking-wider text-[#475569] font-satoshi select-none">
                    <th className="py-3.5 px-5">Student</th>
                    <th className="py-3.5 px-5">Roll No.</th>
                    <th className="py-3.5 px-5">Submitted</th>
                    <th className="py-3.5 px-5">Avg Grade</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px] text-[#94A3B8] font-satoshi">
                  {topStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-5 font-medium text-white">{st.name}</td>
                      <td className="py-3 px-5 text-slate-400">{st.rollNo}</td>
                      <td className="py-3 px-5">{st.submitted} / 12 Exps</td>
                      <td className="py-3 px-5 font-bold text-white">{st.avg}</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${st.statusClass}`}>
                          {st.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3.5 bg-[#0B1120]/20 border-t border-white/[0.04] select-none">
                <Link
                  to="/faculty/students"
                  className="text-xs font-semibold text-[#3B82F6] hover:underline font-satoshi"
                  data-interactive="true"
                >
                  View all students →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Evaluations Activity feed */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
            Recent evaluations
          </span>

          <div className="glass-panel border border-white/[0.04] rounded-[12px] p-5 flex flex-col divide-y divide-white/[0.05]">
            {gradedSubmissions.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#475569] font-satoshi select-none">
                No evaluations graded yet.
              </div>
            ) : (
              gradedSubmissions.slice(0, 3).map((sub) => (
                <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white font-satoshi truncate">
                        {sub.studentName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-satoshi truncate mt-0.5">
                        {sub.title}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#22C55E] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-satoshi flex-shrink-0 select-none">
                      {sub.grade}/10
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10.5px] text-[#475569] font-satoshi select-none">
                    <span>{sub.subjectName}</span>
                    <span>Graded on {sub.gradedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

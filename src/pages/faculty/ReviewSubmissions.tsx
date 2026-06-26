import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import ReviewCard from '../../components/dashboard/ReviewCard';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { PendingSubmission, GradedSubmission } from '../../data/mockData';

export default function ReviewSubmissions() {
  const { refreshData, gradeSubmission, subjects } = useDashboard();
  const { user, isLoading: authLoading } = useAuth();
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [gradedSubmissions, setGradedSubmissions] = useState<GradedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        // Verify this user is actually faculty
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', user.id)
          .single();

        if (profileError || profile?.role !== 'faculty') {
          setError('Access denied');
          return;
        }

        // Fetch submissions
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            subjects ( name ),
            profiles!student_id (
              name,
              roll_no,
              section
            )
          `)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const pending: PendingSubmission[] = (data || [])
          .filter((s: any) => s.status === 'pending' && s.faculty?.trim().toLowerCase() === user.name?.trim().toLowerCase())
          .map((s: any) => {
            const studentProfile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
            const subject = Array.isArray(s.subjects) ? s.subjects[0] : s.subjects;
            const matchedSubject = subjects.find(sub => sub.id === s.subject_id);
            return {
              id: s.id,
              studentId: s.student_id,
              studentName: studentProfile?.name || 'Unknown Student',
              rollNo: studentProfile?.roll_no || '—',
              subjectId: s.subject_id,
              subjectName: subject?.name || matchedSubject?.name || s.subject_id,
              expNo: s.exp_no,
              title: s.title,
              submittedAt: s.submitted_at,
              daysAgo: Math.max(1, Math.round((Date.now() - new Date(s.submitted_at).getTime()) / (1000 * 60 * 60 * 24))),
              fileName: s.file_name,
              fileSize: s.file_size,
              notes: s.notes
            };
          });

        const graded: GradedSubmission[] = (data || [])
          .filter((s: any) => s.status === 'graded' && s.faculty?.trim().toLowerCase() === user.name?.trim().toLowerCase())
          .map((s: any) => {
            const studentProfile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
            const subject = Array.isArray(s.subjects) ? s.subjects[0] : s.subjects;
            const matchedSubject = subjects.find(sub => sub.id === s.subject_id);
            return {
              id: s.id,
              studentName: studentProfile?.name || 'Unknown Student',
              rollNo: studentProfile?.roll_no || '—',
              subjectName: subject?.name || matchedSubject?.name || s.subject_id,
              expNo: s.exp_no,
              title: s.title,
              grade: Number(s.grade),
              remarks: s.remarks || '',
              gradedAt: s.submitted_at
            };
          });

        setPendingSubmissions(pending);
        setGradedSubmissions(graded);
      } else {
        // LocalStorage fallback
        const localUsers = JSON.parse(localStorage.getItem('rf_users') || '[]');
        const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
        const studentProfiles = localUsers.filter((u: any) => u.role === 'student');

        const pending = localSubs
          .filter((s: any) => s.status === 'pending' && s.faculty?.trim().toLowerCase() === user.name?.trim().toLowerCase())
          .map((s: any) => {
            const student = studentProfiles.find((u) => u.id === s.studentId);
            const matchedSubject = subjects.find(sub => sub.id === s.subjectId);
            return {
              id: s.id,
              studentId: s.studentId,
              studentName: student?.name || 'Unknown Student',
              rollNo: student?.rollNo || '—',
              subjectId: s.subjectId,
              subjectName: matchedSubject?.name || s.subjectId,
              expNo: s.expNo,
              title: s.title,
              submittedAt: s.submittedAt,
              daysAgo: Math.max(1, Math.round((Date.now() - new Date(s.submittedAt).getTime()) / (1000 * 60 * 60 * 24))),
              fileName: s.fileName || 'document.pdf',
              fileSize: s.fileSize || '1.0 MB',
              notes: s.notes
            };
          });

        const graded = localSubs
          .filter((s: any) => s.status === 'graded' && s.faculty?.trim().toLowerCase() === user.name?.trim().toLowerCase())
          .map((s: any) => {
            const student = studentProfiles.find((u) => u.id === s.studentId);
            const matchedSubject = subjects.find(sub => sub.id === s.subjectId);
            return {
              id: s.id,
              studentName: student?.name || 'Unknown Student',
              rollNo: student?.rollNo || '—',
              subjectName: matchedSubject?.name || s.subjectId,
              expNo: s.expNo,
              title: s.title,
              grade: Number(s.grade),
              remarks: s.remarks || '',
              gradedAt: s.submittedAt
            };
          });

        setPendingSubmissions(pending);
        setGradedSubmissions(graded);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "RecordFlow — Review Submissions";
    if (!authLoading) {
      fetchSubmissions();
    }
  }, [user, authLoading]);

  const handleGrade = async (submissionId: string, grade: number, remarks: string) => {
    try {
      const result = await gradeSubmission(submissionId, grade, remarks);
      if (!result.success) throw new Error(result.error);

      // Refresh local page data
      await fetchSubmissions();
    } catch (err: any) {
      alert(`Error grading submission: ${err.message}`);
    }
  };

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

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-red-400 text-sm text-center py-8 font-satoshi">{error}</div>
  );

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
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
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
                  onGradeSubmit={handleGrade}
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

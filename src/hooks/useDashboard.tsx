import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';
import {
  Submission,
  StudentListItem,
  PendingSubmission,
  GradedSubmission,
  Subject,
  subjects as mockSubjects
} from '../data/mockData';

const normalizeName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/^(prof\.|dr\.|mr\.|mrs\.|ms\.)\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

interface DashboardContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  clearNotifications: () => void;
  
  // Dynamic Database State Tunnels
  submissions: Submission[];
  pendingSubmissions: PendingSubmission[];
  gradedSubmissions: GradedSubmission[];
  students: StudentListItem[];
  subjects: Subject[];
  gradedTodayCount: number;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Database Operations
  submitRecord: (subjectId: string, expNo: number, title: string, notes: string, fileName: string, fileSize: string, facultyName?: string) => Promise<{ success: boolean; error?: string }>;
  gradeSubmission: (id: string, grade: number, remarks: string) => Promise<{ success: boolean; error?: string }>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Submissions lists
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [gradedSubmissions, setGradedSubmissions] = useState<GradedSubmission[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradedTodayCount, setGradedTodayCount] = useState(0);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const clearNotifications = () => setNotificationCount(0);

  // Helper mapper from Supabase naming to TS objects
  const mapSubmission = (db: any): Submission => ({
    id: db.id,
    subjectId: db.subject_id,
    expNo: db.exp_no,
    title: db.title,
    faculty: db.faculty,
    submittedAt: db.submitted_at,
    status: db.status,
    grade: db.grade,
    remarks: db.remarks,
    file_name: db.file_name,
    file_size: db.file_size,
    notes: db.notes
  });

  // Pull data dynamically based on user role
  const refreshData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch subjects first
      let currentSubjects = mockSubjects;
      if (isSupabaseConfigured) {
        const { data: subjectsData, error: subjErr } = await supabase
          .from('subjects')
          .select('*');
        if (subjectsData && !subjErr) {
          setSubjects(subjectsData);
          currentSubjects = subjectsData;
        } else {
          setSubjects(mockSubjects);
        }
      } else {
        setSubjects(mockSubjects);
      }

      if (user.role === 'student') {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('student_id', user.id);
          
          if (data && !error) {
            setSubmissions(data.map(mapSubmission));
          }
        } else {
          // LocalStorage
          const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
          const filtered = localSubs.filter((s: any) => s.studentId === user.id);
          setSubmissions(filtered);
        }
      } else {
        // Faculty portal fetches
        if (isSupabaseConfigured) {
          // 1. Fetch profiles of all students
          const { data: studentsData, error: sErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student');

          // 2. Fetch submissions
          const { data: subsData, error: subErr } = await supabase
            .from('submissions')
            .select('*');

            // Filter student profiles by teacher's section
            const filteredStudentsData = (studentsData || []).filter(st => {
              if (!st.section || !user.section) return false;
              return st.section.toLowerCase().trim() === user.section.toLowerCase().trim();
            });

            // Compile students average lists
            const list: StudentListItem[] = filteredStudentsData.map((st) => {
              const studentSubs = subsData.filter((s) => s.student_id === st.id);
              const grades: { [subjectId: string]: (number | null)[] } = {};
              currentSubjects.forEach((subj) => {
                grades[subj.id] = studentSubs
                  .filter((s) => s.subject_id === subj.id)
                  .map((s) => s.status === 'graded' ? Number(s.grade) : null);
              });

              return {
                id: st.id,
                name: st.name,
                rollNo: st.roll_no || '—',
                section: st.section,
                submissions: studentSubs.map((s) => s.id),
                grades
              };
            });
            setStudents(list);

            // Pending submissions list
            const pending: PendingSubmission[] = subsData
              .filter((s) => s.status === 'pending' && normalizeName(s.faculty) === normalizeName(user.name))
              .map((s) => {
                const matchedStudent = filteredStudentsData.find((st) => st.id === s.student_id);
                const matchedSubject = currentSubjects.find((sub) => sub.id === s.subject_id);
                return {
                  id: s.id,
                  studentId: s.student_id,
                  studentName: matchedStudent?.name || 'Unknown Student',
                  rollNo: matchedStudent?.roll_no || '—',
                  subjectId: s.subject_id,
                  subjectName: matchedSubject?.name || s.subject_id,
                  expNo: s.exp_no,
                  title: s.title,
                  submittedAt: s.submitted_at,
                  daysAgo: Math.max(1, Math.round((Date.now() - new Date(s.submitted_at).getTime()) / (1000 * 60 * 60 * 24))),
                  fileName: s.file_name,
                  fileSize: s.file_size,
                  notes: s.notes
                };
              });
            setPendingSubmissions(pending);

            // Graded submissions list
            const graded: GradedSubmission[] = subsData
              .filter((s) => s.status === 'graded' && normalizeName(s.faculty) === normalizeName(user.name))
              .map((s) => {
                const matchedStudent = filteredStudentsData.find((st) => st.id === s.student_id);
                const matchedSubject = currentSubjects.find((sub) => sub.id === s.subject_id);
                return {
                  id: s.id,
                  studentName: matchedStudent?.name || 'Unknown Student',
                  rollNo: matchedStudent?.roll_no || '—',
                  subjectName: matchedSubject?.name || s.subject_id,
                  subjectId: s.subject_id,
                  expNo: s.exp_no,
                  title: s.title,
                  grade: Number(s.grade),
                  remarks: s.remarks || '',
                  gradedAt: s.submitted_at
                };
              });
            setGradedSubmissions(graded);
        } else {
          // LocalStorage sim loading
          // LocalStorage sim loading
          const localUsers = JSON.parse(localStorage.getItem('rf_users') || '[]');
          const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
          // Filter student profiles by teacher's section
          const studentProfiles = localUsers
            .filter((u: any) => u.role === 'student')
            .filter((st: any) => {
              if (!st.section || !user.section) return false;
              return st.section.toLowerCase().trim() === user.section.toLowerCase().trim();
            });

          const list: StudentListItem[] = studentProfiles.map((st: any) => {
            const studentSubs = localSubs.filter((s: any) => s.studentId === st.id);
            const grades: { [subjectId: string]: (number | null)[] } = {};
            currentSubjects.forEach((subj) => {
              grades[subj.id] = studentSubs
                .filter((s: any) => s.subjectId === subj.id)
                .map((s: any) => s.status === 'graded' ? s.grade : null);
            });
            return {
              id: st.id,
              name: st.name,
              rollNo: st.rollNo || '—',
              section: st.section,
              submissions: studentSubs.map((s: any) => s.id),
              grades
            };
          });
          setStudents(list);

          const pending = localSubs
            .filter((s: any) => s.status === 'pending' && normalizeName(s.faculty) === normalizeName(user.name))
            .map((s: any) => {
              const student = studentProfiles.find((u) => u.id === s.studentId);
              const matchedSubject = currentSubjects.find((sub) => sub.id === s.subjectId);
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
          setPendingSubmissions(pending);

          const graded = localSubs
            .filter((s: any) => s.status === 'graded' && normalizeName(s.faculty) === normalizeName(user.name))
            .map((s: any) => {
              const student = studentProfiles.find((u) => u.id === s.studentId);
              const matchedSubject = currentSubjects.find((sub) => sub.id === s.subjectId);
              return {
                id: s.id,
                studentName: student?.name || 'Unknown Student',
                rollNo: student?.rollNo || '—',
                subjectName: matchedSubject?.name || s.subjectId,
                subjectId: s.subjectId,
                expNo: s.expNo,
                title: s.title,
                grade: s.grade,
                remarks: s.remarks || '',
                gradedAt: s.submittedAt
              };
            });
          setGradedSubmissions(graded);
        }
      }
    } catch (e) {
      // Silent error
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch data whenever user session mounts
  useEffect(() => {
    if (user) {
      refreshData();
      
      // Calculate notification triggers count
      if (user.role === 'student') {
        setNotificationCount(0); // Clear on load
      } else {
        // Faculty: show pending submissions count as notification count
        if (isSupabaseConfigured) {
          supabase
            .from('submissions')
            .select('id', { count: 'exact' })
            .eq('status', 'pending')
            .then(({ count }) => {
              if (count !== null) setNotificationCount(count);
            });
        } else {
          const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
          const pendCount = localSubs.filter((s: any) => s.status === 'pending').length;
          setNotificationCount(pendCount);
        }
      }
    } else {
      setSubmissions([]);
      setPendingSubmissions([]);
      setGradedSubmissions([]);
      setStudents([]);
      setNotificationCount(0);
    }
  }, [user]);

  // Insert submission from Student Submission Portal
  const submitRecord = async (
    subjectId: string,
    expNo: number,
    title: string,
    notes: string,
    fileName: string,
    fileSize: string,
    facultyName?: string
  ) => {
    if (!user) return { success: false, error: "Authentication required." };
    
    // Faculty assignments map
    const facultyMap: { [key: string]: string } = {
      ds: "Prof. Ravi Kumar",
      web: "Dr. Priya Sharma",
      os: "Prof. Ravi Kumar",
      dbms: "Dr. Anita Rao"
    };

    const assignedFaculty = facultyName || facultyMap[subjectId] || "Academic Board";
    const today = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('submissions').insert({
          student_id: user.id,
          subject_id: subjectId,
          exp_no: expNo,
          title,
          faculty: assignedFaculty,
          status: 'pending',
          file_name: fileName,
          file_size: fileSize,
          notes: notes || null
        });

        if (error) return { success: false, error: error.message };
        await refreshData();
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || "An unexpected error occurred." };
      }
    } else {
      // LocalStorage Sim
      const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
      const newSub = {
        id: `sub-${Date.now()}`,
        studentId: user.id,
        subjectId,
        expNo,
        title,
        faculty: assignedFaculty,
        submittedAt: today,
        status: 'pending',
        grade: null,
        remarks: null,
        fileName,
        fileSize,
        notes: notes || null
      };

      localSubs.push(newSub);
      localStorage.setItem('rf_submissions', JSON.stringify(localSubs));
      await refreshData();
      return { success: true };
    }
  };

  // Grade pending submission from Faculty Portal
  const gradeSubmission = async (id: string, grade: number, remarks: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('submissions')
          .update({
            status: 'graded',
            grade,
            remarks: remarks || null
          })
          .eq('id', id);

        if (error) return { success: false, error: error.message };
        
        setGradedTodayCount(prev => prev + 1);
        await refreshData();
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || "An unexpected error occurred." };
      }
    } else {
      // LocalStorage Sim
      const localSubs = JSON.parse(localStorage.getItem('rf_submissions') || '[]');
      const updated = localSubs.map((s: any) => {
        if (s.id === id) {
          return {
            ...s,
            status: 'graded',
            grade,
            remarks: remarks || null
          };
        }
        return s;
      });

      localStorage.setItem('rf_submissions', JSON.stringify(updated));
      setGradedTodayCount(prev => prev + 1);
      await refreshData();
      return { success: true };
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        notificationCount,
        setNotificationCount,
        clearNotifications,
        submissions,
        pendingSubmissions,
        gradedSubmissions,
        students,
        subjects,
        gradedTodayCount,
        isLoading,
        refreshData,
        submitRecord,
        gradeSubmission
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

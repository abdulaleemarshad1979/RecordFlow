export interface StudentProfile {
  name: string;
  rollNo: string;
  section: string;
  semester: number;
  college: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string;
  faculty: string;
  total: number;
}

export interface Submission {
  id: number | string;
  subjectId: string;
  expNo: number;
  title: string;
  faculty: string;
  submittedAt: string;
  status: 'graded' | 'pending' | 'overdue';
  grade: number | null;
  remarks: string | null;
  file_name?: string;
  file_size?: string;
  notes?: string | null;
}

export interface FacultyProfile {
  name: string;
  employeeId: string;
  department: string;
  college: string;
  subjects: string[];
}

export interface StudentListItem {
  id: string;
  name: string;
  rollNo: string;
  section: string;
  submissions: number[];
  grades: {
    [subjectId: string]: (number | null)[];
  };
}

export interface PendingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectId: string;
  subjectName: string;
  expNo: number;
  title: string;
  submittedAt: string;
  daysAgo: number;
  fileName: string;
  fileSize: string;
  notes: string | null;
}

export interface GradedSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  subjectName: string;
  expNo: number;
  title: string;
  grade: number;
  remarks: string;
  gradedAt: string;
}

// Initial defaults (empty profile)
export const studentProfile: StudentProfile = {
  name: "",
  rollNo: "",
  section: "",
  semester: 4,
  college: "",
  academicYear: "2025–26"
};

// Initial default subjects (standard AP engineering college syllabus labs)
export const subjects: Subject[] = [
  { id: "ds",   name: "Data Structures Lab",  faculty: "Prof. Ravi Kumar",   total: 6 },
  { id: "web",  name: "Web Technologies Lab", faculty: "Dr. Priya Sharma",   total: 6 },
  { id: "os",   name: "OS Lab",               faculty: "Prof. Ravi Kumar",   total: 6 },
  { id: "dbms", name: "DBMS Lab",             faculty: "Dr. Anita Rao",      total: 6 }
];

export const facultyProfile: FacultyProfile = {
  name: "",
  employeeId: "",
  department: "",
  college: "",
  subjects: []
};

// Clear out all mock database tables
export const submissions: Submission[] = [];
export const allStudents: StudentListItem[] = [];
export const pendingSubmissions: PendingSubmission[] = [];
export const gradedSubmissions: GradedSubmission[] = [];

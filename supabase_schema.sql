CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('student', 'faculty')) NOT NULL,
  roll_no TEXT,
  employee_id TEXT,
  section TEXT NOT NULL,
  college TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2025–26',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 6
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Subjects are viewable by authenticated users" ON public.subjects;
CREATE POLICY "Subjects are viewable by authenticated users" ON public.subjects
  FOR SELECT USING (auth.role() = 'authenticated');

INSERT INTO public.subjects (id, name, faculty, total) VALUES
  ('ds', 'Data Structures Lab', 'Prof. Ravi Kumar', 6),
  ('web', 'Web Technologies Lab', 'Dr. Priya Sharma', 6),
  ('os', 'OS Lab', 'Prof. Ravi Kumar', 6),
  ('dbms', 'DBMS Lab', 'Dr. Anita Rao', 6)
ON CONFLICT (id) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) NOT NULL,
  exp_no INTEGER NOT NULL,
  title TEXT NOT NULL,
  faculty TEXT NOT NULL,
  submitted_at DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT CHECK (status IN ('graded', 'pending', 'overdue')) NOT NULL DEFAULT 'pending',
  grade NUMERIC(3,1) CHECK (grade >= 0.0 AND grade <= 10.0),
  remarks TEXT,
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own submissions" ON public.submissions;
CREATE POLICY "Students can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Faculty can view submissions assigned to their subjects" ON public.submissions;
CREATE POLICY "Faculty can view submissions assigned to their subjects" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'faculty'
    )
  );

DROP POLICY IF EXISTS "Students can insert their own submissions" ON public.submissions;
CREATE POLICY "Students can insert their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Faculty can update submissions (for grading)" ON public.submissions;
CREATE POLICY "Faculty can update submissions (for grading)" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'faculty'
    )
  );

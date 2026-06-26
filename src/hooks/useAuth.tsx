import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  rollNo?: string;
  employeeId?: string;
  section: string;
  college: string;
  academicYear: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string, expectedRole: 'student' | 'faculty') => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    role: 'student' | 'faculty',
    details: { name: string; rollNo?: string; employeeId?: string; college: string; section: string }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check for college email domains
export const isCollegeEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return domain.endsWith('.edu') || domain.endsWith('.edu.in') || domain.endsWith('.ac.in');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor Supabase auth state if configured, otherwise read local storage sessions
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      });

      // 2. Listen for auth updates
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // LocalStorage Auth Fallback
      const activeSession = localStorage.getItem('rf_session');
      if (activeSession) {
        try {
          setUser(JSON.parse(activeSession));
        } catch (e) {
          localStorage.removeItem('rf_session');
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Fetch profiles table record from Supabase
  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (data && !error) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          rollNo: data.roll_no,
          employeeId: data.employee_id,
          section: data.section,
          college: data.college,
          academicYear: data.academic_year
        });
      }
    } catch (e) {
      // Fail silently, keeps loading off
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In function
  const login = async (email: string, password: string, expectedRole: 'student' | 'faculty') => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          // Fetch profile and check role
          const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (pErr || !profile) {
            return { success: false, error: "Profile details not found." };
          }
          if (profile.role !== expectedRole) {
            await supabase.auth.signOut();
            return { success: false, error: `Unauthorized. Expected ${expectedRole} privileges.` };
          }
          return { success: true };
        }
        return { success: false, error: "Authentication failed." };
      } catch (e: any) {
        return { success: false, error: e.message || "An unexpected error occurred." };
      }
    } else {
      // LocalStorage Sim login
      const localUsers = JSON.parse(localStorage.getItem('rf_users') || '[]');
      const matched = localUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!matched) {
        return { success: false, error: "Invalid email credentials or password." };
      }
      if (matched.role !== expectedRole) {
        return { success: false, error: `Unauthorized. Expected ${expectedRole} privileges.` };
      }

      const profile: UserProfile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        rollNo: matched.rollNo,
        employeeId: matched.employeeId,
        section: matched.section,
        college: matched.college,
        academicYear: '2025–26'
      };

      localStorage.setItem('rf_session', JSON.stringify(profile));
      setUser(profile);
      return { success: true };
    }
  };

  // Sign Up function with Domain Restrictions
  const signup = async (
    email: string,
    password: string,
    role: 'student' | 'faculty',
    details: { name: string; rollNo?: string; employeeId?: string; college: string; section: string }
  ) => {
    // 1. Enforce College Email Restriction
    if (!isCollegeEmail(email)) {
      return {
        success: false,
        error: "Only college email addresses (.edu, .edu.in, .ac.in) are allowed to register."
      };
    }

    if (isSupabaseConfigured) {
      try {
        // Register in Supabase auth
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { success: false, error: error.message };
        
        if (data.user) {
          // Insert into profiles table
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name: details.name,
            email,
            role,
            roll_no: details.rollNo || null,
            employee_id: details.employeeId || null,
            section: details.section,
            college: details.college,
            academic_year: '2025–26'
          });

          if (profileError) {
            return { success: false, error: `Auth registered, but profile table failed: ${profileError.message}` };
          }
          return { success: true };
        }
        return { success: false, error: "Sign up failed." };
      } catch (e: any) {
        return { success: false, error: e.message || "An unexpected error occurred." };
      }
    } else {
      // LocalStorage Sim signup
      const localUsers = JSON.parse(localStorage.getItem('rf_users') || '[]');
      if (localUsers.find((u: any) => u.email === email)) {
        return { success: false, error: "An account with this email already exists." };
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        password,
        role,
        ...details
      };

      localUsers.push(newUser);
      localStorage.setItem('rf_users', JSON.stringify(localUsers));
      return { success: true };
    }
  };

  // Sign Out function
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('rf_session');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Hash, BadgeCheck, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import CustomCursor from '../../components/effects/CustomCursor';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { useAuth, isCollegeEmail } from '../../hooks/useAuth';

// Sample AP engineering colleges
const COLLEGES = [
  "Aditya College of Engineering & Technology (ACET)",
  "Aditya Engineering College (AEC)",
  "Aditya College of Engineering (ACOE)",
  "JNTU Kakinada (JNTUK)",
  "Andhra University (AU)"
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, user, isLoading: authLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/faculty/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Create Account";
  }, []);

  const [role, setRole] = useState<'student' | 'faculty'>('student');
  
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState(COLLEGES[0]);
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Student specific
  const [rollNo, setRollNo] = useState('');

  // Faculty specific
  const [employeeId, setEmployeeId] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength logic
  const [passwordStrength, setPasswordStrength] = useState(0);
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setPasswordStrength(score);
  }, [password]);

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1: return { text: "Weak", color: "text-red-400", barColor: "bg-red-500" };
      case 2: return { text: "Fair", color: "text-orange-400", barColor: "bg-orange-500" };
      case 3: return { text: "Good", color: "text-yellow-400", barColor: "bg-yellow-500" };
      case 4: return { text: "Strong", color: "text-green-400", barColor: "bg-green-500" };
      default: return { text: "Weak", color: "text-red-400", barColor: "bg-red-500" };
    }
  };

  const validateForm = () => {
    if (!name || !email || !password || !branch || !section) {
      setError("Please fill out all required fields.");
      return false;
    }
    if (role === 'student' && !rollNo) {
      setError("Roll number is required.");
      return false;
    }
    if (role === 'faculty' && !employeeId) {
      setError("Employee ID is required.");
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!isCollegeEmail(email)) {
      setError("Only college email addresses (.edu, .edu.in, .ac.in) are allowed.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (role === 'student' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const details = {
      name,
      rollNo: role === 'student' ? rollNo : undefined,
      employeeId: role === 'faculty' ? employeeId : undefined,
      college,
      section: `${branch.toUpperCase().trim()}-${section.toUpperCase().trim()}`
    };

    const res = await signup(email, password, role, details);
    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      // Delay redirect to show success checkmark animation
      setTimeout(() => {
        navigate('/login', {
          state: {
            showSuccessToast: true,
            toastMessage: "Account created! Please sign in."
          }
        });
      }, 1500);
    } else {
      setError(res.error || "Sign up failed.");
    }
  };

  return (
    <>
      <CustomCursor />
      
      <div className="min-h-screen bg-[#050816] flex text-[#F8FAFC] font-sans selection:bg-accent-blue/30 overflow-y-auto lg:overflow-hidden relative">
        {/* Left Panel (Desktop only) */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:flex lg:w-[45%] bg-gradient-to-b from-[#090B14] to-[#050816] border-r border-white/[0.04] p-16 flex-col justify-between relative"
        >
          {/* Logo */}
          <div className="absolute top-12 left-12 flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span className="font-bold text-xl tracking-tight font-satoshi text-white">
              RecordFlow
            </span>
          </div>

          {/* Center Content: Step List */}
          <div className="my-auto flex flex-col gap-10 mt-32 max-w-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-[#3B82F6] tracking-[2px] uppercase font-satoshi">
                Free for all students
              </span>
              <h1 className="text-5xl font-bold font-satoshi text-white tracking-tight leading-none">
                Start your digital
                <br />
                <span className="text-[#94A3B8]">record today.</span>
              </h1>
            </div>

            {/* Steps Container */}
            <div className="relative pl-6 flex flex-col gap-8">
              {/* Vertical Dashed Line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-[1px] border-l border-dashed border-white/10" />

              {[
                { num: "01", title: "Create your account", body: "Sign up as a student or faculty member in minutes." },
                { num: "02", title: "Join your college and section", body: "Select your engineering college and input class section details." },
                { num: "03", title: "Start submitting lab records", body: "Upload experiment PDFs and track evaluation records in real time." }
              ].map((step, idx) => (
                <div key={idx} className="relative flex gap-4">
                  {/* Step bullet */}
                  <span className="absolute -left-[24px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#3B82F6] ring-4 ring-[#050816]" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#3B82F6] font-satoshi">{step.num}</span>
                      <h4 className="text-sm font-semibold text-white font-satoshi">{step.title}</h4>
                    </div>
                    <p className="text-[13px] text-[#475569] leading-relaxed font-satoshi max-w-[280px]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Muted footer reference */}
          <div className="text-xs text-[#334155] font-satoshi mt-auto select-none">
            © 2026 RecordFlow. Standard Academic Platform.
          </div>
        </motion.div>

        {/* Right Panel (Form / Success State) */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative lg:overflow-y-auto lg:max-h-screen">
          {/* Subtle Glows */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

          {/* Success Checkmark Screen */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-[420px] flex flex-col items-center text-center p-8 bg-[#090B14]/80 border border-white/[0.06] rounded-[20px] backdrop-blur-xl relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ delay: 0.15, duration: 0.4, type: 'spring' }}
                  className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
                </motion.div>
                <h3 className="text-2xl font-bold font-satoshi text-white mb-2">
                  Record submitted!
                </h3>
                <p className="text-[14px] text-[#64748B] font-satoshi mb-6">
                  {role === 'student' ? 'College and profile registered successfully.' : 'Faculty evaluation dashboard configured.'}
                  <br />
                  Please wait while we redirect you...
                </p>
              </motion.div>
            ) : (
              /* Actual Signup Form */
              <div className="w-full max-w-[420px] relative z-10 py-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.06
                      }
                    }
                  }}
                  className="lg:bg-transparent bg-gradient-to-b from-[#090B14]/80 to-[#050816]/90 border border-white/[0.06] lg:border-none p-8 lg:p-0 rounded-[20px] backdrop-blur-xl lg:backdrop-blur-none"
                >
                  {/* Header */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    className="flex flex-col mb-6"
                  >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-4 select-none">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      <span className="font-bold text-lg tracking-tight font-satoshi text-white">
                        RecordFlow
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold font-satoshi tracking-tight text-white">
                      Create your account
                    </h2>
                    <p className="text-[14px] text-[#64748B] mt-1 font-satoshi leading-normal">
                      Join thousands of students managing lab records digitally.
                    </p>
                  </motion.div>

                  {/* Role Selector */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    className="mb-6"
                  >
                    <div className="bg-[#0B1120]/80 border border-white/[0.06] rounded-[10px] p-1 flex relative overflow-hidden">
                      {(['student', 'faculty'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setRole(r);
                            setError(null);
                          }}
                          className={`flex-1 py-2 text-center text-sm font-medium font-satoshi rounded-[8px] transition-colors relative z-10 select-none cursor-pointer ${
                            role === r ? 'text-white' : 'text-[#64748B]'
                          }`}
                          data-interactive="true"
                        >
                          {r === 'student' ? 'Student' : 'Faculty'}
                          {role === r && (
                            <motion.div
                              layoutId="roleIndicator"
                              className="absolute inset-0 bg-[#3B82F6]/15 border border-[#3B82F6]/30 rounded-[8px] -z-10"
                              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Input form fields dynamically rendering based on role */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                      {role === 'student' ? (
                        <motion.div
                          key="student-fields"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-4"
                        >
                          <InputField
                            label="Full Name"
                            type="text"
                            placeholder="Abdul Aleem"
                            value={name}
                            onChange={setName}
                            icon={User}
                            required
                          />
                          <InputField
                            label="College Email"
                            type="email"
                            placeholder="your@college.edu"
                            value={email}
                            onChange={setEmail}
                            icon={Mail}
                            required
                          />
                          <InputField
                            label="Roll Number"
                            type="text"
                            placeholder="21A91A0501"
                            value={rollNo}
                            onChange={setRollNo}
                            icon={Hash}
                            required
                          />
                          <div className="flex flex-col gap-1.5 w-full">
                            <InputField
                              label="Password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={setPassword}
                              icon={Lock}
                              required
                            />
                            {/* Password strength indicator */}
                            {password.length > 0 && (
                              <div className="flex flex-col gap-1.5 mt-1">
                                <div className="flex gap-1.5 h-1">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 rounded-full bg-white/5 overflow-hidden"
                                    >
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: i < passwordStrength ? "100%" : "0%"
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`h-full ${getStrengthLabel().barColor}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <span className={`text-[11px] font-satoshi ${getStrengthLabel().color}`}>
                                  Password Strength: <strong className="font-semibold">{getStrengthLabel().text}</strong>
                                </span>
                              </div>
                            )}
                          </div>
                          <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            icon={Lock}
                            required
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="faculty-fields"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-4"
                        >
                          <InputField
                            label="Full Name"
                            type="text"
                            placeholder="Dr. Priya Sharma"
                            value={name}
                            onChange={setName}
                            icon={User}
                            required
                          />
                          <InputField
                            label="College Email"
                            type="email"
                            placeholder="your@college.edu"
                            value={email}
                            onChange={setEmail}
                            icon={Mail}
                            required
                          />
                          <InputField
                            label="Employee ID"
                            type="text"
                            placeholder="FAC-2024-001"
                            value={employeeId}
                            onChange={setEmployeeId}
                            icon={BadgeCheck}
                            required
                          />
                          <div className="flex flex-col gap-1.5 w-full">
                            <InputField
                              label="Password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={setPassword}
                              icon={Lock}
                              required
                            />
                            {/* Password strength indicator */}
                            {password.length > 0 && (
                              <div className="flex flex-col gap-1.5 mt-1">
                                <div className="flex gap-1.5 h-1">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 rounded-full bg-white/5 overflow-hidden"
                                    >
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: i < passwordStrength ? "100%" : "0%"
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`h-full ${getStrengthLabel().barColor}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <span className={`text-[11px] font-satoshi ${getStrengthLabel().color}`}>
                                  Password Strength: <strong className="font-semibold">{getStrengthLabel().text}</strong>
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* College & Section (Both roles) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                      }}
                      className="flex flex-col gap-4 mt-1"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                          College
                        </label>
                        <select
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full bg-[#0B1120]/80 text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all select-none cursor-pointer"
                          data-interactive="true"
                        >
                          {COLLEGES.map((c) => (
                            <option key={c} value={c} className="bg-[#050816]">
                              {c.split(" (")[1]?.replace(")", "") || c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                            Branch
                          </label>
                          <input
                            type="text"
                            placeholder="IT"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full bg-[#0B1120]/80 text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                            Section
                          </label>
                          <input
                            type="text"
                            placeholder="A"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="w-full bg-[#0B1120]/80 text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Terms Checkbox */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                      }}
                      className="flex items-start gap-2.5 mt-2"
                    >
                      <label className="relative flex items-center mt-0.5 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border border-white/10 rounded bg-[#0B1120]/80 peer-checked:bg-[#3B82F6] peer-checked:border-[#3B82F6] flex items-center justify-center transition-all">
                          <Check className="w-3 h-3 text-white stroke-[3px] scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </label>
                      <span className="text-[13px] text-[#64748B] font-satoshi leading-normal">
                        I agree to the{' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[#3B82F6] font-medium hover:underline" data-interactive="true">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[#3B82F6] font-medium hover:underline" data-interactive="true">
                          Privacy Policy
                        </a>
                      </span>
                    </motion.div>

                    {/* Error Banner */}
                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="bg-red-500/8 border border-red-500/20 rounded-[8px] p-3 flex items-center gap-2.5 text-red-400 text-sm font-satoshi"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                      }}
                      className="mt-3"
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                        className="w-full h-12 rounded-[10px] text-sm font-bold bg-[#3B82F6] hover:bg-[#60A5FA] select-none cursor-pointer flex items-center justify-center"
                        data-interactive="true"
                      >
                        {isLoading ? 'Creating account...' : 'Create account →'}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Footer links */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    className="text-center mt-6 text-sm font-satoshi"
                  >
                    <span className="text-[#64748B]">Already have an account? </span>
                    <Link
                      to="/login"
                      className="text-[#3B82F6] hover:underline font-medium"
                      data-interactive="true"
                    >
                      Sign in
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

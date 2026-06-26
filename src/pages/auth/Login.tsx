import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Check, Star, AlertCircle, Chrome, Github } from 'lucide-react';
import CustomCursor from '../../components/effects/CustomCursor';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Set document title and check for redirect toast
  useEffect(() => {
    document.title = "RecordFlow — Sign in";
    if (location.state?.showSuccessToast) {
      setToastMessage(location.state.toastMessage);
      // Clear location state
      navigate('/login', { replace: true, state: {} });
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple client-side validation
  const validateForm = () => {
    if (!email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(email, password, role);
    setIsLoading(false);

    if (result.success) {
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } else {
      setError(result.error || "Sign in failed.");
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

          {/* Center Brand Content */}
          <div className="my-auto flex flex-col gap-8 max-w-sm mt-32">
            <div className="flex flex-col gap-3">
              <span className="text-[12px] font-semibold text-[#3B82F6] tracking-[2px] uppercase font-satoshi">
                Trusted by 2,400+ students
              </span>
              <h1 className="text-5xl font-bold font-satoshi text-white tracking-tight leading-none">
                Your semester.
                <br />
                <span className="text-[#94A3B8]">Organized.</span>
              </h1>
            </div>

            <p className="text-[15px] leading-relaxed text-[#64748B] max-w-[340px] font-satoshi">
              Submit lab records, get faculty feedback, and download your semester PDF — all in one place.
            </p>

            <ul className="flex flex-col gap-3">
              {[
                "No more last-minute printing",
                "Faculty evaluates at their own pace",
                "Auto-generated semester record book"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-[#475569] font-satoshi">
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Review */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <p className="text-[14px] italic text-[#475569] leading-relaxed font-satoshi">
              "RecordFlow saved me 6 hours before my semester submission."
            </p>
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider font-satoshi">
              — Abdul Aleem, B.Tech IT, ACET
            </span>
          </div>
        </motion.div>

        {/* Right Panel (Form) */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative">
          {/* Decorative subtle glows in background */}
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

          {/* Container Card */}
          <div className="w-full max-w-[420px] relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08
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
                className="flex flex-col mb-8"
              >
                {/* Mobile Logo Only */}
                <div className="lg:hidden flex items-center gap-2 mb-6 select-none">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="font-bold text-lg tracking-tight font-satoshi text-white">
                    RecordFlow
                  </span>
                </div>
                <h2 className="text-3xl font-bold font-satoshi tracking-tight text-white">
                  Welcome back
                </h2>
                <p className="text-[15px] text-[#64748B] mt-1.5 font-satoshi">
                  Sign in to your RecordFlow account
                </p>
              </motion.div>

              {/* Role Selector */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="mb-8"
              >
                <div className="bg-[#0B1120]/80 border border-white/[0.06] rounded-[10px] p-1 flex relative overflow-hidden">
                  {(['student', 'faculty'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
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

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                >
                  <InputField
                    label="Email address"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                    required
                  />
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                  className="flex flex-col gap-2"
                >
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    icon={Lock}
                    required
                  />
                  <div className="flex justify-end mt-1">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-[#3B82F6] hover:underline font-satoshi font-medium"
                      data-interactive="true"
                    >
                      Forgot password?
                    </a>
                  </div>
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
                  className="mt-2"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    className="w-full h-12 rounded-[10px] text-sm font-bold bg-[#3B82F6] hover:bg-[#60A5FA] select-none cursor-pointer flex items-center justify-center"
                    data-interactive="true"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in →'}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="relative my-8 flex items-center justify-center"
              >
                <div className="absolute inset-x-0 h-px bg-white/[0.06]" />
                <span className="relative z-10 px-3 bg-[#050816] text-[13px] text-[#334155] font-satoshi select-none">
                  or continue with
                </span>
              </motion.div>

              {/* Social Login Row */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="grid grid-cols-2 gap-4"
              >
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 bg-[#0B1120]/60 border border-white/[0.08] hover:border-white/20 hover:bg-[#0B1120]/80 rounded-[10px] text-sm font-satoshi font-medium text-slate-300 transition-all select-none cursor-pointer"
                  data-interactive="true"
                >
                  <Chrome className="w-4 h-4 text-slate-400" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 bg-[#0B1120]/60 border border-white/[0.08] hover:border-white/20 hover:bg-[#0B1120]/80 rounded-[10px] text-sm font-satoshi font-medium text-slate-300 transition-all select-none cursor-pointer"
                  data-interactive="true"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub</span>
                </button>
              </motion.div>

              {/* Footer text */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="text-center mt-8 text-sm font-satoshi"
              >
                <span className="text-[#64748B]">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="text-[#3B82F6] hover:underline font-medium"
                  data-interactive="true"
                >
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {toastMessage && (
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
                <span className="text-sm font-semibold text-white font-satoshi">Success</span>
                <span className="text-xs text-[#94A3B8] font-satoshi leading-normal">
                  {toastMessage}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

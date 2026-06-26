import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Download,
  ClipboardCheck,
  Users,
  BookOpen,
  Settings,
  LogOut,
  X,
  Layers
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  role: 'student' | 'faculty';
}

export default function Sidebar({ role }: SidebarProps) {
  const { isSidebarOpen, closeSidebar } = useDashboard();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    closeSidebar();
    await logout();
    navigate('/login');
  };

  // Student Nav items
  const studentNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Records', path: '/student/records', icon: FileText },
    { label: 'Submit Work', path: '/student/submit', icon: Upload },
    { label: 'Download PDF', path: '/student/download', icon: Download }
  ];

  // Faculty Nav items
  const facultyNav = [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Review Work', path: '/faculty/review', icon: ClipboardCheck },
    { label: 'Students', path: '/faculty/students', icon: Users },
    { label: 'Grade Book', path: '/faculty/grades', icon: BookOpen }
  ];

  const currentNav = role === 'student' ? studentNav : facultyNav;

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const navContent = (
    <div className="w-[220px] bg-[#090B14] border-r border-white/5 h-full flex flex-col justify-between select-none">
      <div>
        {/* Top: Logo */}
        <div className="flex items-center justify-between px-5 py-6">
          <Link
            to={role === 'student' ? '/student/dashboard' : '/faculty/dashboard'}
            className="flex items-center gap-2 select-none"
            onClick={closeSidebar}
            data-interactive="true"
          >
            <div className="flex items-center justify-center w-5.5 h-5.5 rounded bg-accent-blue shadow-md shadow-accent-blue/20">
              <Layers className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold font-satoshi text-base tracking-tight text-white">
              RecordFlow
            </span>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden flex items-center justify-center p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
            data-interactive="true"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thin Divider */}
        <div className="h-px bg-white/[0.05] mx-5" />

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col gap-1 px-2">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-3.5 py-2.5 rounded-[8px] mx-2 text-sm font-medium font-satoshi transition-all group
                  ${
                    isActive
                      ? 'bg-accent-blue/10 text-accent-blue border-l-2 border-accent-blue rounded-l-none'
                      : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
                  }
                `}
                data-interactive="true"
              >
                <Icon className={`w-4 h-4 mr-2.5 transition-colors ${
                  isActive ? 'text-accent-blue' : 'text-slate-500 group-hover:text-slate-400'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pinned User Section */}
      <div>
        <div className="h-px bg-white/[0.05] mx-5" />
        
        <div className="p-4 flex flex-col gap-3">
          {/* Profile details */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/30 text-accent-blue font-satoshi font-semibold text-xs flex items-center justify-center flex-shrink-0">
              {getInitials(user?.name || 'User')}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white font-satoshi truncate leading-snug">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 font-satoshi truncate mt-0.5">
                {role === 'student' ? user?.rollNo : user?.employeeId}
              </span>
            </div>
          </div>

          {/* Quick Settings & Logout buttons */}
          <div className="flex items-center justify-between px-1 mt-1">
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors select-none cursor-pointer"
              data-interactive="true"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="font-satoshi">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors select-none cursor-pointer group"
              data-interactive="true"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:text-red-400" />
              <span className="font-satoshi">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky, Left) */}
      <div className="hidden lg:block w-[220px] h-screen sticky top-0 flex-shrink-0">
        {navContent}
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-in sidebar drawer */}
            <motion.div
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 z-50 h-screen lg:hidden"
            >
              {navContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

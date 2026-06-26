import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardProvider } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (user.role !== 'student') {
        navigate('/faculty/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  const getHeaderDetails = (path: string) => {
    switch (path) {
      case '/student/dashboard':
        return { title: 'Student Dashboard', subtitle: 'Overview of your academic lab progress' };
      case '/student/records':
        return { title: 'My Records', subtitle: 'View and track all submissions' };
      case '/student/submit':
        return { title: 'Submit a Record', subtitle: 'Upload and assign new lab work' };
      case '/student/download':
        return { title: 'Semester Record', subtitle: 'Download your compiled lab book' };
      default:
        return { title: 'Student Portal', subtitle: '' };
    }
  };

  const header = getHeaderDetails(location.pathname);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050816]">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="flex bg-[#050816] min-h-screen text-[#F8FAFC] overflow-x-hidden font-sans">
        {/* Responsive Navigation Sidebar */}
        <Sidebar role="student" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <TopBar title={header.title} subtitle={header.subtitle} />

          {/* Page body with page transitions */}
          <main className="flex-1 p-6 lg:p-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardProvider } from '../../hooks/useDashboard';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function FacultyLayout() {
  const location = useLocation();

  // Determine topbar titles based on path
  const getHeaderDetails = (path: string) => {
    if (path.startsWith('/faculty/students/')) {
      return { title: 'Student Details', subtitle: 'Individual academic report' };
    }
    switch (path) {
      case '/faculty/dashboard':
        return { title: 'Faculty Dashboard', subtitle: 'Web Tech & DBMS administration' };
      case '/faculty/review':
        return { title: 'Review Submissions', subtitle: 'Evaluate pending student files' };
      case '/faculty/students':
        return { title: 'Students List', subtitle: 'Manage enrolled student rosters' };
      case '/faculty/grades':
        return { title: 'Grade Book', subtitle: 'Class performance marksheet matrix' };
      default:
        return { title: 'Faculty Portal', subtitle: '' };
    }
  };

  const header = getHeaderDetails(location.pathname);

  return (
    <DashboardProvider>
      <div className="flex bg-[#050816] min-h-screen text-[#F8FAFC] overflow-x-hidden font-sans">
        {/* Responsive Navigation Sidebar */}
        <Sidebar role="faculty" />

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

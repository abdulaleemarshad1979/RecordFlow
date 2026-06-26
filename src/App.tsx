import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Effects & Cursor
import CustomCursor from './components/effects/CustomCursor';
import LoadingScreen from './components/effects/LoadingScreen';

// Layout Elements
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import Workflow from './components/sections/Workflow';
import DashboardPreview from './components/sections/DashboardPreview';
import Benefits from './components/sections/Benefits';
import Testimonials from './components/sections/Testimonials';
import FAQ from './components/sections/FAQ';
import CTA from './components/sections/CTA';

// Pages & Dashboards
import {
  Login,
  Signup,
  StudentDashboard,
  MyRecords,
  SubmitRecord,
  DownloadRecord,
  FacultyDashboard,
  ReviewSubmissions,
  StudentsList,
  GradeBook
} from './pages';
import StudentLayout from './components/dashboard/StudentLayout';
import FacultyLayout from './components/dashboard/FacultyLayout';

// Landing Page Wrapper
function LandingPage() {
  useEffect(() => {
    document.title = "RecordFlow · Digital Lab Records Platform";
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />
        <DashboardPreview />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis Smooth Scrolling once globally
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [isLoading]);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* High-Performance Custom Mouse Cursor (Desktop Only) */}
        <CustomCursor />

        {/* Loading Entrance Sequence */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

        {/* Main App Content Routing */}
        {!isLoading && (
          <motion.div
            id="app-container"
            className="bg-bg-primary text-text-primary min-h-screen relative flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth portals */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Student portal */}
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="records" element={<MyRecords />} />
                <Route path="submit" element={<SubmitRecord />} />
                <Route path="download" element={<DownloadRecord />} />
              </Route>

              {/* Faculty portal */}
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="review" element={<ReviewSubmissions />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="grades" element={<GradeBook />} />
              </Route>
            </Routes>
          </motion.div>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

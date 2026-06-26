import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Disable body scroll while loading
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, 500);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      id="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary text-text-primary select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
      }}
    >
      <div className="relative flex flex-col items-center max-w-md px-6 text-center">
        {/* Wordmark */}
        <motion.h1
          id="loading-wordmark"
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          RecordFlow
        </motion.h1>

        {/* Animated blue underline sweeping left to right */}
        <div className="relative w-36 h-[2px] bg-white/5 overflow-hidden mb-6 rounded-full">
          <motion.div
            id="loading-underline-sweep"
            className="absolute top-0 bottom-0 left-0 bg-accent-blue rounded-full"
            style={{ width: '100%' }}
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          id="loading-subtitle"
          className="text-text-secondary text-sm md:text-base font-medium font-satoshi"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
        >
          Digital lab records for engineering colleges
        </motion.p>
      </div>
    </motion.div>
  );
}

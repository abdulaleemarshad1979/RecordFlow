import { useState, useEffect } from 'react';

export function useScrollProgress(): { scrollY: number; progress: number } {
  const [scroll, setScroll] = useState({ scrollY: 0, progress: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScroll({ scrollY, progress });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scroll;
}

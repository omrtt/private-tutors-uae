import { useState, useEffect, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Tooltip from './Tooltip';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const circleRef = useRef(null);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setVisible(scrollTop > 300);
      setProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const offset = circumference - progress * circumference;

  return (
    <Tooltip text="العودة إلى الأعلى" position="left">
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="العودة إلى الأعلى"
      >
      <svg width="48" height="48" className="absolute">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-700" />
        <circle
          ref={circleRef}
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-150"
          transform="rotate(-90 24 24)"
        />
      </svg>
      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary-500 dark:text-primary-400 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-200 z-10">
        <FaArrowUp className="text-xs" />
      </div>
    </button>
    </Tooltip>
  );
}

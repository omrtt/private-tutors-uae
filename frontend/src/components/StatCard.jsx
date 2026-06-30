import { useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, color = 'text-primary-600', bg = 'bg-primary-50', animate = false, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate || !value) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, animate]);

  const pct = value ? Math.min((displayValue / value) * 100, 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
          {Icon && <Icon className={`text-lg ${color}`} />}
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold ${color} leading-none mb-1`}>
        {displayValue}{suffix}
      </p>
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%`, opacity: 0.3 }}
        />
      </div>
    </div>
  );
}

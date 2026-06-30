import { Link } from 'react-router-dom';

const illustrations = {
  search: (
    <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center shadow-inner">
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
        <circle cx="42" cy="42" r="22" stroke="currentColor" strokeWidth="4" className="text-primary-300 dark:text-primary-600" />
        <circle cx="42" cy="42" r="10" fill="currentColor" className="text-primary-200 dark:text-primary-700" />
        <path d="M58 58L72 72" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary-400" />
        <rect x="30" y="70" width="40" height="6" rx="3" fill="currentColor" className="text-primary-100 dark:text-primary-800" />
      </svg>
    </div>
  ),
  booking: (
    <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center shadow-inner">
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
        <rect x="20" y="15" width="60" height="70" rx="8" stroke="currentColor" strokeWidth="4" className="text-emerald-300 dark:text-emerald-600" />
        <rect x="30" y="30" width="40" height="4" rx="2" fill="currentColor" className="text-emerald-200 dark:text-emerald-700" />
        <rect x="30" y="42" width="30" height="4" rx="2" fill="currentColor" className="text-emerald-200 dark:text-emerald-700" />
        <rect x="30" y="54" width="35" height="4" rx="2" fill="currentColor" className="text-emerald-200 dark:text-emerald-700" />
        <circle cx="50" cy="72" r="8" fill="currentColor" className="text-emerald-200 dark:text-emerald-700" />
        <path d="M46 72L49 75L54 69" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" />
      </svg>
    </div>
  ),
  message: (
    <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20 flex items-center justify-center shadow-inner">
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
        <rect x="20" y="25" width="60" height="45" rx="8" stroke="currentColor" strokeWidth="4" className="text-accent-300 dark:text-accent-600" />
        <path d="M20 35L50 55L80 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent-300 dark:text-accent-600" />
        <circle cx="50" cy="75" r="12" fill="currentColor" className="text-accent-200 dark:text-accent-700" />
        <path d="M50 70V78M50 80V82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-500" />
      </svg>
    </div>
  ),
  error: (
    <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 flex items-center justify-center shadow-inner">
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="45" r="25" stroke="currentColor" strokeWidth="4" className="text-red-300 dark:text-red-600" />
        <path d="M38 33L62 57M62 33L38 57" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-red-400" />
        <rect x="35" y="75" width="30" height="6" rx="3" fill="currentColor" className="text-red-200 dark:text-red-700" />
      </svg>
    </div>
  ),
  tutors: (
    <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-800/20 flex items-center justify-center shadow-inner">
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
        <circle cx="38" cy="30" r="10" stroke="currentColor" strokeWidth="3" className="text-secondary-300 dark:text-secondary-600" />
        <path d="M25 50C25 42 31 36 38 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-secondary-300 dark:text-secondary-600" />
        <path d="M51 50C51 42 45 36 38 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-secondary-300 dark:text-secondary-600" />
        <circle cx="65" cy="35" r="8" stroke="currentColor" strokeWidth="2.5" className="text-secondary-300 dark:text-secondary-600" />
        <path d="M55 50C55 44 59 40 65 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-secondary-300 dark:text-secondary-600" />
        <path d="M75 50C75 44 71 40 65 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-secondary-300 dark:text-secondary-600" />
        <rect x="20" y="55" width="36" height="28" rx="6" className="text-primary-200 dark:text-primary-700" fill="currentColor" />
        <rect x="62" y="55" width="24" height="20" rx="5" className="text-accent-200 dark:text-accent-700" fill="currentColor" />
      </svg>
    </div>
  ),
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  illustration,
  onAction,
  className = '',
}) {
  const ill = illustrations[illustration] || null;

  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      {ill || (Icon && <Icon className="text-5xl mx-auto mb-4 text-slate-300 dark:text-slate-600" />)}
      {title && (
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary inline-flex items-center gap-2 shadow-glow">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className="btn-primary inline-flex items-center gap-2 shadow-glow">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

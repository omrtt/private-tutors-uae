export default function SubjectBadge({ label, className = '' }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 ${className}`}>
      {label}
    </span>
  );
}

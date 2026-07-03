import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Logo({ showText = true, className = '' }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect width="36" height="36" rx="9" className="fill-primary-500" />
        <path d="M12 24V14L18 10L24 14V24H20V18H16V24H12Z" fill="white" />
        <circle cx="18" cy="14" r="3" fill="#fcd34d" />
      </svg>
      {showText && (
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t('logo.text')}
        </span>
      )}
    </Link>
  );
}

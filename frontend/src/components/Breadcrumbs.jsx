import { Link } from 'react-router-dom';
import { FaHome, FaChevronLeft } from 'react-icons/fa';

export default function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-6 flex-wrap">
      <Link to="/" className="flex items-center gap-1.5 hover:text-primary-500 transition-colors p-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
        <FaHome className="text-[11px]" />
        <span>الرئيسية</span>
      </Link>
      {items?.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <FaChevronLeft className="text-[8px] text-slate-300 dark:text-slate-600" />
          {item.path ? (
            <Link
              to={item.path}
              className={`px-2 py-1 rounded-lg transition-colors ${
                item.class || 'hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-2 py-1 text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800 rounded-lg">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

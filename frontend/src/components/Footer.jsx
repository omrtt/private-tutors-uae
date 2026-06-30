import { Link } from 'react-router-dom';
import { FaCertificate } from 'react-icons/fa';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo showText className="scale-90 origin-right" />
            <span className="text-slate-200 dark:text-slate-700 hidden sm:inline">|</span>
            <p className="text-xs text-slate-400 hidden sm:block">
              &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <Link to="/tutors" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">مدرّسين</Link>
            <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">عن المنصة</Link>
            <Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">الأسئلة</Link>
            <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">اتصل بنا</Link>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">الشروط</Link>
            <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">الخصوصية</Link>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <FaCertificate className="text-primary-400 text-[10px]" />
            مقدمة من <span className="font-semibold text-primary-500 dark:text-primary-400">مركز عمران</span> للتدريب والتطوير
          </p>
        </div>
      </div>
    </footer>
  );
}

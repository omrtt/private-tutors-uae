import { Link } from 'react-router-dom';
import { FaCertificate } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo showText className="scale-90 origin-right" />
            <span className="text-slate-200 dark:text-slate-700 hidden sm:inline mx-2">|</span>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} {t('footer.rights')}
            </p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 text-xs">
            <Link to="/tutors" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('nav.tutors')}</Link>
            <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('nav.about')}</Link>
            <Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('nav.faq')}</Link>
            <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('nav.contact')}</Link>
            <span className="text-slate-200 dark:text-slate-700 hidden sm:inline">|</span>
            <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 font-medium transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <FaCertificate className="text-primary-400 text-[10px]" />
            {t('footer.poweredBy')} <span className="font-semibold text-primary-500 dark:text-primary-400">{t('footer.omranCenter')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

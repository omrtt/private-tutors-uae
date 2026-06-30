import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggleLang = () => {
    const newLang = isAr ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-150"
      title={isAr ? 'English' : 'العربية'}
    >
      {isAr ? 'EN' : 'عربي'}
    </button>
  );
}

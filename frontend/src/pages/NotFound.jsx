import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="page-container min-h-[70vh] flex items-center justify-center">
      <SEO title={t('notFound.title')} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-8xl font-extrabold text-primary-500 mb-2">{t('notFound.code')}</h1>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-white mb-3">{t('notFound.heading')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">{t('notFound.description')}</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FaHome /> {t('notFound.backHome')}
        </Link>
      </motion.div>
    </div>
  );
}

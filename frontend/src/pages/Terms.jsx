import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { FaGavel, FaFileAlt, FaShieldAlt, FaEdit } from 'react-icons/fa';

export default function Terms() {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('terms.pageTitle')} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaGavel className="text-primary-500 text-xl" />
          </div>
          <h1 className="section-title">{t('terms.heading')}</h1>
        </div>
        <div className="card p-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{t('terms.intro')}</p>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaFileAlt className="text-primary-500" />
              {t('terms.serviceUsageTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t('terms.serviceUsageText')}</p>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaShieldAlt className="text-primary-500" />
              {t('terms.responsibilitiesTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t('terms.responsibilitiesText')}</p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaEdit className="text-primary-500" />
              {t('terms.serviceModificationTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t('terms.serviceModificationText')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

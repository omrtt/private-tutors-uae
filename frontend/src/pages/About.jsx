import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher, FaUsers, FaStar, FaHandshake, FaBullseye } from 'react-icons/fa';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <SEO title={t('about.seoTitle')} />
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaChalkboardTeacher className="text-primary-500 text-2xl" />
          </div>
          <h1 className="section-title mb-4">{t('about.heading')}</h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t('about.descriptionP1')}
            {' '}
            {t('about.descriptionP2')}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center p-6">
            <p className="text-3xl font-bold text-primary-500 mb-1">+٥٠٠</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.statsTeachers')}</p>
          </div>
          <div className="card text-center p-6">
            <p className="text-3xl font-bold text-accent-500 mb-1">+١٠٠٠</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.statsStudents')}</p>
          </div>
          <div className="card text-center p-6">
            <p className="text-3xl font-bold text-primary-500 mb-1">+٣٠</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.statsSubjects')}</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card card-hover p-6">
            <FaUsers className="text-primary-500 text-3xl mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">{t('about.featuresHundredsOfTutors')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.featuresHundredsOfTutorsDesc')}</p>
          </div>
          <div className="card card-hover p-6">
            <FaStar className="text-accent-500 text-3xl mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">{t('about.featuresGuaranteedQuality')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.featuresGuaranteedQualityDesc')}</p>
          </div>
          <div className="card card-hover p-6">
            <FaHandshake className="text-primary-500 text-3xl mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">{t('about.featuresTrustAndTransparency')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.featuresTrustAndTransparencyDesc')}</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <circle cx="50" cy="50" r="40" fill="white" />
              <circle cx="350" cy="150" r="60" fill="white" />
            </svg>
          </div>
          <div className="relative">
            <FaBullseye className="text-white text-3xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">{t('about.ctaHeading')}</h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto">{t('about.ctaSubtitle')}</p>
            <a href="/register" className="inline-block bg-accent-400 hover:bg-accent-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-accent-500/30">
              {t('about.ctaButton')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <SEO title={t('contact.seoTitle')} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
        <h1 className="section-title mb-2">{t('contact.heading')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{t('contact.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
              <FaEnvelope className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('contact.emailLabel')}</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">info@modars.ae</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-500 shadow-sm">
              <FaPhone className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('contact.phoneLabel')}</p>
              <p className="font-medium text-slate-700 dark:text-slate-200" dir="ltr">+971 50 000 0000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('contact.locationLabel')}</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('contact.address')}</p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t('contact.formTitle')}</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={t('contact.namePlaceholder')} className="input-field" />
              <input type="email" placeholder={t('contact.emailPlaceholder')} className="input-field" />
            </div>
            <input type="text" placeholder={t('contact.subjectPlaceholder')} className="input-field" />
            <textarea rows="5" placeholder={t('contact.messagePlaceholder')} className="input-field resize-none" />
            <button type="submit" className="btn-primary">{t('contact.submitBtn')}</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

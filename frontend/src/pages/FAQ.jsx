import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

export default function FAQ() {
  const { t } = useTranslation();
  const faqItems = t('faq.items', { returnObjects: true });
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="page-container">
      <SEO title={t('faq.seoTitle')} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaQuestionCircle className="text-primary-500 text-xl" />
          </div>
          <h1 className="section-title">{t('faq.heading')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{t('faq.subtitle')}</p>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`card p-4 cursor-pointer transition-all ${
                openIndex === i ? 'border-primary-200 bg-primary-50/30 dark:bg-primary-900/20' : ''
              }`}
              onClick={() => toggle(i)}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200">{item.question}</span>
                <FaChevronDown className={`text-primary-500 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180' : ''
                }`} />
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const faqs = [
  { q: 'كيف يمكنني البحث عن مدرّس؟', a: 'يمكنك استخدام صفحة البحث وتصفية النتائج حسب المادة الدراسية، المنطقة، أو السعر.' },
  { q: 'هل التسجيل مجاني؟', a: 'نعم، التسجيل مجاني تماماً للطلاب والمدرسين.' },
  { q: 'كيف يمكنني أن أصبح مدرّساً؟', a: 'قم بالتسجيل كطالب أولاً، ثم اذهب إلى لوحة التحكم واضغط على "كن مدرّساً" لملء بياناتك.' },
  { q: 'هل المنصة مسؤولة عن جودة المدرسين؟', a: 'نحن نتحقق من معلومات المدرسين ولكن ننصح الطلاب بالتواصل معهم مباشرة للتأكد.' },
  { q: 'كيف يمكنني التواصل مع الدعم؟', a: 'يمكنك التواصل معنا عبر صفحة "اتصل بنا" أو عبر البريد الإلكتروني.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="page-container">
      <SEO title="الأسئلة الشائعة" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaQuestionCircle className="text-primary-500 text-xl" />
          </div>
          <h1 className="section-title">الأسئلة الشائعة</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8">إجابات لأكثر الأسئلة تكراراً</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
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
                <span className="font-bold text-slate-700 dark:text-slate-200">{faq.q}</span>
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
                      {faq.a}
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

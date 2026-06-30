import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { FaLock, FaDatabase, FaCogs, FaShieldAlt } from 'react-icons/fa';

export default function Privacy() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title="سياسة الخصوصية" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaLock className="text-primary-500 text-xl" />
          </div>
          <h1 className="section-title">سياسة الخصوصية</h1>
        </div>
        <div className="card p-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">نحن في خصوصي نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام معلوماتك.</p>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaDatabase className="text-primary-500" />
              المعلومات التي نجمعها
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">نقوم بجمع المعلومات التي تقدمها عند التسجيل، بما في ذلك الاسم، البريد الإلكتروني، ورقم الهاتف.</p>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaCogs className="text-primary-500" />
              كيف نستخدم معلوماتك
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">نستخدم معلوماتك لتقديم الخدمة، وتحسين تجربة المستخدم، والتواصل معك بخصوص الخدمة.</p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaShieldAlt className="text-primary-500" />
              حماية المعلومات
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">نطبق إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

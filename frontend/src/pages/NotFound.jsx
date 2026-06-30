import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="page-container min-h-[70vh] flex items-center justify-center">
      <SEO title="الصفحة غير موجودة" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-8xl font-extrabold text-primary-500 mb-2">٤٠٤</h1>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-white mb-3">الصفحة غير موجودة</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FaHome /> العودة للرئيسية
        </Link>
      </motion.div>
    </div>
  );
}

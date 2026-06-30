import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { FaGavel, FaFileAlt, FaShieldAlt, FaEdit } from 'react-icons/fa';

export default function Terms() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title="شروط الخدمة" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaGavel className="text-primary-500 text-xl" />
          </div>
          <h1 className="section-title">الشروط والأحكام</h1>
        </div>
        <div className="card p-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">مرحباً بك في منصة خصوصي. باستخدامك للمنصة، فإنك توافق على هذه الشروط والأحكام.</p>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaFileAlt className="text-primary-500" />
              استخدام الخدمة
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">تقدم المنصة خدمة الوساطة بين الطلاب والمدرسين الخصوصيين. نحن لسنا طرفاً في أي اتفاقية تعليمية تتم بين الطالب والمدرّس.</p>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaShieldAlt className="text-primary-500" />
              المسؤوليات
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">المدرّسون مسؤولون عن دقة معلوماتهم الشخصية والمهنية. الطلاب مسؤولون عن اختيار المدرّس المناسب.</p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white mb-3">
              <FaEdit className="text-primary-500" />
              تعديل الخدمة
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">نحتفظ بالحق في تعديل أو إيقاف الخدمة في أي وقت دون إشعار مسبق.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

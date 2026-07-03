import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('تم إرسال تعليمات إعادة تعيين كلمة المرور');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إرسال البريد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="نسيت كلمة المرور" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition mb-6 text-sm">
            <FaArrowLeft /> العودة لتسجيل الدخول
          </Link>
          <div className="flex justify-center mb-4">
            <Logo showText={false} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">نسيت كلمة المرور</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة التعيين</p>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">تم الإرسال!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">تحقق من بريدك الإلكتروني لتعليمات إعادة تعيين كلمة المرور.</p>
              <Link to="/login" className="btn-primary inline-block">العودة لتسجيل الدخول</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FaEnvelope className="inline ml-1.5 text-primary-500" /> البريد الإلكتروني
                </label>
                <input type="email" className="input-field" placeholder="أدخل بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري...</span> : 'إرسال'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('مرحباً بعودتك!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="تسجيل الدخول" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-500 transition mb-6 text-sm">
            <FaArrowLeft /> العودة للرئيسية
          </Link>
          <div className="flex justify-center mb-4">
            <Logo showText={false} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مرحباً بعودتك</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">سجّل دخول للمتابعة</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaEnvelope className="inline ml-1.5 text-primary-500" /> البريد الإلكتروني
              </label>
              <input type="email" className="input-field" placeholder="أدخل بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaLock className="inline ml-1.5 text-primary-500" /> كلمة المرور
              </label>
              <input type="password" className="input-field" placeholder="أدخل كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري...</span> : 'دخول'}
            </button>
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 font-medium">نسيت كلمة المرور؟</Link>
            </div>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            ليس لديك حساب؟ <Link to="/register" className="text-primary-500 font-bold hover:underline">سجّل الآن</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

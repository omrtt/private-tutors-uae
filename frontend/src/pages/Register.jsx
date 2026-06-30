import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('تم إنشاء الحساب!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="إنشاء حساب جديد" />
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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">إنشاء حساب جديد</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">انضم إلى منصتنا وابحث عن المدرّس المناسب</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaUser className="inline ml-1.5 text-primary-500" /> الاسم الكامل
              </label>
              <input type="text" name="name" className="input-field" placeholder="أدخل اسمك" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaEnvelope className="inline ml-1.5 text-primary-500" /> البريد الإلكتروني
              </label>
              <input type="email" name="email" className="input-field" placeholder="أدخل بريدك الإلكتروني" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaPhone className="inline ml-1.5 text-primary-500" /> رقم الهاتف
              </label>
              <input type="tel" name="phone" className="input-field" placeholder="مثال: ٠٥٠١٢٣٤٥٦٧" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <FaLock className="inline ml-1.5 text-primary-500" /> كلمة المرور
              </label>
              <input type="password" name="password" className="input-field" placeholder="أقل شيء ٦ أحرف" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري...</span> : 'إنشاء الحساب'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            لديك حساب بالفعل؟ <Link to="/login" className="text-primary-500 font-bold hover:underline">تسجيل دخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

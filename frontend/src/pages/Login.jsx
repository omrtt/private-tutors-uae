import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPhone, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import UaePassIcon from '../components/UaePassIcon';

export default function Login() {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user && !searchParams.get('uaepass_token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, searchParams]);

  useEffect(() => {
    const token = searchParams.get('uaepass_token');
    const error = searchParams.get('error');
    if (token && token.length > 10) {
      localStorage.setItem('token', token);
      window.location.reload();
    }
    if (error) {
      toast.error(t('login.uaepassError'));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(phone, password);
      toast.success(t('login.success'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950">
      <SEO title={t('login.title')} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-accent-400/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-500 transition mb-6 text-sm font-medium">
              <FaArrowLeft className="text-xs" /> {t('login.backToHome')}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mb-5"
          >
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Logo showText={false} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-2xl font-extrabold text-slate-900 dark:text-white"
          >
            {t('login.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 text-sm mt-1.5"
          >
            {t('login.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('login.phoneLabel')}
              </label>
              <div className="relative">
                <div className="absolute start-0 top-0 bottom-0 flex items-center justify-center w-11 bg-slate-100 dark:bg-slate-700/50 border-e border-slate-200 dark:border-slate-600 rounded-s-lg text-sm font-bold text-primary-600">
                  +971
                </div>
                <input
                  type="tel"
                  className="input-field !ps-14"
                  placeholder="5X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('login.passwordLabel')}
              </label>
              <div className="relative">
                <FaLock className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field !ps-10 !pe-10"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition text-sm"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full text-base !py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : t('login.loginBtn')}
            </button>
            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 font-medium transition">
                {t('login.forgotPassword')}
              </Link>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-800 px-4 text-xs text-slate-400 dark:text-slate-500">
                {t('login.orContinueWith')}
              </span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/api/auth/uaepass'}
            className="w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 overflow-hidden transition-all duration-200 p-4 hover:shadow-md hover:shadow-primary-500/5"
          >
            <UaePassIcon />
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-primary-500 font-bold hover:underline transition">
              {t('login.registerLink')}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

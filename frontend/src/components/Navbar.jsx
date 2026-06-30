import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { FaGraduationCap, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaPlusCircle, FaQuestionCircle, FaInfoCircle, FaEnvelope, FaMoon, FaSun, FaUserPlus, FaSignInAlt, FaHome, FaLayerGroup, FaComment, FaRss } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Avatar from './Avatar';
import Logo from './Logo';
import Tooltip from './Tooltip';

const navLinks = [
  { to: '/', label: 'nav.home', icon: FaHome },
  { to: '/tests', label: 'tests.nav', icon: FaGraduationCap },
  { to: '/feed', label: 'feed.nav', icon: FaRss },
  { to: '/tutors', label: 'nav.searchTutor', icon: FaSearch },
  { to: '/about', label: 'عن المنصة', icon: FaInfoCircle, isStatic: true },
  { to: '/faq', label: 'الأسئلة', icon: FaQuestionCircle, isStatic: true },
  { to: '/contact', label: 'اتصل بنا', icon: FaEnvelope, isStatic: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/5'
        : 'bg-white dark:bg-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              const label = link.isStatic ? link.label : t(link.label);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors duration-200 group"
                >
                  <Icon className={`text-xs transition-transform duration-200 group-hover:scale-110 ${
                    active
                      ? 'text-primary-500'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                  <span className={`transition-colors duration-200 ${
                    active
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 right-1/2 translate-x-1/2 w-5 h-0.5 bg-primary-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Tooltip text={dark ? 'الوضع النهاري' : 'الوضع الليلي'}>
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:text-amber-500 dark:hover:text-amber-400"
              >
                {dark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </button>
            </Tooltip>
            <LanguageSwitcher />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaLayerGroup className="text-xs" />
                  {t('nav.dashboard')}
                </Link>
                {user.role !== 'tutor' && (
                  <Link
                    to="/become-tutor"
                    className="px-4 py-2 rounded-2xl border-2 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-sm font-bold hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaPlusCircle />
                    {t('nav.becomeTutor')}
                  </Link>
                )}
                <div className="flex items-center gap-2.5 pr-3 border-r-2 border-slate-100 dark:border-slate-800">
                  <Tooltip text="المراسلات">
                    <Link
                      to="/chat"
                      className="p-2.5 rounded-2xl text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                    >
                      <FaComment className="text-sm" />
                    </Link>
                  </Tooltip>
                  <Avatar name={user.name} size="sm" radius="full" className="ring-2 ring-slate-100 dark:ring-slate-800" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{user.name}</span>
                  <Tooltip text="تسجيل الخروج">
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-500"
                    >
                      <FaSignOutAlt className="text-sm" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSignInAlt className="text-xs" />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaUserPlus className="text-xs" />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Tooltip text={dark ? 'الوضع النهاري' : 'الوضع الليلي'}>
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {dark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </button>
            </Tooltip>
            <LanguageSwitcher />
            <button
              className={`p-2.5 rounded-xl transition-all duration-200 ${menuOpen ? 'bg-primary-50 text-primary-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-900/10 px-4 pb-5 pt-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            const label = link.isStatic ? link.label : t(link.label);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 py-3 px-4 rounded-2xl transition-all duration-200 text-sm font-medium ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`text-sm ${active ? 'text-primary-500' : 'text-slate-400'}`} />
                {label}
              </Link>
            );
          })}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={user.name} size="sm" radius="full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="flex items-center gap-3 py-3 px-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                  <FaLayerGroup className="text-sm" />
                  {t('nav.dashboard')}
                </Link>
                <Link to="/chat" className="flex items-center gap-3 py-3 px-4 rounded-2xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all text-sm font-medium">
                  <FaComment className="text-sm" />
                  المراسلات
                </Link>
                {user.role !== 'tutor' && (
                  <Link to="/become-tutor" className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 transition-all text-sm font-bold">
                    <FaPlusCircle />
                    {t('nav.becomeTutor')}
                  </Link>
                )}
                <button onClick={() => { handleLogout(); }} className="flex items-center gap-3 py-3 px-4 rounded-2xl w-full text-right text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium">
                  <FaSignOutAlt />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-3 py-3 px-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                  <FaSignInAlt />
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-all">
                  <FaUserPlus />
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

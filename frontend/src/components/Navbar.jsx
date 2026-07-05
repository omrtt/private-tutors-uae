import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import axios from 'axios';
import {
  FaGraduationCap, FaSignOutAlt, FaBars, FaTimes, FaSearch,
  FaPlusCircle, FaQuestionCircle, FaInfoCircle, FaEnvelope,
  FaMoon, FaSun, FaUserPlus, FaSignInAlt, FaHome, FaLayerGroup,
  FaComment, FaRss, FaBell, FaUser, FaChevronDown, FaCrown
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
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
  { to: '/about', label: 'nav.about', icon: FaInfoCircle, secondary: true },
  { to: '/faq', label: 'nav.faq', icon: FaQuestionCircle, secondary: true },
  { to: '/contact', label: 'nav.contact', icon: FaEnvelope, secondary: true },
];

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function useNotifications(user) {
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  useEffect(() => {
    if (!user) return;
    axios.get('/api/notifications')
      .then((r) => setUnreadNotifs(r.data.filter((n) => !n.read).length))
      .catch(() => {});
  }, [user]);
  return unreadNotifs;
}

const userMenuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1 } },
};

const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const scrolled = useScrollState();
  const unreadNotifs = useNotifications(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => (
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path))
  );

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl shadow-premium border-b border-slate-100/50 dark:border-slate-800/50'
        : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.secondary) return null;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 xl:px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 group ${
                    active
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {t(link.label)}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 right-1/2 translate-x-1/2 w-4 h-0.5 bg-primary-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Tooltip text={t(dark ? 'common.lightMode' : 'common.darkMode')}>
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:text-amber-500 dark:hover:text-amber-400"
              >
                {dark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </button>
            </Tooltip>
            <LanguageSwitcher />
            <div className="w-px h-6 bg-slate-200/70 dark:bg-slate-700/50 mx-1" />
            {user ? (
              <div className="flex items-center gap-1.5">
                <Tooltip text={t('nav.notifications')}>
                  <Link
                    to="/notifications"
                    className="relative p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <FaBell className="text-sm" />
                    {unreadNotifs > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                        {unreadNotifs > 9 ? '9+' : unreadNotifs}
                      </span>
                    )}
                  </Link>
                </Tooltip>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-xl transition-all duration-200 ${
                      userMenuOpen
                        ? 'bg-slate-100 dark:bg-slate-800 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Avatar name={user.name} size="sm" radius="full" className="ring-2 ring-slate-100 dark:ring-slate-800" />
                    <FaChevronDown className={`text-[10px] text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        variants={userMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200/80 dark:border-slate-700/80 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} size="md" radius="full" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                {user.name}
                                {(user.role === 'admin' || user.role === 'tutor' || user.role === 'support') && (
                                  <FaCrown className="text-primary-500 text-[10px]" />
                                )}
                              </p>
                              <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                            <FaUser className="text-xs w-4" /> {t('nav.profile')}
                          </Link>
                          <Link to={user.role === 'student' || user.role === 'user' ? '/student' : '/dashboard'} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                            <FaLayerGroup className="text-xs w-4" /> {t('nav.dashboard')}
                          </Link>
                          <Link to="/chat" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                            <FaComment className="text-xs w-4" /> {t('nav.chat')}
                          </Link>
                          <div className="divider my-1" />
                          {(user.role === 'admin' || user.role === 'support') && (
                            <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-500/10 transition-all">
                              <FaCrown className="text-xs w-4" /> {user.role === 'support' ? 'لوحة الدعم' : t('nav.adminPanel')}
                            </Link>
                          )}
                  {user.role !== 'tutor' && user.role !== 'admin' && user.role !== 'support' && (
                            <Link to="/become-tutor" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all">
                              <FaPlusCircle className="text-xs w-4" /> {t('nav.becomeTutor')}
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 p-1.5">
                          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-right">
                            <FaSignOutAlt className="w-4" /> {t('nav.logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSignInAlt className="text-xs" />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-500 text-white text-sm font-bold hover:from-primary-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaUserPlus className="text-xs" />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Tooltip text={t(dark ? 'common.lightMode' : 'common.darkMode')}>
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {dark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </button>
            </Tooltip>
            <LanguageSwitcher />
            <button
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                menuOpen
                  ? 'bg-primary-50 text-primary-500 dark:bg-primary-500/10'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 shadow-premium px-4 pb-6 pt-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3.5 py-3 px-4 rounded-2xl transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-500/15 dark:to-emerald-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`text-sm ${active ? 'text-primary-500' : 'text-slate-400'}`} />
                    {t(link.label)}
                  </Link>
                );
              })}
              <div className="divider my-3" />
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar name={user.name} size="sm" radius="full" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3.5 py-3 px-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                    <FaUser className="text-sm" /> {t('nav.profile')}
                  </Link>
                  <Link to="/notifications" className="flex items-center gap-3.5 py-3 px-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                    <FaBell className="text-sm" /> {t('nav.notifications')}
                    {unreadNotifs > 0 && <span className="ms-auto bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadNotifs}</span>}
                  </Link>
                  <Link to={user.role === 'student' || user.role === 'user' ? '/student' : '/dashboard'} className="flex items-center gap-3.5 py-3 px-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                    <FaLayerGroup className="text-sm" /> {t('nav.dashboard')}
                  </Link>
                  <Link to="/chat" className="flex items-center gap-3.5 py-3 px-4 rounded-2xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all text-sm font-medium">
                    <FaComment className="text-sm" /> {t('nav.chat')}
                  </Link>
                  {user.role !== 'tutor' && user.role !== 'admin' && user.role !== 'support' && (
                    <Link to="/become-tutor" className="flex items-center gap-3.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-500/15 dark:to-emerald-500/10 text-primary-600 dark:text-primary-400 transition-all text-sm font-bold">
                      <FaPlusCircle /> {t('nav.becomeTutor')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3.5 py-3 px-4 rounded-2xl w-full text-right text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium mt-1">
                    <FaSignOutAlt /> {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link to="/login" className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium">
                    <FaSignInAlt /> {t('nav.login')}
                  </Link>
                  <Link to="/register" className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-emerald-500 text-white text-sm font-bold hover:from-primary-600 hover:to-emerald-600 transition-all shadow-md shadow-primary-500/20">
                    <FaUserPlus /> {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

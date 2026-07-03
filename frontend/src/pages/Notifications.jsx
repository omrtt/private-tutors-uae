import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckDouble, FaTrash, FaBookmark, FaStar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const typeIcons = {
  new_booking: { icon: FaBookmark, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  booking_status: { icon: FaHourglassHalf, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  review: { icon: FaStar, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
};

const defaultIcon = { icon: FaBell, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-700/50' };

export default function Notifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/notifications');
      setNotifications(r.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success(t('notificationsPage.markAllReadSuccess'));
    } catch {}
  };

  const deleteNotif = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success(t('notificationsPage.deleteSuccess'));
    } catch {}
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (n) => {
    const config = typeIcons[n.type] || defaultIcon;
    const Icon = config.icon;
    return { Icon, ...config };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('notificationsPage.pageTitle')} />

      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: t('notificationsPage.heading') }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FaBell className="text-primary-500" /> {t('notificationsPage.heading')}
              {unreadCount > 0 && (
                <span className="text-sm font-bold text-white bg-primary-500 px-2.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('notificationsPage.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={markAllAsRead} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-500/20 transition">
                <FaCheckDouble /> {t('notificationsPage.markAllRead')}
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {['all', 'unread'].map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? t('notificationsPage.filterAll') : t('notificationsPage.filterUnread')}
              {f === 'unread' && unreadCount > 0 && <span className="mr-1">({unreadCount})</span>}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            illustration="notifications"
            title={filter === 'unread' ? t('notificationsPage.allRead') : t('notificationsPage.empty')}
            description={filter === 'unread' ? '' : t('notificationsPage.emptyDescription')}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {filtered.map((n) => {
                const { Icon, color, bg } = getIcon(n);
                return (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 transition-all duration-200 hover:shadow-card ${n.read ? '' : 'border-r-4 border-r-primary-500 shadow-sm'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 ${n.read ? 'opacity-60' : ''}`}>
                        <Icon className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.read ? 'text-slate-500 dark:text-slate-400' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString('ar-AE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <button onClick={() => markAsRead(n._id)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 text-slate-400 hover:text-primary-500 transition" title={t('notificationsPage.markRead')}>
                            <FaCheckDouble className="text-xs" />
                          </button>
                        )}
                        <button onClick={() => deleteNotif(n._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition" title={t('common.delete')}>
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
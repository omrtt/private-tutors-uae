import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaUser, FaEdit, FaSave, FaTimes, FaBookmark, FaHeart,
  FaStar, FaCalendarAlt, FaPhone, FaEnvelope, FaUserPlus,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaLock,
  FaEye, FaEyeSlash, FaArrowLeft
} from 'react-icons/fa';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    axios.get('/api/bookings/my').then((r) => setBookings(r.data)).catch(() => {});
    axios.get('/api/favorites').then((r) => setFavorites(r.data)).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error(t('profile.nameRequired'));
    setSaving(true);
    try {
      await axios.put('/api/auth/profile', form);
      toast.success(t('profile.profileUpdated'));
      setEditing(false);
    } catch {
      toast.error(t('common.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword) return toast.error(t('profile.currentPasswordRequired'));
    if (pwForm.newPassword.length < 6) return toast.error(t('profile.newPasswordRequired'));
    setPwSaving(true);
    try {
      await axios.put('/api/auth/change-password', pwForm);
      toast.success(t('profile.passwordChanged'));
      setShowPasswordForm(false);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('profile.passwordChangeError'));
    } finally {
      setPwSaving(false);
    }
  };

  const roleColors = {
    student: 'text-green-600 bg-green-50 dark:bg-green-500/10',
    tutor: 'text-primary-600 bg-primary-50 dark:bg-primary-500/10',
    admin: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10'
  };
  const roleLabels = {
    student: t('profile.role.student'),
    tutor: t('profile.role.tutor'),
    admin: t('profile.role.admin')
  };

  const stats = [
    { icon: FaBookmark, label: t('profile.stats.bookings'), value: bookings.length, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { icon: FaHeart, label: t('profile.stats.favorites'), value: favorites.length, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { icon: FaCheckCircle, label: t('profile.stats.completed'), value: bookings.filter((b) => b.status === 'completed').length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { icon: FaHourglassHalf, label: t('profile.stats.pending'), value: bookings.filter((b) => b.status === 'pending').length, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('profile.title')} />

      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-card overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-l from-primary-500 via-emerald-500 to-teal-500 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start gap-5 -mt-12 relative z-10">
              <Avatar name={user?.name} size="xl" radius="2xl" className="ring-4 ring-white dark:ring-slate-800 shadow-xl" />
              <div className="flex-1 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleColors[user?.role] || roleColors.student}`}>
                        {roleLabels[user?.role] || t('profile.role.student')}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FaCalendarAlt className="text-[10px]" />
                        {t('profile.memberSince')} {new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-AE')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${editing ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20'}`}
                  >
                    {editing ? <FaTimes /> : <FaEdit />}
                    {editing ? t('profile.cancelBtn') : t('profile.editBtn')}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-blue-500 text-xs" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('profile.emailLabel')}</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <FaPhone className="text-emerald-500 text-xs" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('profile.phoneLabel')}</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{user?.phone || t('profile.phoneNotSet')}</p>
                </div>
              </div>
            </div>

            {editing && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSave} className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">{t('becomeTutor.editTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('profile.nameLabel')}</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('profile.phoneLabel')}</label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="btn-primary !py-2 !px-5 text-sm flex items-center gap-1.5">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave />}
                  {t('common.save')}
                </button>
              </motion.form>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard key={i} icon={s.icon} label={s.label} value={s.value} color={s.color} bg={s.bg} animate />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Bookings */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <FaBookmark className="text-primary-500" /> {t('profile.recentBookings')}
            </h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FaCalendarAlt className="text-4xl mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-500 dark:text-slate-400 mb-1">{t('profile.noBookings')}</p>
                <p className="text-sm mb-4">{t('profile.noBookingsDesc')}</p>
                <Link to="/tutors" className="btn-primary !py-2 !px-5 text-sm">{t('profile.findTutor')}</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition border border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                        b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        b.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                        b.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {b.status === 'completed' ? <FaCheckCircle /> : b.status === 'cancelled' ? <FaTimesCircle /> : <FaHourglassHalf />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{b.subject}</p>
                        <p className="text-xs text-slate-400">{b.tutor?.user?.name} • {new Date(b.date).toLocaleDateString('ar-AE')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary-500">{b.totalAmount} {t('dashboard.currency')}</span>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <Link to="/dashboard" className="block text-center text-sm text-primary-500 hover:text-primary-600 font-semibold pt-2">{t('common.viewAll')} ←</Link>
                )}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <FaHeart className="text-rose-500" /> {t('profile.favoritesList')}
              {favorites.length > 0 && (
                <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">({favorites.length})</span>
              )}
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FaHeart className="text-4xl mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-500 dark:text-slate-400 mb-1">{t('profile.noFavorites')}</p>
                <p className="text-sm mb-4">{t('profile.noFavoritesDesc')}</p>
                <Link to="/tutors" className="btn-primary !py-2 !px-5 text-sm">{t('profile.browseTutors')}</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {favorites.map((tutorId) => (
                  <FavTutorItem key={tutorId} tutorId={tutorId} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-card p-6 mb-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FaLock className="text-primary-500" /> {t('profile.changePassword')}
            </h2>
            <span className={`text-sm transition-transform ${showPasswordForm ? 'rotate-180' : ''}`}>
              <FaArrowLeft />
            </span>
          </button>
          {showPasswordForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handlePasswordChange}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('profile.currentPassword')}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="input-field ps-10"
                      required
                    />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('profile.newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      className="input-field ps-10"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNewPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={pwSaving} className="btn-primary !py-2 !px-5 text-sm flex items-center gap-1.5">
                {pwSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaLock />}
                {t('profile.changePassword')}
              </button>
            </motion.form>
          )}
        </div>

        {/* Become a Tutor CTA */}
        {user?.role !== 'tutor' && (
          <div className="bg-gradient-to-br from-primary-500 to-emerald-600 rounded-3xl p-6 text-white text-center">
            <FaUserPlus className="text-3xl mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold mb-1">{t('profile.becomeTutor')}</h3>
            <p className="text-sm opacity-80 mb-4">{t('profile.becomeTutorDesc')}</p>
            <Link to="/become-tutor" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-primary-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition shadow-lg">
              <FaUserPlus /> {t('profile.becomeTutorBtn')}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FavTutorItem({ tutorId }) {
  const [tutor, setTutor] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    axios.get(`/api/tutors/${tutorId}`).then((r) => setTutor(r.data)).catch(() => {});
  }, [tutorId]);

  if (!tutor) return null;

  return (
    <Link
      to={`/tutors/${tutorId}`}
      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition border border-slate-50 dark:border-slate-800 group"
    >
      <div className="flex items-center gap-3">
        <Avatar name={tutor.user?.name} size="sm" radius="xl" />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tutor.user?.name || t('tutorCard.defaultName')}</p>
          <p className="text-xs text-slate-400">{tutor.subjects?.slice(0, 2).join(' • ')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-primary-500">{tutor.ratePerHour} {t('common.aedPerHour')}</span>
        <FaArrowLeft className="text-xs text-slate-300 group-hover:text-primary-400 transition" />
      </div>
    </Link>
  );
}

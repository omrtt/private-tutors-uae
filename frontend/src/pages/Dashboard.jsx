import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaBookmark, FaChalkboardTeacher, FaStar, FaUser, FaClock,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaChartLine,
  FaMoneyBillWave, FaBell, FaComments, FaCalendarAlt, FaArrowUp,
  FaPlusCircle, FaSearch, FaUserPlus, FaChartBar, FaUsers,
  FaGraduationCap, FaBookOpen, FaTrash, FaEdit, FaArrowLeft,
  FaVideo, FaGlobe, FaRss, FaPaperPlane, FaShieldAlt
} from 'react-icons/fa';
import { FiEdit3 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const statusProgress = { pending: 25, confirmed: 50, completed: 100, cancelled: 100 };

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const statusConfig = {
    pending: { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-800', dot: 'bg-yellow-400', bar: 'bg-yellow-400', label: t('dashboard.pending'), icon: FaHourglassHalf },
    confirmed: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-400', bar: 'bg-emerald-400', label: t('dashboard.confirmed'), icon: FaCheckCircle },
    completed: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-400', bar: 'bg-blue-400', label: t('dashboard.completed'), icon: FaCheckCircle },
    cancelled: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-400', bar: 'bg-red-400', label: t('dashboard.cancelled'), icon: FaTimesCircle },
  };
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  const [bookings, setBookings] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [loading, setLoading] = useState({ bookings: true, profile: true });
  const [records, setRecords] = useState([]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordForm, setRecordForm] = useState({ subject: '', grade: '', maxGrade: '100', notes: '' });
  const [newPost, setNewPost] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (user?.role === 'tutor') {
      axios.get('/api/tutors/me').then((r) => setTutorProfile(r.data)).catch(() => {}).finally(() => setLoading((p) => ({ ...p, profile: false })));
      axios.get('/api/bookings/tutor').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading((p) => ({ ...p, bookings: false })));
    } else {
      axios.get('/api/bookings/my').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading((p) => ({ ...p, bookings: false })));
    }
    axios.get('/api/academic').then((r) => setRecords(r.data)).catch(() => {});
    axios.get('/api/notifications').then((r) => setNotifications(r.data)).catch(() => {});
    axios.get('/api/chat/conversations').then((r) => setConversations(r.data)).catch(() => {});
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      const res = await axios.get('/api/bookings/tutor');
      setBookings(res.data);
    } catch {}
  };

  const refreshRecords = async () => {
    try {
      const res = await axios.get('/api/academic');
      setRecords(res.data);
    } catch {}
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await axios.put(`/api/academic/${editingRecord._id}`, recordForm);
      } else {
        await axios.post('/api/academic', recordForm);
      }
      setShowRecordForm(false);
      setEditingRecord(null);
      setRecordForm({ subject: '', grade: '', maxGrade: '100', notes: '' });
      await refreshRecords();
    } catch {}
  };

  const handleEditRecord = (rec) => {
    setEditingRecord(rec);
    setRecordForm({ subject: rec.subject, grade: rec.grade, maxGrade: rec.maxGrade, notes: rec.notes || '' });
    setShowRecordForm(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await axios.delete(`/api/academic/${id}`);
      await refreshRecords();
    } catch {}
  };

  const handleTrialRefund = async (bookingId) => {
    if (!window.confirm(t('trial.requestRefund'))) return;
    try {
      await axios.post(`/api/bookings/${bookingId}/trial-refund`);
      toast.success(t('trial.refundSuccess'));
      // Refresh bookings
      const res = await axios.get('/api/bookings/my');
      setBookings(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || t('trial.refundError'));
    }
  };

  const handleDashboardPost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await axios.post('/api/posts', { content: newPost, media: newPostMedia ? [newPostMedia] : [] });
      setNewPost('');
      setNewPostMedia('');
    } catch {} finally { setPosting(false); }
  };

  // Trial stats
  const trialBookings = bookings.filter(b => b.isTrial);
  const trialUniqueStudents = [...new Set(trialBookings.map(b => String(b.student?._id || b.student)))];
  const returningTrialStudents = trialUniqueStudents.filter(id =>
    bookings.some(b => !b.isTrial && String(b.student?._id || b.student) === id)
  );
  const trialConversionRate = trialUniqueStudents.length > 0
    ? Math.round(returningTrialStudents.length / trialUniqueStudents.length * 100) : 0;
  const trialRevenue = trialBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const trialRefunded = trialBookings.filter(b => b.trialRefunded).length;
  const trialRefundRate = trialBookings.length > 0
    ? Math.round(trialRefunded / trialBookings.length * 100) : 0;

  const counts = {
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const avgRating = tutorProfile?.rating || 0;

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthlyData = months.map((m, i) => ({
    month: m,
    count: bookings.filter((b) => new Date(b.date).getMonth() === i).length,
  }));
  const pendingNotifications = notifications.filter((n) => !n.read);

  const quickActions = [
    { icon: FaSearch, label: t('dashboard.findTutor'), to: '/tutors', desc: t('dashboard.browseTutors'), gradient: 'from-primary-500 to-emerald-600', shadow: 'shadow-primary-500/20' },
    { icon: FaUserPlus, label: user?.role === 'tutor' ? t('dashboard.editProfile') : t('nav.becomeTutor'), to: '/become-tutor', desc: user?.role === 'tutor' ? t('dashboard.updateInfo') : t('dashboard.registerAsTutor'), gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { icon: FaComments, label: t('nav.chat'), to: '/chat', desc: t('dashboard.chatWithTutors'), gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
    { icon: FaChartBar, label: t('dashboard.reports'), to: '/dashboard', desc: t('dashboard.statsAndProgress'), gradient: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/20' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('nav.dashboard')} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" radius="2xl" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('dashboard.welcome', { name: user?.name })}</h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user?.role === 'tutor' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'}`}>
                {user?.role === 'tutor' ? t('dashboard.tutor') : t('dashboard.student')}
              </span>
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/chat" className="relative p-2.5 rounded-xl bg-white border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary-500 hover:border-primary-200 transition shadow-sm">
            <FaComments className="text-lg" />
            {conversations.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {conversations.length > 9 ? '9+' : conversations.length}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowAllNotifications(!showAllNotifications)}
              className="relative p-2.5 rounded-xl bg-white border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary-500 hover:border-primary-200 transition shadow-sm"
            >
              <FaBell className="text-lg" />
              {pendingNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {pendingNotifications.length > 9 ? '9+' : pendingNotifications.length}
                </span>
              )}
            </button>
            {showAllNotifications && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">الإشعارات</h3>
                  <button onClick={() => setShowAllNotifications(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-slate-400 py-6 text-sm">لا توجد إشعارات</p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div key={n._id} className={`p-3 border-b border-slate-50 dark:border-slate-800/50 text-sm cursor-pointer transition ${n.read ? 'opacity-60' : 'bg-primary-50/30'}`}>
                        <p className={`text-slate-800 dark:text-slate-200 ${n.read ? 'font-normal' : 'font-semibold'}`}>{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString('ar-AE')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaHourglassHalf} label="قيد الانتظار" value={counts.pending} color="text-yellow-600" bg="bg-yellow-50" animate />
        <StatCard icon={FaCheckCircle} label="مؤكدة" value={counts.confirmed} color="text-emerald-600" bg="bg-emerald-50" animate />
        <StatCard icon={FaChartLine} label="مكتملة" value={counts.completed} color="text-blue-600" bg="bg-blue-50" animate />
        <StatCard icon={FaTimesCircle} label="ملغية" value={counts.cancelled} color="text-red-600" bg="bg-red-50" animate />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((item, i) => (
          <Link key={i} to={item.to} className="group block">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-5 transition-all duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5">
              <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg ${item.shadow} transition-transform duration-200 group-hover:scale-110`}>
                <item.icon className="text-white text-sm" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{item.label}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Student Stats */}
      {user?.role !== 'tutor' && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> المواد الأكثر حجزاً
            </h3>
            <div className="space-y-3">
              {Object.entries(
                bookings.reduce((acc, b) => {
                  acc[b.subject] = (acc[b.subject] || 0) + 1;
                  return acc;
                }, {})
              ).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{subject}</span>
                  <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2.5 py-0.5 rounded-lg">{count} حجز</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FaUsers className="text-primary-500" /> آخر المدرّسين تواصلاً
            </h3>
            <div className="space-y-3">
              {conversations.slice(0, 4).map((c) => (
                <div key={c._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <Avatar name={c.otherUser?.name} size="sm" radius="full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{c.otherUser?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.text}</p>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <EmptyState
                  illustration="message"
                  title="لا توجد محادثات بعد"
                  description="تواصل مع المدرّسين لبدء محادثة"
                  className="!py-8"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tutor Profile Section */}
      {user?.role === 'tutor' && (
        <>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <FaChalkboardTeacher className="text-primary-500" /> الملف الشخصي للمدرّس
              </h2>
              <Link to="/become-tutor" className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-semibold transition">
                <FiEdit3 /> تعديل
              </Link>
            </div>
            {loading.profile ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                    <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3 mb-2" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : tutorProfile ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {[
                    { label: 'السعر', value: `${tutorProfile.ratePerHour} درهم/ساعة`, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'الموقع', value: tutorProfile.area ? `${tutorProfile.emirate} - ${tutorProfile.area}` : tutorProfile.emirate, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'التقييم', value: `${tutorProfile.rating?.toFixed(1)} ★`, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'المواد', value: tutorProfile.subjects?.length || 0, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'الإجمالي', value: `${totalRevenue} درهم`, color: 'text-rose-600', bg: 'bg-rose-50' },
                  ].map((item, i) => (
                    <div key={i} className={`${item.bg} rounded-xl p-4 border border-slate-100 dark:border-slate-700`}>
                      <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                      <p className={`font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">الحالة:</span>
                  <span className={`flex items-center gap-1.5 font-semibold ${tutorProfile.isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${tutorProfile.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {tutorProfile.isAvailable ? 'متاح للحجوزات' : 'غير متاح'}
                  </span>
                </div>
              </>
            ) : (
              <EmptyState
                illustration="profile"
                title="لا يوجد ملف تعريف بعد"
                description="سجّل كمدرّس وابدأ باستقبال الحجوزات من الطلاب"
                actionLabel="أنشئ ملفك الآن"
                actionTo="/become-tutor"
              />
            )}
          </div>

          {/* Revenue & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FaMoneyBillWave className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">الإيرادات</h3>
                  <p className="text-xs text-slate-400">إجمالي الأرباح من الحجوزات</p>
                </div>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <p className="text-3xl font-extrabold text-emerald-600">{totalRevenue}</p>
                <p className="text-slate-400 mb-1.5">درهم</p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-500/10 rounded-xl px-3 py-2">
                <FaArrowUp className="text-emerald-500 text-xs" />
                <span className="font-semibold text-emerald-600">{counts.completed}</span>
                <span className="text-slate-500 dark:text-slate-400">حجوزات مكتملة</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <FaStar className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">التقييم</h3>
                  <p className="text-xs text-slate-400">تقييم المدرّس من الطلاب</p>
                </div>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <p className="text-3xl font-extrabold text-yellow-500">{avgRating.toFixed(1)}</p>
                <p className="text-slate-400 mb-1.5">من 5.0</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl px-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className={star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'} />
                ))}
                <span className="text-slate-500 dark:text-slate-400 text-sm mr-2">({tutorProfile?.reviewCount || 0} تقييم)</span>
              </div>
            </div>
          </div>

          {/* Trial Stats */}
          {trialBookings.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <FaStar className="text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">إحصائيات الحصص التجريبية</h3>
                  <p className="text-xs text-slate-400">مستوحى من Preply — تتبع أداء الحصص التجريبية</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50/50 dark:bg-amber-500/5 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mb-1 flex items-center gap-1">
                    <FaStar className="text-[10px]" /> حصص تجريبية
                  </p>
                  <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{trialBookings.length}</p>
                  <p className="text-[11px] text-amber-500/60 mt-0.5">إجمالي الحصص التجريبية</p>
                </div>
                <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50">
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-1 flex items-center gap-1">
                    <FaArrowUp className="text-[10px]" /> معدل التحويل
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{trialConversionRate}%</p>
                  <p className="text-[11px] text-emerald-500/60 mt-0.5">{returningTrialStudents.length} من {trialUniqueStudents.length} طالب حجز مرة أخرى</p>
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-500/5 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mb-1 flex items-center gap-1">
                    <FaMoneyBillWave className="text-[10px]" /> إيرادات التجريبية
                  </p>
                  <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{trialRevenue}</p>
                  <p className="text-[11px] text-blue-500/60 mt-0.5">درهم من الحصص المكتملة</p>
                </div>
                <div className="bg-rose-50/50 dark:bg-rose-500/5 rounded-xl p-4 border border-rose-100 dark:border-rose-800/50">
                  <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mb-1 flex items-center gap-1">
                    <FaShieldAlt className="text-[10px]" /> طلبات الاسترداد
                  </p>
                  <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{trialRefunded}</p>
                  <p className={`text-[11px] ${trialRefundRate > 30 ? 'text-rose-500/80' : 'text-rose-500/60'} mt-0.5`}>
                    {trialRefundRate}% معدل الاسترداد
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {user?.role === 'tutor' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FaRss className="text-primary-500" /> منشور جديد
            </h2>
            <Link to="/feed" className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition">عرض الكل ←</Link>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="ما الجديد؟ شارك منشوراً مع طلابك..."
            rows={2}
            className="input-field resize-none text-sm mb-3"
          />
          {newPostMedia && (
            <div className="relative mb-3">
              <img src={newPostMedia} alt="" className="w-full h-32 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
              <button onClick={() => setNewPostMedia('')} className="absolute top-2 left-2 w-6 h-6 bg-black/40 text-white rounded-full text-xs">X</button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={newPostMedia}
              onChange={(e) => setNewPostMedia(e.target.value)}
              placeholder="رابط صورة..."
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-transparent w-full sm:w-48 text-slate-500"
            />
            <button onClick={handleDashboardPost} disabled={!newPost.trim() || posting} className="btn-primary !py-1.5 !px-4 text-sm flex items-center gap-1.5">
              {posting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPaperPlane />}
              نشر
            </button>
          </div>
        </div>
      )}

      {/* Academic Records */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <FaBookOpen className="text-primary-500" /> المتابعة المدرسية
            <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">({records.length})</span>
          </h2>
          <button onClick={() => { setEditingRecord(null); setRecordForm({ subject: '', grade: '', maxGrade: '100', notes: '' }); setShowRecordForm(!showRecordForm); }} className="btn-primary !py-1.5 !px-3 text-sm flex items-center gap-1.5">
            <FaPlusCircle /> إضافة مادة
          </button>
        </div>

        {showRecordForm && (
          <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleRecordSubmit} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 mb-4 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">المادة</label>
                <input type="text" value={recordForm.subject} onChange={(e) => setRecordForm({ ...recordForm, subject: e.target.value })} className="input-field" placeholder="مثال: رياضيات" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">الدرجة</label>
                <input type="number" value={recordForm.grade} onChange={(e) => setRecordForm({ ...recordForm, grade: e.target.value })} className="input-field" placeholder="85" min="0" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">الدرجة القصوى</label>
                <input type="number" value={recordForm.maxGrade} onChange={(e) => setRecordForm({ ...recordForm, maxGrade: e.target.value })} className="input-field" placeholder="100" min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">ملاحظات</label>
                <input type="text" value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} className="input-field" placeholder="اختياري" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">{editingRecord ? 'حفظ التعديل' : 'إضافة'}</button>
              <button type="button" onClick={() => { setShowRecordForm(false); setEditingRecord(null); }} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">إلغاء</button>
            </div>
          </motion.form>
        )}

        {records.length === 0 ? (
          <EmptyState
            illustration="records"
            title="لا توجد سجلات أكاديمية بعد"
            description="أضف موادك الدراسية ودرجاتك لتتبع تقدمك الأكاديمي"
          />
        ) : (
          <>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="text-right py-2 px-2 font-semibold">المادة</th>
                    <th className="text-right py-2 px-2 font-semibold">الدرجة</th>
                    <th className="text-right py-2 px-2 font-semibold">النسبة</th>
                    <th className="text-right py-2 px-2 font-semibold">ملاحظات</th>
                    <th className="py-2 px-2" />
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => {
                    const pct = rec.maxGrade ? Math.round((rec.grade / rec.maxGrade) * 100) : 0;
                    return (
                      <tr key={rec._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">{rec.subject}</td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{rec.grade}{rec.maxGrade ? ` / ${rec.maxGrade}` : ''}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={`font-bold text-xs ${pct >= 85 ? 'text-emerald-600' : pct >= 70 ? 'text-yellow-600' : 'text-red-500'}`}>{pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-400 dark:text-slate-500 text-xs max-w-[120px] truncate">{rec.notes || '-'}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditRecord(rec)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition" title="تعديل"><FaEdit /></button>
                            <button onClick={() => handleDeleteRecord(rec._id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition" title="حذف"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
              <span className="text-slate-400 dark:text-slate-500">المعدل العام:</span>
              <span className={`font-bold text-lg ${(() => { const a = records.reduce((s, r) => s + (r.maxGrade ? (r.grade / r.maxGrade) * 100 : 0), 0) / records.length; return a >= 85 ? 'text-emerald-600' : a >= 70 ? 'text-yellow-600' : 'text-red-500'; })()}`}>
                {Math.round(records.reduce((s, r) => s + (r.maxGrade ? (r.grade / r.maxGrade) * 100 : 0), 0) / records.length)}%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Monthly Booking Trends */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <FaCalendarAlt className="text-primary-500" /> الحجوزات الشهرية
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} labelStyle={{ fontWeight: 'bold', color: '#1e293b' }} formatter={(value) => [`${value} حجز`, '']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#10b981" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <FaBookmark className="text-primary-500" /> الحجوزات
          <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">({bookings.length})</span>
        </h2>
        {loading.bookings ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            illustration="booking"
            title="لا توجد حجوزات بعد"
            description="ابدأ بالبحث عن مدرّس يناسب احتياجاتك واحجز جلستك الأولى"
            actionLabel="ابحث عن مدرّس"
            actionTo="/tutors"
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const config = statusConfig[b.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const progress = statusProgress[b.status] || 0;
              return (
                <div key={b._id} className={`rounded-2xl overflow-hidden border ${config.border} transition hover:shadow-md`}>
                  <div className={`${config.bg} p-4`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`${config.color}`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{b.subject}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {user?.role === 'tutor' ? `الطالب: ${b.student?.name}` : `المدرّس: ${b.tutor?.user?.name}`}
                            <span className="mx-1.5">•</span>
                            {b.tutor?.area ? `${b.tutor.emirate} - ${b.tutor.area}` : b.tutor?.emirate}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1">📅 {new Date(b.date).toLocaleDateString('ar-AE')}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">⏱ {b.duration} ساعة</span>
                            <span className={`text-xs font-bold ${config.color}`}>💰 {b.totalAmount} درهم</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${config.border} ${config.color} ${config.bg}`}>
                          {config.label}
                        </span>
                        {user?.role === 'tutor' && b.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => updateStatus(b._id, 'confirmed')} className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition shadow-sm">قبول</button>
                            <button onClick={() => updateStatus(b._id, 'cancelled')} className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-sm">رفض</button>
                          </div>
                        )}
                        {user?.role !== 'tutor' && b.isTrial && !b.trialRefunded && b.status !== 'cancelled' && (
                          <button onClick={() => handleTrialRefund(b._id)}
                            className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-sm flex items-center gap-1">
                            <FaShieldAlt className="text-[10px]" /> {t('trial.requestRefund')}
                          </button>
                        )}
                        {b.isTrial && b.trialRefunded && (
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
                            {t('trial.satisfactionGuaranteed')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${config.bar}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

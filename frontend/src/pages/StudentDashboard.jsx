import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaBookOpen, FaChalkboardTeacher, FaStar, FaClock,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaChartLine,
  FaBell, FaComments, FaHeart, FaSearch, FaGraduationCap,
  FaUser, FaArrowLeft, FaTrophy, FaBookmark, FaMoneyBillWave,
  FaLayerGroup, FaClipboardCheck, FaArrowUp, FaArrowDown,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TutorCard from '../components/TutorCard';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400', bar: 'bg-amber-400', label: 'قيد الانتظار', icon: FaHourglassHalf },
  confirmed: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400', bar: 'bg-emerald-400', label: 'مؤكدة', icon: FaCheckCircle },
  completed: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400', bar: 'bg-blue-400', label: 'مكتملة', icon: FaCheckCircle },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-400', bar: 'bg-red-400', label: 'ملغية', icon: FaTimesCircle },
};

const levelIcons = {
  مبتدئ: { icon: FaArrowDown, color: 'text-blue-500', bg: 'bg-blue-50' },
  متوسط: { icon: FaLayerGroup, color: 'text-amber-500', bg: 'bg-amber-50' },
  متقدم: { icon: FaArrowUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
};

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [records, setRecords] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState({ bookings: true, records: true, favorites: true });
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    axios.get('/api/bookings/my').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, bookings: false })));
    axios.get('/api/academic').then(r => setRecords(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, records: false })));
    axios.get('/api/favorites').then(r => {
      if (r.data?.length) {
        Promise.all(r.data.map(id => axios.get(`/api/tutors/${id}`).then(r => r.data).catch(() => null)))
          .then(tutors => setFavorites(tutors.filter(Boolean)));
      }
    }).catch(() => {}).finally(() => setLoading(p => ({ ...p, favorites: false })));
  }, []);

  const counts = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const totalSpent = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.totalAmount || 0), 0);
  const levelTests = records.filter(r => r.subject?.includes('تحديد مستوى'));
  const upcoming = bookings.filter(b => b.status === 'confirmed').sort((a, b) => new Date(a.date) - new Date(b.date));

  const tabs = [
    { key: 'bookings', label: 'الحجوزات', icon: FaClock },
    { key: 'levels', label: 'تحديد المستوى', icon: FaGraduationCap },
    { key: 'records', label: 'المتابعة المدرسية', icon: FaBookOpen },
    { key: 'favorites', label: 'المدرّسون المفضلون', icon: FaHeart },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title="لوحة الطالب" />

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-emerald-600/5" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name} size="lg" radius="2xl" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                  مرحباً، {user?.name}
                </h1>
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-bold">
                    طالب
                  </span>
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/chat" className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-primary-500 hover:border-primary-200 transition shadow-sm">
                <FaComments className="text-sm" />
              </Link>
              <Link to="/level-test" className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
                <FaGraduationCap /> اختبار تحديد المستوى
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FaClock} label="الحجوزات" value={bookings.length} color="text-primary-600" bg="bg-primary-50" animate />
          <StatCard icon={FaCheckCircle} label="مؤكدة" value={counts.confirmed} color="text-emerald-600" bg="bg-emerald-50" animate />
          <StatCard icon={FaHourglassHalf} label="قيد الانتظار" value={counts.pending} color="text-amber-600" bg="bg-amber-50" animate />
          <StatCard icon={FaMoneyBillWave} label="المصروف" value={`${totalSpent} درهم`} color="text-violet-600" bg="bg-violet-50" animate />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FaSearch, label: 'ابحث عن مدرّس', to: '/tutors', desc: 'تصفح المدرّسين', from: 'from-primary-500', to_: 'to-emerald-600', shadow: 'shadow-primary-500/20' },
            { icon: FaGraduationCap, label: 'اختبار المستوى', to: '/level-test', desc: 'حدد مستواك', from: 'from-amber-500', to_: 'to-orange-600', shadow: 'shadow-amber-500/20' },
            { icon: FaComments, label: 'المراسلات', to: '/chat', desc: 'تواصل مع المدرّسين', from: 'from-violet-500', to_: 'to-purple-600', shadow: 'shadow-violet-500/20' },
            { icon: FaUser, label: 'الملف الشخصي', to: '/profile', desc: 'بياناتك', from: 'from-blue-500', to_: 'to-cyan-600', shadow: 'shadow-blue-500/20' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="group block">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
                <div className={`w-11 h-11 bg-gradient-to-br ${item.from} ${item.to_} rounded-xl flex items-center justify-center mb-3 shadow-lg ${item.shadow} transition-transform duration-200 group-hover:scale-110`}>
                  <item.icon className="text-white text-sm" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-0.5">{item.label}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar bg-slate-50 p-1 rounded-2xl" dir="ltr">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`text-xs ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          {activeTab === 'bookings' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FaClock className="text-primary-500 text-sm" />
                  الحجوزات
                  <span className="text-slate-400 text-sm font-normal">({bookings.length})</span>
                </h2>
                {upcoming.length > 0 && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg font-semibold">
                    {upcoming.length} حجز قادم
                  </span>
                )}
              </div>
              {loading.bookings ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-1/3" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <EmptyState illustration="booking" title="لا توجد حجوزات بعد" description="ابدأ بالبحث عن مدرّس واحجز جلستك الأولى" actionLabel="ابحث عن مدرّس" actionTo="/tutors" />
              ) : (
                <div className="space-y-3">
                  {bookings.map(b => {
                    const cfg = statusConfig[b.status] || statusConfig.pending;
                    const Icon = cfg.icon;
                    return (
                      <div key={b._id} className={`rounded-2xl border ${cfg.border} overflow-hidden transition hover:shadow-sm`}>
                        <div className={`${cfg.bg} p-4`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                                <Icon className={cfg.color} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900">{b.subject}</p>
                                <p className="text-sm text-slate-500 truncate">
                                  المدرّس: {b.tutor?.user?.name || b.tutor?.name || 'غير معروف'}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                  <span className="text-xs text-slate-400">📅 {new Date(b.date).toLocaleDateString('ar-AE')}</span>
                                  <span className="text-xs text-slate-400">⏱ {b.duration} ساعة</span>
                                  <span className={`text-xs font-bold ${cfg.color}`}>💰 {b.totalAmount} درهم</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${cfg.border} ${cfg.color} ${cfg.bg} shrink-0`}>
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'levels' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FaGraduationCap className="text-primary-500 text-sm" />
                  نتائج تحديد المستوى
                  <span className="text-slate-400 text-sm font-normal">({levelTests.length})</span>
                </h2>
                <Link to="/level-test" className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                  <FaGraduationCap /> اختبار جديد
                </Link>
              </div>
              {loading.records ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : levelTests.length === 0 ? (
                <EmptyState illustration="records" title="لم تخضع لاختبار تحديد مستوى بعد" description="اختبر مستواك في المواد التي تريدها لتحصل على توصيات مناسبة" actionLabel="ابدأ الاختبار الآن" actionTo="/level-test" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {levelTests.map(rec => {
                    const pct = rec.maxGrade ? Math.round((rec.grade / rec.maxGrade) * 100) : 0;
                    const subjectRaw = rec.subject.replace(' - تحديد مستوى', '').replace(` (${rec.notes?.split('المستوى: ')[1]?.split(')')[0] || ''})`, '');
                    const levelMatch = rec.notes?.match(/المستوى: (.+?) -/);
                    const level = levelMatch ? levelMatch[1] : 'مبتدئ';
                    const lvl = levelIcons[level] || levelIcons.مبتدئ;
                    const LvlIcon = lvl.icon;
                    return (
                      <div key={rec._id} className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              <FaGraduationCap className="text-primary-500" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{subjectRaw}</p>
                              <p className="text-xs text-slate-400">{new Date(rec.createdAt).toLocaleDateString('ar-AE')}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${lvl.bg}`}>
                            <LvlIcon className={`text-xs ${lvl.color}`} />
                            <span className={`font-bold text-sm ${lvl.color}`}>{level}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-slate-500">النتيجة</span>
                              <span className="font-bold text-slate-700">{rec.grade} / {rec.maxGrade}</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="text-center shrink-0">
                            <p className="text-2xl font-extrabold text-slate-900">{pct}%</p>
                            <p className="text-[10px] text-slate-400">النسبة</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'records' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FaBookOpen className="text-primary-500 text-sm" />
                  المتابعة المدرسية
                  <span className="text-slate-400 text-sm font-normal">({records.length})</span>
                </h2>
                <Link to="/dashboard" className="text-sm text-primary-500 hover:text-primary-600 font-semibold">
                  إدارة السجلات
                </Link>
              </div>
              {loading.records ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : records.length === 0 ? (
                <EmptyState illustration="records" title="لا توجد سجلات أكاديمية بعد" description="أضف موادك الدراسية ودرجاتك من لوحة التحكم" actionLabel="لوحة التحكم" actionTo="/dashboard" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="text-right py-2 px-2 font-semibold">المادة</th>
                        <th className="text-right py-2 px-2 font-semibold">الدرجة</th>
                        <th className="text-right py-2 px-2 font-semibold">النسبة</th>
                        <th className="text-right py-2 px-2 font-semibold">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(rec => {
                        const pct = rec.maxGrade ? Math.round((rec.grade / rec.maxGrade) * 100) : 0;
                        return (
                          <tr key={rec._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                            <td className="py-3 px-2 font-semibold text-slate-800">{rec.subject}</td>
                            <td className="py-3 px-2 text-slate-600">{rec.grade}{rec.maxGrade ? ` / ${rec.maxGrade}` : ''}</td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className={`font-bold text-xs ${pct >= 85 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-slate-400 text-xs max-w-[120px] truncate">{rec.notes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FaHeart className="text-red-500 text-sm" />
                  المدرّسون المفضلون
                  <span className="text-slate-400 text-sm font-normal">({favorites.length})</span>
                </h2>
              </div>
              {loading.favorites ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-2/3" />
                          <div className="h-3 bg-slate-200 rounded w-1/3" />
                        </div>
                      </div>
                      <div className="h-3 bg-slate-200 rounded w-full mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : favorites.length === 0 ? (
                <EmptyState illustration="profile" title="لا يوجد مدرّسون مفضلون بعد" description="أضف مدرّسين إلى مفضلتهم لمتابعتهم بسهولة" actionLabel="تصفح المدرّسين" actionTo="/tutors" />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(tutor => (
                    <TutorCard key={tutor._id} tutor={tutor} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaUsers, FaChalkboardTeacher, FaBookmark, FaMoneyBillWave,
  FaUserCheck, FaTrash, FaCheckCircle, FaTimesCircle, FaBan,
  FaSearch, FaExclamationTriangle, FaChartLine, FaSpinner,
  FaUniversity, FaCheckDouble, FaCog, FaSave, FaPercent,
} from 'react-icons/fa';
import SEO from '../components/SEO';

const tabs = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: FaChartLine },
  { id: 'users', label: 'المستخدمين', icon: FaUsers },
  { id: 'tutors', label: 'المدرسين', icon: FaChalkboardTeacher },
  { id: 'bookings', label: 'الحجوزات', icon: FaBookmark },
  { id: 'payments', label: 'المدفوعات', icon: FaMoneyBillWave },
  { id: 'settings', label: 'الإعدادات', icon: FaCog },
];

function Spinner() {
  return <div className="text-center py-16"><FaSpinner className="animate-spin text-3xl text-primary-500 mx-auto mb-3" /><p className="text-slate-400">جاري التحميل...</p></div>;
}

function Empty() {
  return <div className="text-center py-16 text-slate-400"><FaExclamationTriangle className="text-3xl mx-auto mb-3 opacity-50" /><p>لا توجد نتائج</p></div>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState(null);
  const [feePercentInput, setFeePercentInput] = useState(15);
  const [savingSettings, setSavingSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({ dashboard: false, users: false, tutors: false, bookings: false, payments: false, settings: false });

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  useEffect(() => {
    if (activeTab === 'dashboard' && !stats) {
      setLoading(p => ({ ...p, dashboard: true }));
      axios.get('/api/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, dashboard: false })));
    }
    if (activeTab === 'users' && users.length === 0) {
      setLoading(p => ({ ...p, users: true }));
      axios.get('/api/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, users: false })));
    }
    if (activeTab === 'tutors' && tutors.length === 0) {
      setLoading(p => ({ ...p, tutors: true }));
      axios.get('/api/admin/tutors').then(r => setTutors(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, tutors: false })));
    }
    if (activeTab === 'bookings' && bookings.length === 0) {
      setLoading(p => ({ ...p, bookings: true }));
      axios.get('/api/admin/bookings').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, bookings: false })));
    }
    if (activeTab === 'payments' && payments.length === 0) {
      setLoading(p => ({ ...p, payments: true }));
      axios.get('/api/admin/payments').then(r => setPayments(r.data)).catch(() => {}).finally(() => setLoading(p => ({ ...p, payments: false })));
    }
    if (activeTab === 'settings') {
      loadSettings();
    }
  }, [activeTab]);

  const loadSettings = () => {
    setLoading(p => ({ ...p, settings: true }));
    axios.get('/api/admin/settings').then(r => {
      setSettings(r.data);
      setFeePercentInput(r.data.platformFeePercent || 15);
    }).catch(() => {}).finally(() => setLoading(p => ({ ...p, settings: false })));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await axios.put('/api/admin/settings', { platformFeePercent: Number(feePercentInput) });
      setSettings(res.data);
      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حفظ الإعدادات');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    await axios.delete('/api/admin/users/' + id);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleApproveTutor = async (id) => {
    await axios.put('/api/admin/tutors/' + id + '/approve');
    setTutors(tutors.map(t => t._id === id ? { ...t, isVerified: true } : t));
  };

  const handleDeleteTutor = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المدرّس؟')) return;
    await axios.delete('/api/admin/tutors/' + id);
    setTutors(tutors.filter(t => t._id !== id));
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('هل تريد إلغاء هذا الحجز؟')) return;
    await axios.put('/api/admin/bookings/' + id + '/cancel');
    setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
  };

  const handleConfirmTransfer = async (id) => {
    if (!confirm('تأكيد استلام التحويل البنكي؟')) return;
    try {
      await axios.put('/api/admin/payments/' + id + '/confirm-transfer');
      const res = await axios.get('/api/admin/payments');
      setPayments(res.data);
    } catch {}
  };

  const searchLower = search.toLowerCase();
  const filteredUsers = users.filter(u => (u.name || '').toLowerCase().includes(searchLower) || (u.email || '').toLowerCase().includes(searchLower));
  const filteredTutors = tutors.filter(t => {
    const name = (t.userData && t.userData.name) || '';
    if (name.toLowerCase().includes(searchLower)) return true;
    if (t.subjects && t.subjects.some(s => s.includes(search))) return true;
    return false;
  });
  const filteredBookings = bookings.filter(b => {
    if ((b.subject || '').includes(search)) return true;
    if ((b.studentName || '').includes(search)) return true;
    if ((b.tutorName || '').includes(search)) return true;
    return false;
  });
  const filteredPayments = payments.filter(p => {
    if ((p.studentName || '').includes(search)) return true;
    if ((p.tutorName || '').includes(search)) return true;
    if ((p.method || '').includes(search)) return true;
    if ((p.status || '').includes(search)) return true;
    return false;
  });

  function badgeClass(status) {
    if (status === 'confirmed') return 'bg-green-50 text-green-600';
    if (status === 'pending') return 'bg-yellow-50 text-yellow-600';
    if (status === 'cancelled') return 'bg-red-50 text-red-500';
    return 'bg-blue-50 text-blue-600';
  }

  function statusText(status) {
    if (status === 'confirmed') return 'مؤكد';
    if (status === 'pending') return 'قيد الانتظار';
    if (status === 'cancelled') return 'ملغي';
    return 'مكتمل';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <SEO title="لوحة الإدارة" />
      <h1 className="text-2xl font-bold text-slate-900 mb-6">لوحة الإدارة</h1>

      <div className="flex gap-1 mb-8 border-b border-slate-100 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ' + (activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >
            <tab.icon className="text-xs" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        loading.dashboard ? <Spinner /> : !stats ? <Empty /> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
                <FaUsers className="text-primary-500 text-lg mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                <p className="text-xs text-slate-500">طالب</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
                <FaChalkboardTeacher className="text-primary-500 text-lg mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats.totalTutors}</p>
                <p className="text-xs text-slate-500">مدرّس</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
                <FaBookmark className="text-primary-500 text-lg mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
                <p className="text-xs text-slate-500">حجز</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
                <FaMoneyBillWave className="text-primary-500 text-lg mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats.totalRevenue}</p>
                <p className="text-xs text-slate-500">درهم إيرادات</p>
              </div>
              <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-card">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
                  <FaMoneyBillWave className="text-amber-500 text-lg" />
                </div>
                <p className="text-2xl font-bold text-amber-600">{stats.platformRevenue}</p>
                <p className="text-xs text-slate-500">درهم أرباح المنصة ({settings?.platformFeePercent || 15}%)</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
                <FaUserCheck className="text-primary-500 text-lg mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats.pendingTutors}</p>
                <p className="text-xs text-slate-500">بانتظار التوثيق</p>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-4">آخر الحجوزات</h2>
              {stats.recentBookings.length === 0 ? <p className="text-slate-400 text-sm">لا توجد حجوزات حديثة</p> : (
                <div className="space-y-2">
                  {stats.recentBookings.map(b => (
                    <div key={b._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                      <div>
                        <span className="font-medium text-slate-800">{b.subject}</span>
                        <span className="text-slate-400 mx-2">-</span>
                        <span className="text-slate-500">{b.studentName || 'طالب'}</span>
                        <span className="text-slate-300 mx-1">→</span>
                        <span className="text-slate-500">{b.tutorName || 'مدرّس'}</span>
                      </div>
                      <span className={'badge ' + badgeClass(b.status)}>
                        {statusText(b.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )
      )}

      {activeTab === 'users' && (
        <>
          <div className="mb-4">
            <div className="relative max-w-xs">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pr-10" placeholder="بحث عن مستخدم..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading.users ? <Spinner /> : filteredUsers.length === 0 ? <Empty /> : (
            <div className="card overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <div key={u._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">{u.name?.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge text-xs bg-slate-100 text-slate-500">{u.role === 'tutor' ? 'مدرّس' : u.role === 'admin' ? 'مشرف' : 'طالب'}</span>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition" title="حذف">
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'tutors' && (
        <>
          <div className="mb-4">
            <div className="relative max-w-xs">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pr-10" placeholder="بحث عن مدرّس..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading.tutors ? <Spinner /> : filteredTutors.length === 0 ? <Empty /> : (
            <div className="card overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredTutors.map(t => (
                  <div key={t._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">{t.userData?.name?.charAt(0) || 'م'}</div>
                      <div>
                        <p className="font-medium text-slate-800">{t.userData?.name || 'مدرّس'}</p>
                        <p className="text-xs text-slate-400">{t.emirate} • {t.ratePerHour} درهم/ساعة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={'badge text-xs ' + (t.isVerified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600')}>
                        {t.isVerified ? 'موثّق' : 'غير موثّق'}
                      </span>
                      {!t.isVerified && (
                        <button onClick={() => handleApproveTutor(t._id)} className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition" title="توثيق">
                          <FaCheckCircle />
                        </button>
                      )}
                      <button onClick={() => handleDeleteTutor(t._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition" title="حذف">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'bookings' && (
        <>
          <div className="mb-4">
            <div className="relative max-w-xs">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pr-10" placeholder="بحث عن حجز..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading.bookings ? <Spinner /> : filteredBookings.length === 0 ? <Empty /> : (
            <div className="card overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredBookings.map(b => (
                  <div key={b._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                    <div>
                      <p className="font-medium text-slate-800">{b.subject}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {b.studentName || 'طالب'} ← {b.tutorName || 'مدرّس'}
                        <span className="mx-1.5">•</span>
                        {b.totalAmount} درهم
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={'badge text-xs ' + badgeClass(b.status)}>
                        {statusText(b.status)}
                      </span>
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button onClick={() => handleCancelBooking(b._id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition" title="إلغاء">
                          <FaTimesCircle />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'payments' && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative max-w-xs flex-1">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pr-10" placeholder="بحث عن دفعة..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {payments.filter(p => p.status === 'pending_transfer').length > 0 && (
              <span className="badge bg-blue-50 text-blue-600 text-xs flex items-center gap-1">
                <FaUniversity /> {payments.filter(p => p.status === 'pending_transfer').length} تحويل بانظار التأكيد
              </span>
            )}
          </div>
          {loading.payments ? <Spinner /> : filteredPayments.length === 0 ? <Empty /> : (
            <div className="card overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredPayments.map(p => (
                  <div key={p._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        p.method === 'bank_transfer' ? 'bg-blue-50 text-blue-600' : 'bg-primary-50 text-primary-600'
                      }`}>
                        {p.method === 'bank_transfer' ? <FaUniversity className="text-sm" /> : <FaMoneyBillWave className="text-sm" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{p.subject || 'حجز'}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {p.studentName || 'طالب'} ← {p.tutorName || 'مدرّس'}
                          <span className="mx-1.5">•</span>
                          {p.amount} درهم
                          <span className="mx-1.5">•</span>
                          <span className="text-[11px]">{p.method === 'bank_transfer' ? 'تحويل بنكي' : 'بطاقة'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mr-3">
                      {p.status === 'pending_transfer' && (
                        <span className="badge text-xs bg-blue-50 text-blue-600 border border-blue-200">بانتظار التأكيد</span>
                      )}
                      {p.status === 'completed' && (
                        <span className="badge text-xs bg-green-50 text-green-600">مكتمل</span>
                      )}
                      {p.status === 'pending' && (
                        <span className="badge text-xs bg-yellow-50 text-yellow-600">قيد الانتظار</span>
                      )}
                      {p.status === 'failed' && (
                        <span className="badge text-xs bg-red-50 text-red-500">فشل</span>
                      )}
                      {p.status === 'pending_transfer' && (
                        <button onClick={() => handleConfirmTransfer(p._id)} className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition" title="تأكيد استلام التحويل">
                          <FaCheckDouble />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'settings' && (
        <>
          {loading.settings ? <Spinner /> : !settings ? <Empty /> : (
            <div className="max-w-xl">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                    <FaCog className="text-primary-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">إعدادات المنصة</h2>
                    <p className="text-xs text-slate-400">تحكم في إعدادات المنصة ونسب الرسوم</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <FaPercent className="text-primary-500 text-xs" />
                      نسبة رسوم المنصة (٪)
                    </label>
                    <p className="text-xs text-slate-400 mb-3">
                      النسبة التي يتم خصمها من كل حجز كرسوم للمنصة. يتم تطبيقها على الحجوزات الجديدة فقط.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        className="input-field w-32 text-center text-lg font-bold"
                        value={feePercentInput}
                        onChange={(e) => setFeePercentInput(e.target.value)}
                      />
                      <span className="text-slate-500 font-medium">%</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="btn-primary flex items-center gap-2 !py-2.5 text-sm"
                      >
                        {savingSettings ? (
                          <><FaSpinner className="animate-spin" /> جاري الحفظ...</>
                        ) : (
                          <><FaSave /> حفظ الإعدادات</>
                        )}
                      </button>
                      {feePercentInput != (settings?.platformFeePercent || 15) && (
                        <span className="text-xs text-amber-500 flex items-center gap-1">
                          <FaExclamationTriangle />
                          لم يتم الحفظ بعد
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">معاينة تأثير التغيير</h3>
                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">مثال: حصة 150 درهم/ساعة لمدة ساعتين</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">المدرّس</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">300 درهم</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">رسوم المنصة ({feePercentInput}%)</span>
                        <span className="font-semibold text-primary-500">{Math.round(300 * feePercentInput / 100)} درهم</span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300">الطالب يدفع</span>
                        <span className="text-lg font-extrabold text-primary-600">{300 + Math.round(300 * feePercentInput / 100)} <span className="text-sm font-medium">درهم</span></span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      <strong>ملاحظة:</strong> التغيير يطبق على الحجوزات الجديدة فقط. الحجوزات الحالية لا تتأثر.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaUsers, FaChalkboardTeacher, FaBookmark, FaMoneyBillWave,
  FaUserCheck, FaTrash, FaCheckCircle, FaTimesCircle,
  FaSearch, FaExclamationTriangle, FaChartLine, FaSpinner,
  FaUniversity, FaCheckDouble, FaCog, FaSave, FaPercent,
  FaNewspaper, FaThumbsUp, FaBan, FaClock, FaCalendarAlt, FaStar,
  FaMapMarkerAlt, FaGraduationCap, FaCreditCard, FaWallet,
  FaCommentDots, FaBuilding, FaUserPlus, FaUserSlash,
  FaHistory, FaTags, FaEnvelope, FaFileExport, FaBullhorn, FaDollarSign, FaFileAlt, FaPlus, FaEdit, FaPaperPlane,
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SEO from '../components/SEO';

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <FaSpinner className="animate-spin text-white text-lg" />
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-4">جاري التحميل...</p>
    </div>
  );
}

function Empty({ text, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {Icon ? <Icon className="text-2xl text-slate-400" /> : <FaExclamationTriangle className="text-2xl text-slate-400" />}
      </div>
      <p className="text-sm text-slate-400">{text || 'لا توجد نتائج'}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  const gradients = {
    blue: 'from-blue-500/10 via-blue-500/5 to-transparent',
    green: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    amber: 'from-amber-500/10 via-amber-500/5 to-transparent',
    purple: 'from-purple-500/10 via-purple-500/5 to-transparent',
    pink: 'from-pink-500/10 via-pink-500/5 to-transparent',
    teal: 'from-teal-500/10 via-teal-500/5 to-transparent',
    indigo: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    red: 'from-red-500/10 via-red-500/5 to-transparent',
  };
  const iconGradients = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-green-600',
    amber: 'from-amber-500 to-orange-600',
    purple: 'from-purple-500 to-violet-600',
    pink: 'from-pink-500 to-rose-600',
    teal: 'from-teal-500 to-cyan-600',
    indigo: 'from-indigo-500 to-blue-600',
    red: 'from-red-500 to-rose-600',
  };
  const glowColors = {
    blue: 'shadow-blue-500/20',
    green: 'shadow-emerald-500/20',
    amber: 'shadow-amber-500/20',
    purple: 'shadow-purple-500/20',
    pink: 'shadow-pink-500/20',
    teal: 'shadow-teal-500/20',
    indigo: 'shadow-indigo-500/20',
    red: 'shadow-red-500/20',
  };
  return (
    <button onClick={onClick} className={`relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group text-start w-full ${glowColors[color] || 'shadow-blue-500/20'} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color] || gradients.blue} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute -top-6 -end-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 tracking-wide mb-1">{label}</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : color === 'green' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : color === 'pink' ? 'bg-pink-500' : color === 'purple' ? 'bg-purple-500' : color === 'teal' ? 'bg-teal-500' : 'bg-blue-500'}`} />{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradients[color] || iconGradients.blue} flex items-center justify-center shadow-lg ${glowColors[color] || 'shadow-blue-500/20'} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
          <Icon className="text-white text-lg" />
        </div>
      </div>
    </button>
  );
}

function Badge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    pending_transfer: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    failed: 'bg-red-50 text-red-600 border-red-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    true: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    false: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const labels = {
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    pending_transfer: 'بانتظار التأكيد',
    cancelled: 'ملغي',
    failed: 'فاشل',
    paid: 'مدفوع',
    active: 'مفعل',
    true: 'موافق',
    false: 'غير موافق',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${styles[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {status === 'completed' || status === 'confirmed' || status === 'true' || status === 'paid' || status === 'active' ? (
        <FaCheckCircle className="text-[10px]" />
      ) : status === 'cancelled' || status === 'failed' ? (
        <FaTimesCircle className="text-[10px]" />
      ) : (
        <FaClock className="text-[10px]" />
      )}
      {labels[status] || status}
    </span>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative max-w-xs">
      <FaSearch className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      <input className="w-full h-10 pe-4 ps-10 text-sm rounded-xl border-2 border-slate-100 bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400" placeholder={placeholder || 'بحث...'} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: FaChartLine },
    { id: 'users', label: 'المستخدمين', icon: FaUsers },
    { id: 'tutors', label: 'المدرّسين', icon: FaChalkboardTeacher },
    { id: 'bookings', label: 'الحجوزات', icon: FaBookmark },
    { id: 'payments', label: 'المدفوعات', icon: FaMoneyBillWave },
    { id: 'reviews', label: 'التقييمات', icon: FaStar },
    { id: 'institutes', label: 'المعاهد', icon: FaBuilding },
    { id: 'posts', label: 'المنشورات', icon: FaNewspaper },
    { id: 'settings', label: 'الإعدادات', icon: FaCog },
    { id: 'charts', label: 'الرسوم البيانية', icon: FaChartLine },
    { id: 'coupons', label: 'الكوبونات', icon: FaTags },
    { id: 'earnings', label: 'مستحقات المدرسين', icon: FaDollarSign },
    { id: 'notifications', label: 'الإشعارات', icon: FaBullhorn },
    { id: 'contact', label: 'طلبات التواصل', icon: FaEnvelope },
    { id: 'content', label: 'إدارة المحتوى', icon: FaFileAlt },
    { id: 'audit', label: 'سجل النشاطات', icon: FaHistory },
    { id: 'export', label: 'تصدير البيانات', icon: FaFileExport },
  ];
  const [activeTab, setActiveTab] = useState('dashboard');
  const isSupport = user?.role === 'support';
  const allowedTabs = isSupport
    ? tabs.filter(t => ['dashboard', 'users', 'bookings', 'contact'].includes(t.id))
    : tabs;
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [feePercentInput, setFeePercentInput] = useState(15);
  const [savingSettings, setSavingSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({});
  const [chartData, setChartData] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [contentPages, setContentPages] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: 10, maxUses: 100, expiresAt: '' });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '', password: '', role: 'student' });
  const [creatingUser, setCreatingUser] = useState(false);
  const [bulkNotif, setBulkNotif] = useState({ message: '', role: 'all', type: 'info' });
  const [newPage, setNewPage] = useState({ slug: '', title: '', content: '', published: false });
  const [editingPage, setEditingPage] = useState(null);

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><FaSpinner className="animate-spin text-4xl text-primary-500" /></div>;
  if (!user || (user.role !== 'admin' && user.role !== 'support')) return <Navigate to="/" />;

  const setLoad = (key) => setLoading(p => ({ ...p, [key]: true }));
  const clearLoad = (key) => setLoading(p => ({ ...p, [key]: false }));

  useEffect(() => {
    if (activeTab === 'dashboard' && !stats) {
      setLoad('dashboard');
      axios.get('/api/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => clearLoad('dashboard'));
    }
    if (activeTab === 'users' && users.length === 0) {
      setLoad('users');
      axios.get('/api/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => clearLoad('users'));
    }
    if (activeTab === 'tutors' && tutors.length === 0) {
      setLoad('tutors');
      axios.get('/api/admin/tutors').then(r => setTutors(r.data)).catch(() => {}).finally(() => clearLoad('tutors'));
    }
    if (activeTab === 'bookings' && bookings.length === 0) {
      setLoad('bookings');
      axios.get('/api/admin/bookings').then(r => setBookings(r.data)).catch(() => {}).finally(() => clearLoad('bookings'));
    }
    if (activeTab === 'payments' && payments.length === 0) {
      setLoad('payments');
      axios.get('/api/admin/payments').then(r => setPayments(r.data)).catch(() => {}).finally(() => clearLoad('payments'));
    }
    if (activeTab === 'posts' && posts.length === 0) {
      setLoad('posts');
      axios.get('/api/admin/posts').then(r => setPosts(r.data)).catch(() => {}).finally(() => clearLoad('posts'));
    }
    if (activeTab === 'reviews' && reviews.length === 0) {
      setLoad('reviews');
      axios.get('/api/admin/reviews').then(r => setReviews(r.data)).catch(() => {}).finally(() => clearLoad('reviews'));
    }
    if (activeTab === 'institutes' && institutes.length === 0) {
      setLoad('institutes');
      axios.get('/api/admin/institutes').then(r => setInstitutes(r.data)).catch(() => {}).finally(() => clearLoad('institutes'));
    }
    if (activeTab === 'settings') {
      setLoad('settings');
      axios.get('/api/admin/settings').then(r => { setSettings(r.data); setFeePercentInput(r.data.platformFeePercent || 15); }).catch(() => {}).finally(() => clearLoad('settings'));
    }
    if (activeTab === 'charts') axios.get('/api/admin/chart-data').then(r => setChartData(r.data)).catch(() => {});
    if (activeTab === 'coupons') axios.get('/api/admin/coupons').then(r => setCoupons(r.data)).catch(() => {});
    if (activeTab === 'earnings') axios.get('/api/admin/tutor-earnings').then(r => setEarnings(r.data)).catch(() => {});
    if (activeTab === 'contact') axios.get('/api/admin/contact-messages').then(r => setContactMessages(r.data)).catch(() => {});
    if (activeTab === 'content') axios.get('/api/admin/content-pages').then(r => setContentPages(r.data)).catch(() => {});
    if (activeTab === 'audit') axios.get('/api/admin/audit-logs').then(r => setAuditLogs(r.data)).catch(() => {});
  }, [activeTab]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await axios.put('/api/admin/settings', { platformFeePercent: Number(feePercentInput) });
      setSettings(res.data);
      toast.success('تم حفظ الإعدادات بنجاح!');
      setStats(null);
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
    setStats(null);
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.password) return toast.error('الاسم ورقم الهاتف وكلمة السر مطلوبة');
    setCreatingUser(true);
    try {
      const r = await axios.post('/api/admin/users', newUser);
      setUsers([r.data.user, ...users]);
      setShowCreateUser(false);
      setNewUser({ name: '', phone: '', password: '', role: 'student' });
      setStats(null);
      toast.success(r.data.message || 'تم إنشاء المستخدم');
    } catch (e) {
      toast.error(e.response?.data?.message || 'فشل إنشاء المستخدم');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleApproveTutor = async (id) => {
    await axios.put('/api/admin/tutors/' + id + '/approve');
    setTutors(tutors.map(t => t._id === id ? { ...t, isVerified: true } : t));
    setStats(null);
    toast.success('تم توثيق المدرّس بنجاح!');
  };

  const handleDeleteTutor = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المدرّس؟')) return;
    await axios.delete('/api/admin/tutors/' + id);
    setTutors(tutors.filter(t => t._id !== id));
    setStats(null);
    toast.success('تم حذف المدرّس');
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('هل تريد إلغاء هذا الحجز؟')) return;
    await axios.put('/api/admin/bookings/' + id + '/cancel');
    setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    setStats(null);
    toast.success('تم إلغاء الحجز');
  };

  const handleConfirmTransfer = async (id) => {
    if (!confirm('تأكيد استلام التحويل البنكي؟')) return;
    try {
      await axios.put('/api/admin/payments/' + id + '/confirm-transfer');
      const res = await axios.get('/api/admin/payments');
      setPayments(res.data);
      setStats(null);
      toast.success('تم تأكيد التحويل!');
    } catch { toast.error('فشل تأكيد التحويل'); }
  };

  const handleApprovePost = async (id) => {
    await axios.put('/api/admin/posts/' + id + '/approve');
    setPosts(posts.map(p => p._id === id ? { ...p, approved: true } : p));
    setStats(null);
    toast.success('تم الموافقة على المنشور!');
  };

  const handleDeletePost = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    await axios.delete('/api/admin/posts/' + id);
    setPosts(posts.filter(p => p._id !== id));
    setStats(null);
    toast.success('تم حذف المنشور');
  };

  const handleApproveReview = async (id) => {
    await axios.put('/api/admin/reviews/' + id + '/approve');
    setReviews(reviews.map(r => r._id === id ? { ...r, approved: true } : r));
    setStats(null);
    toast.success('تمت الموافقة على التقييم!');
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    await axios.delete('/api/admin/reviews/' + id);
    setReviews(reviews.filter(r => r._id !== id));
    setStats(null);
  };

  const handleApproveInstitute = async (id) => {
    await axios.put('/api/admin/institutes/' + id + '/approve');
    setInstitutes(institutes.map(i => i._id === id ? { ...i, approved: true } : i));
    setStats(null);
    toast.success('تمت الموافقة على المعهد!');
  };

  const handleDeleteInstitute = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المعهد؟')) return;
    await axios.delete('/api/admin/institutes/' + id);
    setInstitutes(institutes.filter(i => i._id !== id));
    setStats(null);
  };

  const handleActivateUser = async (id) => {
    await axios.post('/api/admin/users/' + id + '/activate');
    setUsers(users.map(u => u._id === id ? { ...u, isActive: true } : u));
    setStats(null);
    toast.success('تم تفعيل المستخدم');
  };

  const handleDeactivateUser = async (id) => {
    if (!confirm('هل أنت متأكد من تعطيل هذا المستخدم؟')) return;
    await axios.post('/api/admin/users/' + id + '/deactivate');
    setUsers(users.map(u => u._id === id ? { ...u, isActive: false } : u));
    setStats(null);
    toast.success('تم تعطيل المستخدم');
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code) return toast.error('كود الخصم مطلوب');
    try {
      const r = await axios.post('/api/admin/coupons', newCoupon);
      setCoupons([r.data, ...coupons]);
      setNewCoupon({ code: '', discountPercent: 10, maxUses: 100, expiresAt: '' });
      toast.success('تم إنشاء كود الخصم');
    } catch (e) { toast.error(e.response?.data?.message || 'خطأ'); }
  };

  const handleUpdateCoupon = async (id) => {
    try {
      const r = await axios.put('/api/admin/coupons/' + id, editingCoupon);
      setCoupons(coupons.map(c => c._id === id ? r.data : c));
      setEditingCoupon(null);
      toast.success('تم التحديث');
    } catch (e) { toast.error(e.response?.data?.message || 'خطأ'); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('حذف كود الخصم؟')) return;
    await axios.delete('/api/admin/coupons/' + id);
    setCoupons(coupons.filter(c => c._id !== id));
    toast.success('تم الحذف');
  };

  const handleMarkContactRead = async (id) => {
    await axios.put('/api/admin/contact-messages/' + id + '/read');
    setContactMessages(contactMessages.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const handleDeleteContactMessage = async (id) => {
    if (!confirm('حذف الرسالة؟')) return;
    await axios.delete('/api/admin/contact-messages/' + id);
    setContactMessages(contactMessages.filter(m => m._id !== id));
  };

  const handleCreatePage = async () => {
    if (!newPage.slug) return toast.error('الرابط المختصر مطلوب');
    try {
      const r = await axios.post('/api/admin/content-pages', newPage);
      setContentPages([...contentPages, r.data]);
      setNewPage({ slug: '', title: '', content: '', published: false });
      toast.success('تم إنشاء الصفحة');
    } catch (e) { toast.error(e.response?.data?.message || 'خطأ'); }
  };

  const handleUpdatePage = async (id) => {
    try {
      const r = await axios.put('/api/admin/content-pages/' + id, editingPage);
      setContentPages(contentPages.map(p => p._id === id ? r.data : p));
      setEditingPage(null);
      toast.success('تم التحديث');
    } catch (e) { toast.error(e.response?.data?.message || 'خطأ'); }
  };

  const handleDeletePage = async (id) => {
    if (!confirm('حذف الصفحة؟')) return;
    await axios.delete('/api/admin/content-pages/' + id);
    setContentPages(contentPages.filter(p => p._id !== id));
  };

  const handleBulkNotify = async () => {
    if (!bulkNotif.message) return toast.error('نص الإشعار مطلوب');
    const r = await axios.post('/api/admin/notifications/bulk', bulkNotif);
    toast.success(`تم إرسال الإشعار لـ ${r.data.sent} مستخدم`);
    setBulkNotif({ message: '', role: 'all', type: 'info' });
  };

  const handleDeleteAuditLogs = async () => {
    if (!confirm('مسح كل سجل النشاطات؟')) return;
    await axios.delete('/api/admin/audit-logs');
    setAuditLogs([]);
    toast.success('تم المسح');
  };

  const handleExport = async (type) => {
    try {
      const r = await axios.get('/api/admin/export/' + type, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([r.data], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = type + '.csv';
      a.click();
      toast.success('تم التصدير');
    } catch (e) { toast.error('خطأ في التصدير'); }
  };

  const searchLower = search.toLowerCase();
  const filteredUsers = users.filter(u => (u.name || '').toLowerCase().includes(searchLower) || (u.email || '').toLowerCase().includes(searchLower));
  const filteredTutors = tutors.filter(t => {
    const name = (t.userData && t.userData.name) || '';
    return name.toLowerCase().includes(searchLower) || t.subjects?.some(s => s.includes(search));
  });
  const filteredBookings = bookings.filter(b => {
    return (b.subject || '').includes(search) || (b.studentName || '').includes(search) || (b.tutorName || '').includes(search);
  });
  const filteredPayments = payments.filter(p => {
    return (p.studentName || '').includes(search) || (p.tutorName || '').includes(search) || (p.method || '').includes(search) || (p.status || '').includes(search);
  });
  const filteredPosts = posts.filter(p => {
    return (p.content || '').toLowerCase().includes(searchLower) || (p.userName || '').toLowerCase().includes(searchLower);
  });
  const filteredReviews = reviews.filter(r => {
    return (r.comment || '').toLowerCase().includes(searchLower) || (r.studentName || '').toLowerCase().includes(searchLower) || (r.tutorName || '').toLowerCase().includes(searchLower);
  });
  const filteredInstitutes = institutes.filter(i => {
    return (i.name || '').toLowerCase().includes(searchLower) || (i.description || '').toLowerCase().includes(searchLower);
  });

  const fmtDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('ar-AE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex">
      <SEO title={isSupport ? 'لوحة الدعم' : 'لوحة الإدارة'} />

      {/* Sidebar */}
      <aside className="w-56 lg:w-64 shrink-0 bg-white border-l border-slate-200/80 min-h-screen flex flex-col shadow-sm">
        <div className="p-4 lg:p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <FaChartLine className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">{isSupport ? 'لوحة الدعم' : 'لوحة الإدارة'}</h1>
              <p className="text-[11px] text-slate-400 truncate">{user?.name}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
          {allowedTabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-start relative ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-50 to-transparent text-primary-700 font-bold shadow-sm border border-primary-100'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {activeTab === tab.id && <span className="absolute end-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50" />}
              <tab.icon className={`text-sm shrink-0 ${activeTab === tab.id ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 text-center">منصة المدرسين الخصوصيين</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">

        {activeTab === 'dashboard' && (
          loading.dashboard ? <Spinner /> : !stats ? <Empty text="لا توجد بيانات" /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={FaUsers} label="الطلاب" value={stats.totalUsers} sub="إجمالي المستخدمين" color="blue" onClick={() => setActiveTab('users')} />
                <StatCard icon={FaChalkboardTeacher} label="المدرّسين" value={stats.totalTutors} sub="جميع المدرّسين" color="green" onClick={() => setActiveTab('tutors')} />
                <StatCard icon={FaBookmark} label="الحجوزات" value={stats.totalBookings} sub="إجمالي الحجوزات" color="purple" onClick={() => setActiveTab('bookings')} />
                <StatCard icon={FaMoneyBillWave} label="الإيرادات" value={`${stats.totalRevenue} درهم`} sub="إجمالي المدفوعات" color="amber" onClick={() => setActiveTab('payments')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={FaMoneyBillWave} label="أرباح المنصة" value={`${stats.platformRevenue} درهم`} sub={`نسبة ${settings?.platformFeePercent || 15}%`} color="pink" />
                <StatCard icon={FaUserCheck} label="توثيق مدرّسين" value={stats.pendingTutors} sub="بانتظار التوثيق" color={stats.pendingTutors > 0 ? 'amber' : 'green'} onClick={() => setActiveTab('tutors')} />
                <StatCard icon={FaNewspaper} label="منشورات" value={stats.pendingPosts} sub={stats.pendingPosts > 0 ? 'بانتظار الموافقة' : 'تمت الموافقة'} color={stats.pendingPosts > 0 ? 'amber' : 'teal'} onClick={() => setActiveTab('posts')} />
                <StatCard icon={FaUniversity} label="تحويل بنكي" value={stats.pendingTransfers} sub="بانتظار التأكيد" color={stats.pendingTransfers > 0 ? 'red' : 'green'} onClick={() => setActiveTab('payments')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard icon={FaStar} label="تقييمات" value={stats.pendingReviews} sub="بانتظار الموافقة" color={stats.pendingReviews > 0 ? 'amber' : 'green'} onClick={() => setActiveTab('reviews')} />
                <StatCard icon={FaBuilding} label="معاهد" value={stats.pendingInstitutes} sub="بانتظار الموافقة" color={stats.pendingInstitutes > 0 ? 'amber' : 'green'} onClick={() => setActiveTab('institutes')} />
                <StatCard icon={FaUserPlus} label="مستخدمين جدد" value={stats.pendingUsers} sub="بانتظار التفعيل" color={stats.pendingUsers > 0 ? 'amber' : 'green'} onClick={() => setActiveTab('users')} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <FaClock className="text-primary-500 text-sm" /> آخر الحجوزات
                  </h2>
                  <span className="text-xs text-slate-400">آخر 5 حجوزات</span>
                </div>
                {stats.recentBookings.length === 0 ? (
                  <Empty text="لا توجد حجوزات حديثة" />
                ) : (
                  <div className="space-y-2">
                    {stats.recentBookings.map(b => (
                      <div key={b._id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition border border-slate-50 text-sm">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                            <FaBookmark />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{b.subject}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {b.studentName || 'طالب'} <span className="mx-1 text-slate-300">←</span> {b.tutorName || 'مدرّس'}
                            </p>
                          </div>
                        </div>
                        <Badge status={b.status} />
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
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><FaUsers className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">المستخدمين</h2>
                  <p className="text-xs text-slate-400">إدارة جميع المستخدمين في المنصة</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو البريد..." />
                {!isSupport && <button onClick={() => setShowCreateUser(!showCreateUser)} className={`h-10 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showCreateUser ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20'}`}>
                  {showCreateUser ? <FaTimesCircle /> : <FaUserPlus />} {showCreateUser ? 'إلغاء' : 'إضافة مستخدم'}
                </button>}
              </div>
            </div>

            {!isSupport && showCreateUser && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 shadow-sm p-5 mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FaUserPlus className="text-blue-500" />إنشاء مستخدم جديد</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                  <input className="input-field h-10 text-sm" placeholder="الاسم الكامل" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                  <div className="relative">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">+971</span>
                    <input className="input-field h-10 text-sm ps-14" placeholder="5X XXX XXXX" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value.replace(/[^0-9]/g, '') })} />
                  </div>
                  <input className="input-field h-10 text-sm" type="password" placeholder="كلمة السر" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  <select className="input-field h-10 text-sm" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="student">طالب</option>
                    <option value="tutor">مدرّس</option>
                    <option value="admin">مشرف</option>
                  </select>
                </div>
                <button onClick={handleCreateUser} disabled={creatingUser} className="btn-primary h-10 text-sm flex items-center justify-center gap-2">
                  {creatingUser ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                  {creatingUser ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
                </button>
              </div>
            )}
            {loading.users ? <Spinner /> : filteredUsers.length === 0 ? <Empty text="لا يوجد مستخدمين" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <div key={u._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-600' : u.role === 'tutor' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>{u.name?.charAt(0)}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate flex items-center gap-2">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-600' : u.role === 'tutor' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>{u.role === 'tutor' ? 'مدرّس' : u.role === 'admin' ? 'مشرف' : 'طالب'}</span>
                            <span className="ltr:text-left text-left direction-ltr" dir="ltr">{u.email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={u.isActive ? 'active' : 'false'} />
                        {u.role !== 'admin' && !isSupport && (
                          <>
                            {u.isActive ? (
                              <button onClick={() => handleDeactivateUser(u._id)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all hover:shadow-sm" title="تعطيل">
                                <FaUserSlash className="text-xs" />
                              </button>
                            ) : (
                              <button onClick={() => handleActivateUser(u._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="تفعيل">
                                <FaUserPlus className="text-xs" />
                              </button>
                            )}
                            <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="حذف المستخدم">
                              <FaTrash className="text-xs" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  إجمالي: {filteredUsers.length} مستخدم
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'tutors' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"><FaChalkboardTeacher className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">المدرّسين</h2>
                  <p className="text-xs text-slate-400">إدارة وتوثيق المدرّسين</p>
                </div>
              </div>
              <SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو المادة..." />
            </div>
            {loading.tutors ? <Spinner /> : filteredTutors.length === 0 ? <Empty text="لا يوجد مدرّسين" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredTutors.map(t => (
                    <div key={t._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">{t.userData?.name?.charAt(0) || 'م'}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{t.userData?.name || 'مدرّس'}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                            <FaMapMarkerAlt className="text-[10px] text-slate-400" /> {t.area ? `${t.emirate} - ${t.area}` : t.emirate || 'غير محدد'}
                            <span className="mx-1 text-slate-300">•</span>
                            <FaStar className="text-[10px] text-amber-400" /> {t.rating || 0}
                            <span className="mx-1 text-slate-300">•</span>
                            <span className="font-medium text-slate-600">{t.ratePerHour}</span> درهم/س
                          </p>
                          {t.subjects && <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">{t.subjects.map((s, i) => <span key={i} className="bg-slate-100 px-2 py-0.5 rounded-lg">{s}</span>)}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={t.isVerified ? 'true' : 'false'} />
                        {!t.isVerified && (
                          <button onClick={() => handleApproveTutor(t._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="توثيق المدرّس">
                            <FaCheckCircle />
                          </button>
                        )}
                        <button onClick={() => handleDeleteTutor(t._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="حذف المدرّس">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  إجمالي: {filteredTutors.length} مدرّس
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20"><FaBookmark className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">الحجوزات</h2>
                  <p className="text-xs text-slate-400">إدارة وتتبع جميع الحجوزات</p>
                </div>
              </div>
              <SearchBar value={search} onChange={setSearch} placeholder="بحث بالمادة أو الطالب أو المدرّس..." />
            </div>
            {loading.bookings ? <Spinner /> : filteredBookings.length === 0 ? <Empty text="لا توجد حجوزات" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredBookings.map(b => (
                    <div key={b._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-50 to-violet-50 text-primary-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                          <FaBookmark />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{b.subject}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            <span className="font-medium text-slate-600">{b.studentName || 'طالب'}</span> <span className="mx-1 text-slate-300">←</span> <span className="font-medium text-slate-600">{b.tutorName || 'مدرّس'}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1"><FaCalendarAlt className="text-[10px]" /> {fmtDate(b.date) || fmtDate(b.createdAt)}</span>
                            {b.totalAmount && <><span className="text-slate-300">•</span><span className="font-medium text-slate-600">{b.totalAmount} درهم</span></>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={b.status} />
                        {b.status !== 'cancelled' && b.status !== 'completed' && !isSupport && (
                          <button onClick={() => handleCancelBooking(b._id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="إلغاء الحجز">
                            <FaBan />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  إجمالي: {filteredBookings.length} حجز
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'payments' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20"><FaMoneyBillWave className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">المدفوعات</h2>
                  <p className="text-xs text-slate-400">إدارة وتأكيد المدفوعات والتحويلات البنكية</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {payments.filter(p => p.status === 'pending_transfer').length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
                    <FaUniversity /> {payments.filter(p => p.status === 'pending_transfer').length} تحويل
                  </span>
                )}
                <SearchBar value={search} onChange={setSearch} placeholder="بحث عن دفعة..." />
              </div>
            </div>
            {loading.payments ? <Spinner /> : filteredPayments.length === 0 ? <Empty text="لا توجد مدفوعات" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredPayments.map(p => (
                    <div key={p._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          p.method === 'bank_transfer' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {p.method === 'bank_transfer' ? <FaUniversity /> : <FaCreditCard />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{p.subject || 'حجز'}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            <span className="font-medium text-slate-600">{p.studentName || 'طالب'}</span> <span className="mx-1 text-slate-300">←</span> <span className="font-medium text-slate-600">{p.tutorName || 'مدرّس'}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="font-semibold text-lg text-slate-700">{p.amount}</span><span className="text-slate-400">درهم</span>
                            <span className="text-slate-300">•</span>
                            <span className={p.method === 'bank_transfer' ? 'text-blue-500' : 'text-emerald-500'}>
                              {p.method === 'bank_transfer' ? 'تحويل بنكي' : 'بطاقة ائتمان'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={p.status} />
                        {p.status === 'pending_transfer' && (
                          <button onClick={() => handleConfirmTransfer(p._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="تأكيد استلام التحويل">
                            <FaCheckDouble />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  إجمالي: {filteredPayments.length} دفعة
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'posts' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20"><FaNewspaper className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">المنشورات</h2>
                  <p className="text-xs text-slate-400">الموافقة على منشورات الطلاب والمدرسين</p>
                </div>
              </div>
              <SearchBar value={search} onChange={setSearch} placeholder="بحث عن منشور..." />
            </div>
            {loading.posts ? <Spinner /> : filteredPosts.length === 0 ? <Empty text="لا توجد منشورات" /> : (
              <div className="space-y-3">
                {filteredPosts.map(p => (
                  <div key={p._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-50 to-rose-50 text-primary-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-sm">
                          <FaNewspaper />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-slate-800 text-sm">{p.userName || 'مستخدم'}</span>
                            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{fmtDate(p.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{p.content}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><FaThumbsUp className="text-slate-400" /> {p.likes?.length || 0}</span>
                            <span className="flex items-center gap-1.5"><FaCommentDots className="text-slate-400" /> {p.comments?.length || 0} تعليق</span>
                            {p.media?.length > 0 && <span className="text-primary-500 flex items-center gap-1">📎 {p.media.length} مرفق</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={p.approved ? 'true' : 'false'} />
                        {!p.approved && (
                          <button onClick={() => handleApprovePost(p._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="الموافقة على المنشور">
                            <FaCheckCircle />
                          </button>
                        )}
                        <button onClick={() => handleDeletePost(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="حذف المنشور">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20"><FaStar className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">التقييمات</h2>
                  <p className="text-xs text-slate-400">الموافقة على تقييمات المدرسين</p>
                </div>
              </div>
              <SearchBar value={search} onChange={setSearch} placeholder="بحث عن تقييم..." />
            </div>
            {loading.reviews ? <Spinner /> : filteredReviews.length === 0 ? <Empty text="لا توجد تقييمات" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredReviews.map(r => (
                    <div key={r._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                          <FaStar />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate flex items-center gap-2">
                            {r.tutorName || 'مدرّس'}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold">
                              <FaStar className="text-[10px]" /> {r.rating}
                            </span>
                          </p>
                          <p className="text-xs text-slate-400 truncate">{r.studentName || 'طالب'}</p>
                          {r.comment && <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">"{r.comment}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={r.approved ? 'true' : 'false'} />
                        {!r.approved && (
                          <button onClick={() => handleApproveReview(r._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="الموافقة">
                            <FaCheckCircle />
                          </button>
                        )}
                        <button onClick={() => handleDeleteReview(r._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="حذف">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  إجمالي: {filteredReviews.length} تقييم
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'institutes' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20"><FaBuilding className="text-white text-sm" /></div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">المعاهد</h2>
                  <p className="text-xs text-slate-400">إدارة وتوثيق المعاهد التعليمية</p>
                </div>
              </div>
              <SearchBar value={search} onChange={setSearch} placeholder="بحث عن معهد..." />
            </div>
            {loading.institutes ? <Spinner /> : filteredInstitutes.length === 0 ? <Empty text="لا توجد معاهد" /> : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredInstitutes.map(i => (
                    <div key={i._id} className="flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-150 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm text-lg">
                          {i.logo || <FaBuilding />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{i.name}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" /> {i.emirates?.join('، ')}</span>
                            {i.rating && <><span className="text-slate-300">•</span> <FaStar className="text-[10px] text-amber-400" /> {i.rating}</>}
                          </p>
                          {i.subjects && <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">{i.subjects.map((s, j) => <span key={j} className="bg-slate-100 px-2 py-0.5 rounded-lg">{s}</span>)}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={i.approved ? 'true' : 'false'} />
                        {!i.approved && (
                          <button onClick={() => handleApproveInstitute(i._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all hover:shadow-sm" title="الموافقة">
                            <FaCheckCircle />
                          </button>
                        )}
                        <button onClick={() => handleDeleteInstitute(i._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm" title="حذف">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-l from-slate-50 to-transparent border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  إجمالي: {filteredInstitutes.length} معهد
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'charts' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20"><FaChartLine className="text-white text-sm" /></div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">الرسوم البيانية</h2>
                <p className="text-xs text-slate-400">تحليلات وإحصائيات المنصة</p>
              </div>
            </div>
            {!chartData ? <Spinner /> : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue line chart */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500" />الإيرادات الشهرية</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={Object.entries(chartData.monthlyRevenue).map(([k, v]) => ({ month: k, revenue: v }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Bookings by subject bar chart */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />الحجوزات حسب المادة</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={Object.entries(chartData.bookingsBySubject).map(([k, v]) => ({ subject: k, count: v }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Booking status pie */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />حالة الحجوزات</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={Object.entries(chartData.statusCounts).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name }) => ({ pending: 'قيد الانتظار', confirmed: 'مؤكد', completed: 'مكتمل', cancelled: 'ملغي' })[name] || name}>
                          {Object.entries(chartData.statusCounts).filter(([, v]) => v > 0).map(([k], i) => <Cell key={k} fill={['#f59e0b', '#10b981', '#6366f1', '#ef4444'][i] || '#94a3b8'} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Bookings by emirate */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" />الحجوزات حسب الإمارة</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={Object.entries(chartData.bookingsByEmirate).map(([k, v]) => ({ emirate: k, count: v }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="emirate" type="category" tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'coupons' && (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">إنشاء كود خصم جديد</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input className="input-field h-10 text-sm" placeholder="الكود (مثال: SAVE20)" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} />
                <input className="input-field h-10 text-sm" type="number" placeholder="نسبة الخصم %" value={newCoupon.discountPercent} onChange={e => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })} />
                <input className="input-field h-10 text-sm" type="number" placeholder="الحد الأقصى للاستخدام" value={newCoupon.maxUses} onChange={e => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })} />
                <button onClick={handleCreateCoupon} className="btn-primary h-10 text-sm flex items-center justify-center gap-2"><FaPlus />إنشاء</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {coupons.map(c => (
                  <div key={c._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><FaTags /></div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800">{c.code} <span className="text-sm font-normal text-primary-500 me-2">-{c.discountPercent}%</span></p>
                        <p className="text-xs text-slate-400">مستخدم {c.usedCount}/{c.maxUses} • {c.expiresAt ? `ينتهي ${new Date(c.expiresAt).toLocaleDateString('ar')}` : 'بدون انتهاء'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge status={c.isActive ? 'active' : 'false'} />
                      {editingCoupon && editingCoupon._id === c._id ? (
                        <div className="flex gap-2">
                          <input className="input-field h-8 w-16 text-xs" type="number" value={editingCoupon.discountPercent} onChange={e => setEditingCoupon({ ...editingCoupon, discountPercent: Number(e.target.value) })} />
                          <button onClick={() => handleUpdateCoupon(c._id)} className="btn-primary h-8 px-3 text-xs">حفظ</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingCoupon({ ...c })} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition" title="تعديل"><FaEdit className="text-xs" /></button>
                      )}
                      <button onClick={() => handleDeleteCoupon(c._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><FaTrash className="text-xs" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'earnings' && (
          <>
            {loading.earnings ? <Spinner /> : earnings.length === 0 ? <Empty text="لا توجد أرباح بعد" /> : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gradient-to-l from-primary-50 to-blue-50 border-b border-primary-100">
                  <p className="text-sm text-slate-500">إجمالي الأرباح: <span className="font-bold text-primary-600 text-lg">{earnings.reduce((s, e) => s + e.totalEarned, 0)} درهم</span></p>
                </div>
                <div className="divide-y divide-slate-50">
                  {earnings.map(e => (
                    <div key={e.tutor} className="flex items-center justify-between p-4 hover:bg-slate-50 transition gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><FaDollarSign /></div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{e.tutorName} {e.isVerified && <FaCheckCircle className="inline text-emerald-500 text-xs" />}</p>
                          <p className="text-xs text-slate-400 truncate">{e.email || ''} • {e.subjects.slice(0, 3).join('، ')}</p>
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="font-bold text-slate-800">{e.totalEarned} <span className="text-xs font-normal text-slate-400">درهم</span></p>
                        <p className="text-[11px] text-slate-400">{e.bookingCount} حجز • رسوم: {e.totalPlatformFees} درهم</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"><FaBullhorn className="text-white text-xl" /></div>
                <div><h2 className="text-xl font-bold text-slate-900">إشعار جماعي</h2><p className="text-sm text-slate-400">إرسال إشعار لجميع المستخدمين أو فئة محددة</p></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">المستلمون</label>
                  <div className="flex gap-2">
                    {[{id:'all',label:'الكل'},{id:'student',label:'طلاب'},{id:'tutor',label:'مدرسين'},{id:'admin',label:'مشرفين'}].map(o => (
                      <button key={o.id} onClick={() => setBulkNotif({ ...bulkNotif, role: o.id })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${bulkNotif.role === o.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>{o.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">نوع الإشعار</label>
                  <select className="input-field h-10 text-sm" value={bulkNotif.type} onChange={e => setBulkNotif({ ...bulkNotif, type: e.target.value })}>
                    <option value="info">معلومات</option>
                    <option value="warning">تنبيه</option>
                    <option value="promo">عرض</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">نص الإشعار</label>
                  <textarea className="input-field min-h-[100px] text-sm" placeholder="اكتب نص الإشعار هنا..." value={bulkNotif.message} onChange={e => setBulkNotif({ ...bulkNotif, message: e.target.value })} />
                </div>
                <button onClick={handleBulkNotify} className="btn-primary w-full h-11 text-sm flex items-center justify-center gap-2"><FaPaperPlane />إرسال الإشعار</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <>
            {loading.contact ? <Spinner /> : contactMessages.length === 0 ? <Empty text="لا توجد رسائل" /> : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {contactMessages.map(m => (
                    <div key={m._id} className={`p-4 hover:bg-slate-50 transition ${!m.read ? 'bg-primary-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0"><FaEnvelope className="text-xs" /></div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{m.name}</p>
                            <p className="text-[11px] text-slate-400">{m.email} {m.phone && <>• {m.phone}</>}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!m.read && <span className="w-2 h-2 rounded-full bg-primary-500" title="جديد" />}
                          <button onClick={() => handleMarkContactRead(m._id)} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="تحديد كمقروء"><FaCheckDouble className="text-xs" /></button>
                          {!isSupport && <button onClick={() => handleDeleteContactMessage(m._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><FaTrash className="text-xs" /></button>}
                        </div>
                      </div>
                      {m.subject && <p className="text-xs font-bold text-slate-600 mb-1">{m.subject}</p>}
                      <p className="text-sm text-slate-600 leading-relaxed">{m.message}</p>
                      <p className="text-[11px] text-slate-400 mt-2">{new Date(m.createdAt).toLocaleDateString('ar')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'content' && (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">إضافة صفحة جديدة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <input className="input-field h-10 text-sm" placeholder="الرابط (مثال: about-us)" value={newPage.slug} onChange={e => setNewPage({ ...newPage, slug: e.target.value })} />
                <input className="input-field h-10 text-sm" placeholder="العنوان" value={newPage.title} onChange={e => setNewPage({ ...newPage, title: e.target.value })} />
                <button onClick={handleCreatePage} className="btn-primary h-10 text-sm flex items-center justify-center gap-2"><FaPlus />إضافة</button>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={newPage.published} onChange={e => setNewPage({ ...newPage, published: e.target.checked })} className="rounded border-slate-300" />
                  منشور
                </label>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {contentPages.map(p => (
                  <div key={p._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><FaFileAlt /></div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{p.title || p.slug}</p>
                        <p className="text-xs text-slate-400">/{p.slug} • {p.content?.length || 0} حرف</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge status={p.published ? 'true' : 'false'} />
                      {editingPage && editingPage._id === p._id ? (
                        <div className="flex gap-2">
                          <input className="input-field h-8 w-32 text-xs" value={editingPage.title} onChange={e => setEditingPage({ ...editingPage, title: e.target.value })} />
                          <button onClick={() => handleUpdatePage(p._id)} className="btn-primary h-8 px-3 text-xs">حفظ</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingPage({ ...p })} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition"><FaEdit className="text-xs" /></button>
                      )}
                      <button onClick={() => handleDeletePage(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><FaTrash className="text-xs" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'audit' && (
          <>
            {auditLogs.length > 0 && (
              <div className="flex justify-end mb-4">
                <button onClick={handleDeleteAuditLogs} className="btn-outline-danger h-9 text-xs flex items-center gap-2"><FaTrash />مسح الكل</button>
              </div>
            )}
            {loading.audit ? <Spinner /> : auditLogs.length === 0 ? <Empty text="لا توجد نشاطات" /> : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {auditLogs.map(l => (
                    <div key={l._id} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5"><FaHistory className="text-xs" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700">{l.details}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{l.adminName || 'مشرف'} • {new Date(l.createdAt).toLocaleString('ar')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'export' && (
          <div className="max-w-xl">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center"><FaFileExport className="text-white text-xl" /></div>
                <div><h2 className="text-xl font-bold text-slate-900">تصدير البيانات</h2><p className="text-sm text-slate-400">تصدير البيانات بصيغة CSV</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: 'users', label: 'المستخدمين', icon: FaUsers, color: 'blue' },
                  { type: 'tutors', label: 'المدرسين', icon: FaChalkboardTeacher, color: 'green' },
                  { type: 'bookings', label: 'الحجوزات', icon: FaBookmark, color: 'amber' },
                  { type: 'payments', label: 'المدفوعات', icon: FaMoneyBillWave, color: 'purple' },
                ].map(o => {
                  const cls = {
                    blue: { btn: 'hover:border-blue-200 hover:bg-blue-50/30', icon: 'bg-blue-50 text-blue-600' },
                    green: { btn: 'hover:border-emerald-200 hover:bg-emerald-50/30', icon: 'bg-emerald-50 text-emerald-600' },
                    amber: { btn: 'hover:border-amber-200 hover:bg-amber-50/30', icon: 'bg-amber-50 text-amber-600' },
                    purple: { btn: 'hover:border-purple-200 hover:bg-purple-50/30', icon: 'bg-purple-50 text-purple-600' },
                  }[o.color] || { btn: '', icon: '' };
                  return (
                    <button key={o.type} onClick={() => handleExport(o.type)}
                      className={`flex items-center gap-4 p-5 rounded-xl border border-slate-100 transition bg-white text-start ${cls.btn}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls.icon}`}><o.icon className="text-lg" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">{o.label}</p>
                        <p className="text-xs text-slate-400">CSV</p>
                      </div>
                      <FaFileExport className="text-slate-300 text-lg" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <>
            {loading.settings ? <Spinner /> : !settings ? <Empty text="لا توجد إعدادات" /> : (
              <div className="max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <FaCog className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">إعدادات المنصة</h2>
                      <p className="text-sm text-slate-400">تحكم في نسب الرسوم وإعدادات المنصة</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-5">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <FaPercent className="text-primary-500" />
                        نسبة رسوم المنصة
                      </label>
                      <p className="text-xs text-slate-400 mb-4">النسبة المخصومة من كل حجز كرسوم للمنصة. تُطبق على الحجوزات الجديدة فقط.</p>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="number" min="0" max="100" step="0.5"
                            className="input-field w-28 text-center text-lg font-bold text-primary-600"
                            value={feePercentInput}
                            onChange={(e) => setFeePercentInput(e.target.value)}
                          />
                          <span className="absolute start-1/2 -translate-x-1/2 -bottom-5 text-xs text-slate-400">%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-3">معاينة تأثير التغيير</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">مثال: حصة 150 درهم/س لمدة ساعتين</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">المدرّس</span>
                          <span className="font-semibold text-slate-700">300 درهم</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">رسوم المنصة ({feePercentInput}%)</span>
                          <span className="font-semibold text-primary-500">{Math.round(300 * Number(feePercentInput) / 100)} درهم</span>
                        </div>
                        <div className="border-t border-primary-200 pt-2 flex items-center justify-between">
                          <span className="font-bold text-slate-700">الطالب يدفع</span>
                          <span className="text-xl font-extrabold text-primary-600">{300 + Math.round(300 * Number(feePercentInput) / 100)} <span className="text-sm font-medium">درهم</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={handleSaveSettings} disabled={savingSettings} className="btn-primary flex items-center gap-2 !py-2.5 text-sm">
                        {savingSettings ? <><FaSpinner className="animate-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ الإعدادات</>}
                      </button>
                      {String(feePercentInput) !== String(settings?.platformFeePercent || 15) && (
                        <span className="text-xs text-amber-500 flex items-center gap-1"><FaExclamationTriangle /> لم يتم الحفظ بعد</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
          )}
        </div>
      </main>
    </div>
  );
}

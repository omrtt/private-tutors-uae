import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaLanguage, FaCheckCircle, FaBookOpen, FaAward, FaClock, FaChalkboardTeacher, FaQuoteRight, FaArrowRight, FaVideo, FaUserFriends, FaGlobe, FaChevronDown, FaShieldAlt, FaRss, FaCity } from 'react-icons/fa';
import { getAreas } from '../data/locations';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import PaymentForm from '../components/PaymentForm';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

export default function TutorProfile() {
  const { t } = useTranslation();
  const tabs = [
    { id: 'about', label: t('tutorProfile.tabAbout'), icon: FaBookOpen },
    { id: 'subjects', label: t('tutorProfile.tabSubjects'), icon: FaGraduationCap },
    { id: 'qualifications', label: t('tutorProfile.tabQualifications'), icon: FaAward },
    { id: 'reviews', label: t('tutorProfile.tabReviews'), icon: FaStar },
    { id: 'posts', label: t('tutorProfile.tabPosts'), icon: FaRss },
  ];
  const modeIcons = {
    online: { icon: FaVideo, label: t('bookingMode.online') },
    inPerson: { icon: FaUserFriends, label: t('bookingMode.inPerson') },
    both: { icon: FaGlobe, label: t('teachingMode.both') },
  };
  const { id } = useParams();
  const { user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tutorPosts, setTutorPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({ subject: '', date: '', duration: 1, location: '', notes: '', startTime: '', mode: 'online', instituteId: '' });
  const [bookingStep, setBookingStep] = useState('form');
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCalDate, setSelectedCalDate] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [activeTab, setActiveTab] = useState('about');
  const [feePercent, setFeePercent] = useState(15);
  const [institutes, setInstitutes] = useState([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [trialEligibility, setTrialEligibility] = useState(null);
  const [useTrial, setUseTrial] = useState(false);

  useEffect(() => {
    axios.get(`/api/tutors/${id}`).then((res) => setTutor(res.data)).catch(() => {});
    axios.get(`/api/reviews/${id}`).then((res) => setReviews(res.data.data || res.data)).catch(() => {});
    axios.get(`/api/posts/tutor/${id}`).then((res) => setTutorPosts(res.data)).catch(() => {});
    axios.get('/api/settings/public').then((res) => setFeePercent(res.data.platformFeePercent || 15)).catch(() => {});
    if (user) {
      axios.get(`/api/bookings/trial-eligibility/${id}`).then((res) => setTrialEligibility(res.data)).catch(() => {});
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (booking.mode === 'institute' && booking.subject && tutor?.emirate) {
      setLoadingInstitutes(true);
      const params = new URLSearchParams({ subject: booking.subject, emirate: tutor.emirate });
      axios.get(`/api/institutes?${params}`).then((res) => setInstitutes(res.data)).catch(() => setInstitutes([])).finally(() => setLoadingInstitutes(false));
    } else {
      setInstitutes([]);
      if (booking.mode !== 'institute') setBooking({ ...booking, instituteId: '' });
    }
  }, [booking.mode, booking.subject, tutor?.emirate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/bookings', { tutor: id, ...booking, isTrial: useTrial });
      setCreatedBookingId(res.data._id);
      setBookingStep('payment');
    } catch (err) {
      toast.error(err.response?.data?.message || t('tutorProfile.bookingFailed'));
    }
  };

  const handlePaymentSuccess = async (method) => {
    try {
      const payRes = await axios.post('/api/payments', { bookingId: createdBookingId, method: method || 'card' });
      if (method === 'bank_transfer') {
        // Bank transfer: mark as pending transfer
        await axios.post(`/api/payments/${payRes.data._id}/process`);
        toast.success(t('tutorProfile.bookingCreatedBankTransfer'));
      } else {
        // Card: process payment immediately
        await axios.post(`/api/payments/${payRes.data._id}/process`);
        toast.success(t('tutorProfile.bookingPaymentSuccess'));
      }
      setShowBooking(false);
      setBookingStep('form');
      setCreatedBookingId(null);
      setSelectedSlot(null);
      setSelectedCalDate(null);
      setBooking({ subject: '', date: '', duration: 1, location: '', notes: '', startTime: '', mode: 'online', instituteId: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('tutorProfile.paymentConfirmFailed'));
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${id}`, reviewForm);
      toast.success(t('tutorProfile.reviewAdded'));
      setReviewForm({ rating: 5, comment: '' });
      const res = await axios.get(`/api/reviews/${id}`);
      setReviews(res.data.data || res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || t('tutorProfile.reviewFailed'));
    }
  };

  if (loading || !tutor) return (
    <div className="text-center py-32">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400">{t('tutorProfile.loadingProfile')}</p>
    </div>
  );

  const tutorData = tutor.user || {};
  const fullStars = Math.round(tutor.rating || 0);
  const ModeIcon = tutor.teachingMode ? modeIcons[tutor.teachingMode] : null;

  const calcFee = () => {
    const effectiveRate = useTrial && trialEligibility?.trialPrice ? trialEligibility.trialPrice : tutor.ratePerHour;
    const tutorAmount = effectiveRate * (booking.duration || 1);
    const platformFee = Math.round(tutorAmount * feePercent / 100);
    return { tutorAmount, platformFee, total: tutorAmount + platformFee };
  };

  const pricing = calcFee();

  const modeLabels = { online: t('bookingMode.online'), inPerson: t('bookingMode.inPerson'), institute: t('bookingMode.institute') };
  const bookingSummary = [
    { label: t('dashboard.price'), value: `${tutor.ratePerHour} ${t('common.aedPerHour')}` },
    { label: t('bookingSummary.duration'), value: `${booking.duration} ${t('dashboard.hours', { count: booking.duration })}` },
    { label: t('tutorProfile.teachingMode'), value: modeLabels[booking.mode] || t('bookingMode.online') },
    { label: t('bookingModal.tutor'), value: `${pricing.tutorAmount} ${t('common.aed')}` },
    { label: `${t('bookingModal.platformFee')} (${feePercent}%)`, value: `${pricing.platformFee} ${t('common.aed')}`, class: 'text-primary-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <SEO title={tutorData.name || t('tutorProfile.seoTitle')} />

      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="60" fill="white" />
            <circle cx="350" cy="150" r="80" fill="white" />
            <circle cx="200" cy="30" r="40" fill="white" />
            <circle cx="20" cy="180" r="30" fill="white" />
            <circle cx="380" cy="20" r="50" fill="white" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <Breadcrumbs items={[
            { path: '/tutors', label: t('tutorProfile.breadcrumbSearch'), class: 'text-white/70 hover:text-white' },
            { label: tutorData.name || t('tutorProfile.seoTitle'), class: 'text-white/90' },
          ]} />
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mt-4">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl md:text-5xl font-extrabold text-white shrink-0 ring-4 ring-white/30 shadow-xl">
              {tutorData.name?.charAt(0) || t('tutorProfile.nameFallback')}
            </div>
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">{tutorData.name}</h1>
                {tutor.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
                    <FaCheckCircle /> {t('tutorProfile.verified')}
                  </span>
                )}
                {tutor.trialAvailable && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-400/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-amber-400/30 text-amber-200">
                    <FaStar /> {t('trial.badge')}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-white/60" /> {tutor.area ? `${tutor.emirate} - ${tutor.area}` : tutor.emirate}</span>
                <span className="flex items-center gap-1.5"><FaGraduationCap className="text-white/60" /> {tutor.experience} {t('common.yearsExperience')}</span>
                <span className="flex items-center gap-1.5"><FaLanguage className="text-white/60" /> {tutor.languages?.join('، ')}</span>
                {ModeIcon && (
                  <span className="flex items-center gap-1.5"><ModeIcon.icon className="text-white/60" /> {ModeIcon.label}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/10">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} className={`${s <= fullStars ? 'text-yellow-300' : 'text-white/20'} text-sm`} />
                ))}
              </div>
              <span className="font-bold text-white">{tutor.rating?.toFixed(1)}</span>
              <span className="text-white/60 text-xs">({tutor.numReviews} {t('tutorProfile.reviewCount', { count: tutor.numReviews })})</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-2 border border-white/10">
              <span className="text-2xl font-extrabold text-white">{tutor.ratePerHour}</span>
              <span className="text-white/70 mr-1 text-sm">{t('common.aedPerHour')}</span>
            </div>
            <div className="flex-1" />
            {user && user.role !== 'tutor' && (
              <button onClick={() => setShowBooking(true)} className="bg-accent-400 hover:bg-accent-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-black/20 flex items-center gap-2 text-sm">
                <FaClock /> {t('tutorProfile.bookSession')}
              </button>
            )}
            {!user && (
              <Link to="/login" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-200 border border-white/20 flex items-center gap-2 text-sm">
                <FaArrowRight /> {t('tutorProfile.loginToBook')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-100 dark:border-slate-700 px-4 md:px-6 overflow-x-auto">
                <div className="flex gap-1 py-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="text-xs" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 md:p-8"
                >
                  {activeTab === 'about' && (
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{tutor.bio || t('tutorProfile.noBio')}</p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">{t('tutorProfile.education')}</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{tutor.education || t('tutorProfile.notSpecified')}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">{t('tutorProfile.teachingMode')}</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {tutor.teachingMode === 'online' ? t('bookingMode.online') : tutor.teachingMode === 'inPerson' ? t('bookingMode.inPerson') : t('teachingMode.bothFull')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'subjects' && (
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects?.map((s, i) => (
                        <div key={i} className="px-5 py-2.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-semibold border border-primary-100 dark:border-primary-800 flex items-center gap-2">
                          <FaBookOpen className="text-xs" />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'qualifications' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {tutor.qualifications?.length > 0 ? (
                        tutor.qualifications.map((q, i) => (
                          <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                              <FaAward />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{q}</p>
                              <p className="text-xs text-slate-400">{t('tutorProfile.certifiedQualification')}</p>
                            </div>
                          </div>
                        ))
                      ) : <p className="text-slate-400 text-sm">{t('tutorProfile.noQualifications')}</p>}
                    </div>
                  )}

                      {activeTab === 'reviews' && (
                        <div>
                          {user && user.role !== 'tutor' && (
                            <form onSubmit={handleReview} className="mb-6 p-5 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                              <h3 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <FaQuoteRight className="text-primary-500 text-xs" /> أضف تقييماً
                              </h3>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    className={`text-2xl transition hover:scale-110 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}>★</button>
                                ))}
                              </div>
                              <textarea className="input-field !text-sm" placeholder="اكتب تعليقك..." rows={2} value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                              <button type="submit" className="btn-primary !py-2 !px-4 text-sm">إرسال التقييم</button>
                            </form>
                          )}

                          {reviews.length === 0 ? (
                            <EmptyState icon={FaStar} title={t('tutorProfile.noReviewsTitle')} description={t('tutorProfile.noReviewsDesc')} />
                          ) : (
                            <div className="space-y-3">
                              {reviews.map((review, i) => (
                                <div key={i} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                      {review.student?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <span className="font-bold block leading-tight text-slate-800 dark:text-slate-200 text-sm">{review.student?.name}</span>
                                      <div className="flex text-yellow-400 text-xs mt-0.5">
                                        {Array.from({ length: 5 }, (_, i) => (
                                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  {review.comment && <p className="text-slate-600 dark:text-slate-400 text-sm mr-13 leading-relaxed">{review.comment}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'posts' && (
                        <div>
                          {tutorPosts.length === 0 ? (
                            <EmptyState icon={FaRss} title={t('tutorProfile.noPostsTitle')} description={t('tutorProfile.noPostsDesc')} />
                          ) : (
                            <div className="space-y-3">
                              {tutorPosts.map((post) => (
                                <div key={post._id} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>
                                  {post.media?.length > 0 && (
                                    <div className="rounded-xl overflow-hidden mb-3">
                                      <img src={post.media[0]} alt="" className="w-full max-h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">❤ {post.likes?.length || 0}</span>
                                    <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString('ar-AE', { day: 'numeric', month: 'short' })}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                  <FaClock className="text-primary-500" /> ملخص الحجز
                </h3>
                <div className="space-y-3 mb-4">
                  {bookingSummary.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">الإجمالي</span>
                    <span className="text-lg font-extrabold text-primary-600">{pricing.total} <span className="text-sm font-medium">درهم</span></span>
                  </div>
                </div>
                {user && user.role !== 'tutor' ? (
                  <button onClick={() => setShowBooking(true)} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                    <FaClock /> احجز الآن
                  </button>
                ) : (
                  <Link to="/login" className="btn-outline w-full text-sm flex items-center justify-center gap-2">
                    <FaArrowRight /> سجّل للحجز
                  </Link>
                )}
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
                  <FaShieldAlt className="text-primary-400" />
                  <span>دفع آمن ومضمون</span>
                </div>
              </div>

              {tutor.trialAvailable && (
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <FaShieldAlt className="text-lg" />
                    <h4 className="font-bold text-sm">{t('trial.guaranteeBadge')}</h4>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">{t('trial.guaranteeText')}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl p-5 text-white text-center">
                <FaChalkboardTeacher className="text-2xl mx-auto mb-2 opacity-80" />
                <h4 className="font-bold text-sm mb-1">هل أنت مدرّس؟</h4>
                <p className="text-xs text-white/80 mb-3">انضم إلى منصتنا وتواصل مع آلاف الطلاب</p>
                <Link to="/become-tutor" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-white/20 inline-block">
                  سجّل الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showBooking} onClose={() => { setShowBooking(false); setBookingStep('form'); setCreatedBookingId(null); setUseTrial(false); }} title={bookingStep === 'form' ? 'حجز جلسة' : 'إتمام الدفع'}>
        {bookingStep === 'form' ? (
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المادة</label>
              <select className="input-field" value={booking.subject} onChange={(e) => setBooking({ ...booking, subject: e.target.value })} required>
                <option value="">اختر المادة</option>
                {tutor?.subjects?.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">طريقة التدريس</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'online', label: 'أونلاين', icon: '🎥' },
                  { value: 'inPerson', label: 'حضوري', icon: '🏫' },
                  { value: 'institute', label: 'معهد', icon: '🏛️' },
                ].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setBooking({ ...booking, mode: opt.value })}
                    className={`p-3 rounded-xl border-2 text-center text-sm font-semibold transition-all ${
                      booking.mode === opt.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary-300'
                    }`}>
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {booking.mode === 'institute' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المعهد</label>
                <select className="input-field" value={booking.instituteId} onChange={(e) => setBooking({ ...booking, instituteId: e.target.value })} required={booking.mode === 'institute'}>
                  <option value="">{loadingInstitutes ? 'جاري التحميل...' : institutes.length === 0 ? 'لا توجد معاهد متاحة' : 'اختر المعهد'}</option>
                  {institutes.map((inst) => (
                    <option key={inst._id} value={inst._id}>{inst.name} - {inst.emirates?.join('، ')}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <AvailabilityCalendar
                tutorId={id}
                selectedDate={selectedCalDate}
                onSelectDate={(d) => {
                  setSelectedCalDate(d);
                  setSelectedSlot(null);
                  setBooking({ ...booking, date: d.toISOString().split('T')[0], startTime: '', duration: 1 });
                }}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  if (slot) {
                    const [sh, sm] = slot.start.split(':').map(Number);
                    const [eh, em] = slot.end.split(':').map(Number);
                    const dur = (eh * 60 + em - sh * 60 - sm) / 60;
                    setBooking({ ...booking, startTime: slot.start, duration: dur, date: selectedCalDate?.toISOString().split('T')[0] || '' });
                  } else {
                    setBooking({ ...booking, startTime: '', duration: 1 });
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FaCity className="text-primary-500 text-xs" /> الموقع
              </label>
              <select className="input-field" value={booking.location} onChange={(e) => setBooking({ ...booking, location: e.target.value })}>
                <option value="">اختر الموقع</option>
                <option value="أونلاين">أونلاين</option>
                {tutor?.emirate && (
                  <>
                    <option value={tutor.emirate}>{tutor.emirate}</option>
                    {tutor.area && <option value={`${tutor.emirate} - ${tutor.area}`}>{tutor.emirate} - {tutor.area}</option>}
                    {getAreas(tutor.emirate).filter(a => a !== tutor.area).map((a) => (
                      <option key={a} value={`${tutor.emirate} - ${a}`}>{tutor.emirate} - {a}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ملاحظات</label>
              <textarea className="input-field" placeholder="أي ملاحظات إضافية..." rows={2} value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
            </div>
            {trialEligibility?.eligible && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-amber-500" />
                    <span className="font-semibold text-sm text-amber-800 dark:text-amber-200">{t('trial.selectTrial')}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={useTrial}
                      onChange={(e) => setUseTrial(e.target.checked)} />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>
                {useTrial && (
                  <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    <p className="flex items-center justify-between">
                      <span>{t('trial.trialPrice')}</span>
                      <span className="font-bold">{trialEligibility.trialPrice} {t('common.aedPerHour')}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>{t('trial.regularPrice')}</span>
                      <span className="line-through text-amber-500">{trialEligibility.regularPrice} {t('common.aedPerHour')}</span>
                    </p>
                    <p className="text-amber-500 font-semibold mt-1">
                      {t('trial.save', { percent: Math.round((1 - trialEligibility.trialPrice / trialEligibility.regularPrice) * 100) })}
                    </p>
                    <p className="mt-1">{t('trial.description')}</p>
                  </div>
                )}
              </div>
            )}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">المدرّس</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{pricing.tutorAmount} درهم</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">رسوم المنصة ({feePercent}%)</span>
                <span className="font-semibold text-primary-500">{pricing.platformFee} درهم</span>
              </div>
              <div className="border-t border-primary-200 dark:border-primary-800 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الإجمالي</span>
                <span className="text-xl font-extrabold text-primary-600">{pricing.total} <span className="text-sm font-medium">درهم</span></span>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">متابعة إلى الدفع</button>
              <button type="button" onClick={() => { setShowBooking(false); setBookingStep('form'); }} className="btn-outline flex-1">إلغاء</button>
            </div>
          </form>
        ) : (
          <PaymentForm amount={tutor?.ratePerHour * booking.duration} platformFee={Math.round(tutor?.ratePerHour * booking.duration * feePercent / 100)} feePercent={feePercent} onSuccess={handlePaymentSuccess} onBack={() => setBookingStep('form')} />
        )}
      </Modal>
    </motion.div>
  );
}

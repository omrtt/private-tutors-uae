import { Link } from 'react-router-dom';
import {
  FaSearch, FaUserGraduate, FaShieldAlt, FaStar, FaArrowLeft,
  FaGraduationCap, FaPlusCircle, FaQuoteRight, FaUsers, FaBookOpen,
  FaFlask, FaLaptopCode, FaBook, FaLanguage, FaDna, FaChartLine,
  FaCheckCircle, FaCertificate, FaAward
} from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TutorCard from '../components/TutorCard';
import Banner from '../components/Banner';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';

const subjectIcons = {
  'الرياضيات': FaChartLine,
  'الفيزياء': FaFlask,
  'الكيمياء': FaFlask,
  'الأحياء': FaDna,
  'اللغة الإنجليزية': FaBook,
  'اللغة العربية': FaLanguage,
  'علوم الحاسوب': FaLaptopCode,
  'البرمجة': FaLaptopCode,
};

const subjects = Object.keys(subjectIcons);

const testimonials = [
  { name: 'أحمد المنصوري', role: 'طالب', text: 'بفضل المدرّسين المتميزين في المنصة، قدر ابني يرفع مستواه في الرياضيات بشكل كبير. أنصح الجميع بتجربتها.', rating: 5, emirate: 'دبي' },
  { name: 'سارة الكتبي', role: 'ولية أمر', text: 'منصة رائعة! وجدت مدرّسة لغة إنجليزية بمستوى ممتاز وبسعر معقول. عملية الحجز كانت سهلة جداً.', rating: 5, emirate: 'أبوظبي' },
  { name: 'محمد آل علي', role: 'طالب جامعي', text: 'ساعدني المدرّس في فهم مواد الفيزياء المتقدمة. المنصة سهلة الاستخدام والتواصل مع المدرّسين كان سلساً.', rating: 4, emirate: 'الشارقة' },
];

function AnimatedCounter({ from = 0, to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = from;
    const increment = (to - from) / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, from, to, duration]);

  return <span ref={ref} className="text-3xl font-extrabold">{count}{suffix}</span>;
}

export default function Home() {
  const { t } = useTranslation();
  const [topTutors, setTopTutors] = useState([]);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    axios.get('/api/tutors?limit=6').then((res) => setTopTutors(res.data.tutors)).catch(() => {});
    axios.get('/api/tests').then((res) => setTests(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.6, delay },
  });

  return (
    <div>
      <SEO title={t('home.seoTitle')} />
      <Banner />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a2e1a] to-emerald-900 pt-24 pb-32 md:pb-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-400 rounded-full opacity-[0.08] blur-[120px]" />
          <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-primary-500 rounded-full opacity-[0.06] blur-[150px]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-400 rounded-full opacity-[0.04] blur-[100px]" />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-white/10 rounded-2xl"
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                left: `${15 + i * 14}%`,
                top: `${10 + (i % 3) * 30}%`,
                rotate: `${i * 25}deg`,
              }}
              animate={{ y: [0, -20, 0], rotate: [i * 25, i * 25 + 10, i * 25], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${4 + (i % 3) * 4}px`,
                height: `${4 + (i % 3) * 4}px`,
                left: `${5 + i * 12}%`,
                top: `${60 + (i % 2) * 25}%`,
              }}
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm text-white/90 shadow-lg mb-8"
          >
            <FaStar className="text-amber-300 text-xs" />
            <span>{t('home.heroBadge', { total: 10 })}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white"
          >
            {t('home.heroTitlePart1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">{t('home.heroTitlePart2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.heroDesc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-12 py-3.5 rounded-xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition"
              />
              <FaSearch className="absolute start-4 top-1/2 -translate-y-1/2 text-white/40" />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3.5 rounded-xl bg-white/10 border border-white/10 outline-none cursor-pointer min-w-[140px] text-white focus:bg-white/20 focus:border-white/30 transition"
            >
              <option value="" className="text-slate-800">{t('home.allSubjects')}</option>
              {subjects.map((s) => <option key={s} value={s} className="text-slate-800">{s}</option>)}
            </select>
            <Link
              to={`/tutors?subject=${selectedSubject}&search=${search}`}
              className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 text-center whitespace-nowrap shadow-lg shadow-amber-500/30"
            >
              {t('home.searchBtn')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <div className="max-w-2xl mx-auto border-t border-white/10 pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                {[
                  { icon: '🏆', text: t('home.trustedTutors') },
                  { icon: '💳', text: t('home.competitivePrices') },
                  { icon: '📅', text: t('home.flexibleBooking') },
                  { icon: '🎯', text: t('home.specializedTutorsFull') },
                  { icon: '🛡️', text: t('home.support247') },
                  { icon: '⭐', text: t('home.qualityGuarantee') },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.06 }}
                    className="flex items-center gap-2 text-white/70"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="text-[13px] font-medium truncate">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: FaSearch, title: t('home.step1Title'), desc: t('home.step1Desc'), gradient: 'from-primary-500 to-emerald-500', shadowColor: 'shadow-primary-500/20' },
            { icon: FaShieldAlt, title: t('home.step2Title'), desc: t('home.step2Desc'), gradient: 'from-amber-500 to-orange-500', shadowColor: 'shadow-amber-500/20' },
            { icon: FaUserGraduate, title: t('home.step3Title'), desc: t('home.step3Desc'), gradient: 'from-violet-500 to-purple-500', shadowColor: 'shadow-violet-500/20' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 flex items-start gap-4 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg ${item.shadowColor}`}>
                <item.icon className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
              <FaBookOpen className="text-white text-xl" />
            </div>
            <h2 className="section-title mb-2">{t('home.browseSubjects')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('home.browseSubjectsDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map((subject, i) => {
              const Icon = subjectIcons[subject];
              const colors = [
                'from-primary-500 to-emerald-500', 'from-amber-500 to-orange-500', 'from-violet-500 to-purple-500', 'from-cyan-500 to-blue-500',
                'from-rose-500 to-pink-500', 'from-teal-500 to-green-500', 'from-indigo-500 to-blue-600', 'from-red-500 to-rose-600',
              ];
              const bgColors = [
                'bg-primary-50 dark:bg-primary-500/10', 'bg-amber-50 dark:bg-amber-500/10', 'bg-violet-50 dark:bg-violet-500/10', 'bg-cyan-50 dark:bg-cyan-500/10',
                'bg-rose-50 dark:bg-rose-500/10', 'bg-teal-50 dark:bg-teal-500/10', 'bg-indigo-50 dark:bg-indigo-500/10', 'bg-red-50 dark:bg-red-500/10',
              ];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link
                    to={`/tutors?subject=${subject}`}
                    className={`block p-4 rounded-2xl ${bgColors[i]} border border-slate-100 dark:border-slate-700/50 hover:shadow-card transition-all duration-200 group text-center`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-200 text-lg`}>
                      {Icon && <Icon className="text-white text-sm" />}
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{subject}</h4>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h2 className="section-title mb-2">{t('tests.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('home.testsSectionDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {tests.map((test, i) => {
              const gradients = [
                'from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-amber-500',
                'from-red-500 to-rose-500', 'from-indigo-500 to-blue-500', 'from-slate-600 to-slate-800', 'from-pink-500 to-rose-500',
                'from-primary-500 to-emerald-500',
              ];
              const bgColors = [
                'bg-blue-50 dark:bg-blue-500/10', 'bg-violet-50 dark:bg-violet-500/10', 'bg-emerald-50 dark:bg-emerald-500/10', 'bg-orange-50 dark:bg-orange-500/10',
                'bg-red-50 dark:bg-red-500/10', 'bg-indigo-50 dark:bg-indigo-500/10', 'bg-slate-100 dark:bg-slate-700', 'bg-pink-50 dark:bg-pink-500/10',
                'bg-primary-50 dark:bg-primary-500/10',
              ];
              const testIconMap = { ALCPT: '🌐', SAT: '🎓', IELTS: '🌍', TOEFL: '📘', ACT: '📐', IGCSE: '📚', ABITUR: '🏛️', Baccalaureate: '🎯', EMSAT: '🇦🇪', 'مدارس': '🏫', 'ترفيع': '📈' };
              return (
                <motion.div key={test._id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link
                    to={`/tests/${test._id}`}
                    className={`block p-4 rounded-2xl ${bgColors[i % bgColors.length]} border border-slate-100 dark:border-slate-700/50 hover:shadow-card transition-all duration-200 group text-center`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-200 text-lg`}>
                      {testIconMap[test.name] || '📚'}
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{test.name}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{t('tests.tutorCountLabel', { count: test.tutorCount || 0 })}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link to="/tests" className="btn-outline inline-flex items-center gap-2 text-sm">
              {t('tests.viewAll')} <FaArrowLeft className="text-xs" />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FaUserGraduate, value: 150, suffix: '+', label: t('home.statCertifiedTutors') },
              { icon: FaUsers, value: 1200, suffix: '+', label: t('home.statRegisteredStudents') },
              { icon: FaBookOpen, value: 850, suffix: '+', label: t('home.statCompletedSessions') },
              { icon: FaStar, value: 4.8, suffix: '', label: t('home.statAverageRating') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/10">
                  <stat.icon className="text-xl opacity-80" />
                </div>
                <AnimatedCounter from={0} to={stat.value} suffix={stat.suffix} />
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <h2 className="section-title mb-2">{t('home.topTutors')}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('home.topTutorsDesc')}</p>
        </div>
        {topTutors.length === 0 ? (
          <EmptyState illustration="tutors" title={t('common.loading')} description={t('home.loadingTutors')} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topTutors.map((tutor, i) => (
              <motion.div key={tutor._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <TutorCard tutor={tutor} index={i} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/tutors" className="btn-outline inline-flex items-center gap-2 group">
            {t('home.viewAllTutors')} <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 px-10 md:px-14 py-12 md:py-16">
              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/80 mb-5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {t('home.ctaBadge')}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                  {t('home.ctaTitle')}
                </h2>
                <p className="text-white/60 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed mb-8">
                  {t('home.ctaDesc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Link to="/become-tutor" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-amber-500/30 w-full sm:w-auto justify-center">
                    <FaPlusCircle /> {t('home.ctaBtn')}
                  </Link>
                  <Link to="/tutors" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto justify-center">
                    {t('home.ctaSecondary')} <FaArrowLeft className="text-xs" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 bg-white/5 rounded-3xl rotate-12 border border-white/10" />
                  <div className="w-48 h-48 bg-white/5 rounded-3xl -rotate-6 border border-white/10 absolute inset-0 -top-3 -right-3 flex items-center justify-center">
                    <FaGraduationCap className="text-7xl text-white/30" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
                    <FaStar className="text-amber-300 text-lg" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-emerald-300 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/20">
            <FaQuoteRight className="text-white text-xl" />
          </div>
          <h2 className="section-title mb-3">{t('home.testimonialsTitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('home.testimonialsDesc')}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-card relative"
          >
            <FaQuoteRight className="text-3xl text-primary-100 dark:text-primary-900/50 absolute top-6 left-6" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, s) => (
                <FaStar key={s} className={s < testimonials[testimonialIndex].rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">"{testimonials[testimonialIndex].text}"</p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {testimonials[testimonialIndex].name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-slate-400">{testimonials[testimonialIndex].role} · {testimonials[testimonialIndex].emirate}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIndex ? 'bg-primary-500 w-6' : 'bg-slate-300 dark:bg-slate-700'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
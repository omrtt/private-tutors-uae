import { Link } from 'react-router-dom';
import { FaSearch, FaUserGraduate, FaShieldAlt, FaStar, FaArrowLeft, FaGraduationCap, FaPlusCircle, FaQuoteRight, FaChevronDown, FaUsers, FaBookOpen, FaClock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TutorCard from '../components/TutorCard';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';

import AnimatedGradient from '../components/AnimatedGradient';
import CTASection from '../components/CTASection';

const subjects = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية', 'اللغة العربية', 'علوم الحاسوب', 'البرمجة'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay },
});

const testimonials = [
  { name: 'أحمد المنصوري', role: 'طالب', text: 'بفضل المدرّسين المتميزين في المنصة، قدر ابني يرفع مستواه في الرياضيات بشكل كبير. أنصح الجميع بتجربتها.', rating: 5, emirate: 'دبي' },
  { name: 'سارة الكتبي', role: 'ولية أمر', text: 'منصة رائعة! وجدت مدرّسة لغة إنجليزية بمستوى ممتاز وبسعر معقول. عملية الحجز كانت سهلة جداً.', rating: 5, emirate: 'أبوظبي' },
  { name: 'محمد آل علي', role: 'طالب جامعي', text: 'ساعدني المدرّس في فهم مواد الفيزياء المتقدمة. المنصة سهلة الاستخدام والتواصل مع المدرّسين كان سلساً.', rating: 4, emirate: 'الشارقة' },
];

export default function Home() {
  const [topTutors, setTopTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    axios.get('/api/tutors?limit=6').then((res) => setTopTutors(res.data.tutors)).catch(() => {});
  }, []);

  return (
    <div>
      <SEO title="خصوصي - منصة المدرسين الخصوصيين في الإمارات" />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800 pt-20 pb-28 md:pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-white/90 shadow-lg mb-8"
          >
            <FaStar className="text-amber-300 text-xs" />
            <span>أكثر من <strong>١٠</strong> مدرّس معتمد في الإمارات
          </span></motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight text-white"
          >
            ابحث عن المدرّس الخصوصي<br />
            <span className="text-amber-300">المناسب في الإمارات</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            تواصل مع مدرّسين معتمدين ومتميزين في جميع الإمارات. من المواد الأكاديمية إلى المهارات المتخصصة، نوصلك بالأفضل.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 border border-white/20 shadow-2xl rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن مادة أو مدرّس..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border-0 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20 transition"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border-0 outline-none cursor-pointer min-w-[140px] text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20 transition"
            >
              <option value="">جميع المواد</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Link
              to={`/tutors?subject=${selectedSubject}&search=${search}`}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-150 text-center whitespace-nowrap shadow-lg shadow-primary-500/30"
            >
              بحث
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-6 md:gap-10 mt-10 text-sm text-white/80"
          >
            <span className="flex items-center gap-2"><span className="w-8 h-8 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-sm">🏆</span> مدرّسين موثّقين</span>
            <span className="flex items-center gap-2"><span className="w-8 h-8 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-sm">💳</span> أسعار تنافسية</span>
            <span className="flex items-center gap-2"><span className="w-8 h-8 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-sm">📅</span> حجز مرن</span>
          </motion.div>
        </div>
      </section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: FaSearch, title: 'ابحث عن مدرّس', desc: 'ابحث حسب المادة أو الإمارة أو السعر للعثور على المدرّس المثالي.' },
            { icon: FaShieldAlt, title: 'ملفات معتمدة', desc: 'جميع المدرّسين موثّقون بمؤهلات حقيقية وتقييمات من الطلاب.' },
            { icon: FaUserGraduate, title: 'احجز بثقة', desc: 'نظام حجز سهل مع جداول مرنة ومدفوعات آمنة.' },
          ].map((item, i) => (
            <div key={i} className="card card-hover p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="py-20 bg-slate-50/50 dark:bg-slate-800/20 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h2 className="section-title mb-2">كيف يعمل الموقع؟</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">أربع خطوات بسيطة لبدء رحلة التعلم</p>
          </div>

          <div className="grid md:grid-cols-4 gap-0 md:gap-4">
            {[
              { icon: FaSearch, title: 'ابحث', desc: 'اختر المادة أو الإمارة أو المدرّس', color: 'from-primary-500 to-emerald-500', bgColor: 'bg-primary-50 dark:bg-primary-500/10' },
              { icon: FaUserGraduate, title: 'اختر', desc: 'قارن المدرّسين حسب التقييم والسعر', color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { icon: FaClock, title: 'احجز', desc: 'اختر الوقت المناسب واحجز فوراً', color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-50 dark:bg-teal-500/10' },
              { icon: FaStar, title: 'تعلّم', desc: 'تواصل مع مدرّسك وابدأ التعلم', color: 'from-cyan-500 to-primary-500', bgColor: 'bg-cyan-50 dark:bg-cyan-500/10' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative flex md:block"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 right-full w-[calc(50%+2rem)] h-0.5 bg-gradient-to-l from-slate-300 dark:from-slate-600 to-transparent" />
                )}
                <div className="flex md:block items-center gap-5 md:gap-0 p-4 md:p-0">
                  <div className={`relative z-10 md:mx-auto w-16 h-16 rounded-2xl md:rounded-3xl ${item.bgColor} flex items-center justify-center shrink-0 md:mb-5 border-2 border-white dark:border-slate-700 shadow-lg`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-inner`}>
                      <item.icon className="text-white text-lg" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-800 flex items-center justify-center text-[11px] font-extrabold text-primary-600 dark:text-primary-400">
                      {i + 1}
                    </span>
                  </div>
                  <div className="md:text-center">
                    <div className="flex md:block items-center gap-2 md:gap-0">
                      <div className={`hidden md:block w-8 h-1 rounded-full bg-gradient-to-r ${item.color} mx-auto mb-2`} />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="bg-gradient-to-r from-primary-500 via-primary-600 to-emerald-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FaUserGraduate, value: 150, suffix: '+', label: 'مدرّس معتمد' },
              { icon: FaUsers, value: 1200, suffix: '+', label: 'طالب مسجّل' },
              { icon: FaBookOpen, value: 850, suffix: '+', label: 'جلسة مكتملة' },
              { icon: FaStar, value: 4.8, suffix: '', label: 'متوسط التقييم' },
            ].map((stat, i) => (
              <div key={i} className="text-center text-white">
                <stat.icon className="text-2xl mx-auto mb-2 opacity-80" />
                <p className="text-3xl font-extrabold">{stat.value}{stat.suffix}</p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FaStar className="text-accent-500 text-lg" />
          </div>
          <h2 className="section-title mb-3">أفضل المدرّسين</h2>
          <p className="text-slate-500 max-w-xl mx-auto">نخبة من المدرّسين المتميزين في مختلف المواد والإمارات</p>
        </div>
        {topTutors.length === 0 ? (
            <EmptyState illustration="tutors" title="جاري التحميل..." description="يتم الآن تحميل أفضل المدرّسين" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topTutors.map((tutor, i) => (
              <motion.div key={tutor._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <TutorCard tutor={tutor} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/tutors" className="btn-outline inline-flex items-center gap-2">
            عرض جميع المدرّسين <FaArrowLeft />
          </Link>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <circle cx="50" cy="50" r="40" fill="white" />
              <circle cx="350" cy="150" r="60" fill="white" />
              <circle cx="200" cy="100" r="30" fill="white" />
            </svg>
          </div>
          <div className="relative">
            <FaGraduationCap className="text-5xl text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">هل أنت مدرّس؟</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
              انضم إلى منصتنا ووصل إلى آلاف الطلاب في جميع أنحاء الإمارات. أنشئ ملفك الشخصي وابدأ باستقبال الحجوزات اليوم.
            </p>
            <Link to="/become-tutor" className="inline-flex items-center gap-2 text-lg bg-accent-400 hover:bg-accent-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-150 shadow-lg shadow-accent-500/30">
              <FaPlusCircle /> سجّل كمدرّس الآن
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FaQuoteRight className="text-primary-500 text-lg" />
          </div>
          <h2 className="section-title mb-3">ماذا يقول الطلاب؟</h2>
          <p className="text-slate-500 max-w-xl mx-auto">آراء حقيقية من طلاب وأولياء أمور استفادوا من خدماتنا</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => {
            const gradients = [
              'from-emerald-500 to-teal-600',
              'from-primary-500 to-indigo-600',
              'from-amber-500 to-orange-600',
            ];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`rounded-3xl bg-gradient-to-br ${gradients[i]} p-1 relative group hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-[calc(1.5rem-4px)] p-6 h-full flex flex-col">
                  <FaQuoteRight className="text-2xl text-white/20 absolute top-4 left-4" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <FaStar key={s} className={s < t.rating ? 'text-amber-300' : 'text-white/20'} />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed mb-4 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-white/60">{t.role} · {t.emirate}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <CTASection />
    </div>
  );
}

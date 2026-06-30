import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaArrowLeft, FaBookOpen, FaUsers, FaChartLine } from 'react-icons/fa';
import SEO from '../components/SEO';

const testIcons = {
  ALCPT: { icon: '🌐', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  SAT: { icon: '🎓', gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  IELTS: { icon: '🌍', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  TOEFL: { icon: '📘', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ACT: { icon: '📐', gradient: 'from-red-500 to-rose-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  IGCSE: { icon: '📚', gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  ABITUR: { icon: '🏛️', gradient: 'from-slate-600 to-slate-800', bg: 'bg-slate-100 dark:bg-slate-700' },
  Baccalaureate: { icon: '🎯', gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
};

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/tests').then((res) => setTests(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title="الاختبارات القياسية" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <FaGraduationCap className="text-white text-2xl" />
          </div>
          <h1 className="section-title mb-3">الاختبارات القياسية</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            استعد لأهم الاختبارات القياسية مع مدرّسين متخصصين. اختر الاختبار المناسب وابدأ رحلتك نحو النجاح.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 animate-pulse shadow-card">
                <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
                <div className="flex gap-1.5">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tests.map((test, i) => {
              const tStyle = testIcons[test.name] || { icon: '📚', gradient: 'from-primary-500 to-emerald-600', bg: 'bg-primary-50 dark:bg-primary-500/10' };
              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link to={`/tests/${test._id}`} className="group block">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-card p-6 transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1 group-hover:border-primary-200 dark:group-hover:border-primary-700 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${tStyle.gradient} opacity-5 rounded-bl-3xl`} />
                      <div className="relative z-10">
                        <div className={`w-14 h-14 ${tStyle.bg} rounded-2xl flex items-center justify-center mb-4 text-2xl`}>
                          {tStyle.icon}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {test.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{test.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {test.subjects?.slice(0, 3).map((s) => (
                            <span key={s} className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-600">
                              {s}
                            </span>
                          ))}
                          {test.subjects?.length > 3 && (
                            <span className="px-2.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">
                              +{test.subjects.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <FaUsers className="text-primary-400" />
                            {test.tutorCount || 0} مدرّس
                          </span>
                          <span className="text-primary-500 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            عرض المدرّسين <FaArrowLeft className="text-[10px]" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/tutors" className="btn-outline inline-flex items-center gap-2">
            تصفح جميع المدرّسين <FaArrowLeft />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

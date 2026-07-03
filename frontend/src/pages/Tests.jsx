import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaArrowLeft, FaUsers, FaBookOpen, FaStar, FaClock, FaGlobeAmericas, FaLanguage, FaCalculator, FaFlask, FaLaptopCode, FaUniversity, FaSchool, FaChartLine, FaAward } from 'react-icons/fa';
import SEO from '../components/SEO';

const testIcons = {
  ALCPT: { icon: FaGlobeAmericas, from: 'from-blue-500', to: 'to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-500/20' },
  SAT: { icon: FaAward, from: 'from-violet-500', to: 'to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', shadow: 'shadow-violet-500/20' },
  IELTS: { icon: FaLanguage, from: 'from-emerald-500', to: 'to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20' },
  TOEFL: { icon: FaGlobeAmericas, from: 'from-orange-500', to: 'to-amber-600', bg: 'bg-orange-50', text: 'text-orange-600', shadow: 'shadow-orange-500/20' },
  ACT: { icon: FaCalculator, from: 'from-red-500', to: 'to-rose-600', bg: 'bg-red-50', text: 'text-red-600', shadow: 'shadow-red-500/20' },
  IGCSE: { icon: FaBookOpen, from: 'from-indigo-500', to: 'to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-600', shadow: 'shadow-indigo-500/20' },
  ABITUR: { icon: FaUniversity, from: 'from-slate-600', to: 'to-slate-800', bg: 'bg-slate-100', text: 'text-slate-700', shadow: 'shadow-slate-600/20' },
  Baccalaureate: { icon: FaAward, from: 'from-pink-500', to: 'to-rose-600', bg: 'bg-pink-50', text: 'text-pink-600', shadow: 'shadow-pink-500/20' },
  'مدارس': { icon: FaSchool, from: 'from-yellow-500', to: 'to-amber-600', bg: 'bg-yellow-50', text: 'text-yellow-600', shadow: 'shadow-yellow-500/20' },
  'ترفيع': { icon: FaChartLine, from: 'from-teal-500', to: 'to-green-600', bg: 'bg-teal-50', text: 'text-teal-600', shadow: 'shadow-teal-500/20' },
};

export default function Tests() {
  const { t } = useTranslation();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/tests').then((res) => setTests(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('tests.seoTitle')} />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <FaGraduationCap className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">{t('tests.heading')}</h1>
          <p className="text-slate-400 max-w-xl mx-auto">{t('tests.subtitle')}</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2" />
                <div className="h-3 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="flex gap-1.5">
                  <div className="h-6 bg-slate-200 rounded-lg w-16" />
                  <div className="h-6 bg-slate-200 rounded-lg w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FaGraduationCap className="text-5xl mx-auto mb-3 opacity-30" />
            <p>لا توجد اختبارات متاحة</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tests.map((test, i) => {
              const tStyle = testIcons[test.name] || { icon: FaGraduationCap, from: 'from-primary-500', to: 'to-emerald-600', bg: 'bg-primary-50', text: 'text-primary-600', shadow: 'shadow-primary-500/20' };
              const Icon = tStyle.icon;
              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link to={`/tests/${test._id}`} className="group block h-full">
                    <div className="h-full bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${tStyle.from} ${tStyle.to} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      <div className={`absolute top-0 end-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br ${tStyle.from} ${tStyle.to} opacity-[2%] group-hover:opacity-[6%] transition-opacity duration-500`} />
                      <div className="p-5 flex flex-col h-full relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 rounded-2xl ${tStyle.bg} flex items-center justify-center ${tStyle.text} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="text-xl" />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <FaUsers className="text-[10px]" />
                            {test.tutorCount || 0}
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{test.name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">{test.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {test.subjects?.slice(0, 3).map((s) => (
                            <span key={s} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[11px] font-medium border border-slate-100">
                              {s}
                            </span>
                          ))}
                          {test.subjects?.length > 3 && (
                            <span className="px-2.5 py-0.5 bg-primary-50 text-primary-600 rounded-lg text-[11px] font-medium">
                              +{test.subjects.length - 3}
                            </span>
                          )}
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
          <Link to="/tutors" className="btn-outline inline-flex items-center gap-2 text-sm">
            {t('tests.browseAllTutors')} <FaArrowLeft />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
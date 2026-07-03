import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaStar, FaArrowLeft, FaFlask, FaPhone, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const emirates = ['الكل', 'أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة', 'العين'];

export default function Institutes() {
  const { t } = useTranslation();
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmirate, setSelectedEmirate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedEmirate && selectedEmirate !== 'الكل') params.set('emirate', selectedEmirate);
    axios.get(`/api/institutes?${params}`).then((res) => setInstitutes(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [selectedEmirate]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title="المعاهد" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <FaBuilding className="text-white text-2xl" />
          </div>
          <h1 className="section-title mb-3">المعاهد التعليمية</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            اعثر على المعهد المناسب لاجتياز اختباراتك القياسية في جميع إمارات الدولة
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {emirates.map((e) => (
            <button
              key={e}
              onClick={() => setSelectedEmirate(e === 'الكل' ? '' : e)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                (e === 'الكل' && !selectedEmirate) || selectedEmirate === e
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 animate-pulse shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-20" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : institutes.length === 0 ? (
          <div className="text-center py-16">
            <FaBuilding className="text-5xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">لا توجد معاهد في هذه الإمارة حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {institutes.map((inst, i) => (
              <motion.div
                key={inst._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/institutes/${inst._id}`} className="group block h-full">
                  <div className="h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-all duration-200 group-hover:shadow-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-t-2xl" />
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                        {inst.logo || '🏫'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {inst.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <FaMapMarkerAlt className="text-[10px]" />
                          <span>{inst.emirates?.join('، ')}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                      {inst.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {inst.tests?.slice(0, 4).map((test) => (
                        <span key={test} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-[11px] font-medium">
                          {test}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-amber-500 flex items-center gap-1">
                        <FaStar className="text-[11px]" />
                        {inst.rating || '-'}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <FaPhone className="text-[10px]" />
                        {inst.phone}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

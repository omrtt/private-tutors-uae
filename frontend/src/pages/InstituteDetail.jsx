import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope, FaGlobe, FaArrowLeft, FaFlask } from 'react-icons/fa';
import SEO from '../components/SEO';

export default function InstituteDetail() {
  const { id } = useParams();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/institutes/${id}`).then((res) => setInstitute(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!institute) return (
    <div className="page-container text-center py-20">
      <FaBuilding className="text-5xl text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500">المعهد غير موجود</p>
      <Link to="/institutes" className="btn-outline inline-flex items-center gap-2 mt-4">
        <FaArrowLeft /> العودة للمعاهد
      </Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={institute.name} />
      <div className="max-w-4xl mx-auto">
        <Link to="/institutes" className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 transition-colors mb-6">
          <FaArrowLeft className="text-xs" /> العودة للمعاهد
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-card">
          <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-emerald-600 relative">
            <div className="absolute -bottom-10 right-8">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-4xl border-2 border-white dark:border-slate-700">
                {institute.logo || '🏫'}
              </div>
            </div>
          </div>

          <div className="pt-14 p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{institute.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-primary-400 text-xs" />
                    {institute.emirates?.join('، ')}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <FaStar className="text-xs" />
                    {institute.rating || '-'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{institute.description}</p>

            {institute.tests?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <FaFlask className="text-primary-500 text-sm" /> الاختبارات المتاحة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {institute.tests.map((test) => (
                    <Link
                      key={test}
                      to={`/tests?test=${test}`}
                      className="px-3 py-1.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                    >
                      {test}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {institute.subjects?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">المواد الدراسية</h3>
                <div className="flex flex-wrap gap-2">
                  {institute.subjects.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-xl text-sm border border-slate-100 dark:border-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">معلومات الاتصال</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {institute.phone && (
                  <a href={`tel:${institute.phone}`} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors group">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      <FaPhone />
                    </div>
                    <span dir="ltr">{institute.phone}</span>
                  </a>
                )}
                {institute.email && (
                  <a href={`mailto:${institute.email}`} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors group">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      <FaEnvelope />
                    </div>
                    <span className="truncate">{institute.email}</span>
                  </a>
                )}
                {institute.website && (
                  <a href={institute.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors group sm:col-span-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      <FaGlobe />
                    </div>
                    <span className="truncate">{institute.website}</span>
                  </a>
                )}
                {institute.address && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500">
                      <FaMapMarkerAlt />
                    </div>
                    <span>{institute.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

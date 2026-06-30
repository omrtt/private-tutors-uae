import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaStar, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import TutorCard from '../components/TutorCard';

export default function TestDetail() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/tests/${id}`),
      axios.get(`/api/tests/${id}/tutors`),
    ]).then(([testRes, tutorsRes]) => {
      setTest(testRes.data);
      setTutors(tutorsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-container">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">جاري التحميل...</span>
        </div>
      </div>
    </div>
  );

  if (!test) return (
    <div className="page-container text-center py-20">
      <p className="text-slate-400">الاختبار غير موجود</p>
      <Link to="/tests" className="btn-primary mt-4 inline-block">العودة للاختبارات</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={test.name} />
      <Breadcrumbs items={[
        { path: '/tests', label: 'الاختبارات القياسية' },
        { label: test.name },
      ]} />

      <div className="max-w-6xl mx-auto">
        <div className="card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-5xl">{test.icon || '📚'}</div>
            <div className="flex-1">
              <h1 className="section-title mb-2">{test.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">{test.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <FaBookOpen className="text-primary-500" />
                  المواد: 
                </span>
                {test.subjects?.map((s) => (
                  <Link key={s} to={`/tutors?subject=${s}`} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FaGraduationCap className="text-primary-500" />
          مدرّسون متخصصون في {test.name}
          <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">({tutors.length})</span>
        </h2>

        {tutors.length === 0 ? (
          <div className="card p-12 text-center">
            <FaGraduationCap className="text-5xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">لا يوجد مدرّسون متخصصون بعد</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">يمكنك تصفح جميع المدرّسين للعثور على من يناسبك</p>
            <Link to="/tutors" className="btn-primary mt-4 inline-block">تصفح المدرّسين</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutors.map((tutor, i) => (
              <motion.div key={tutor._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <TutorCard tutor={tutor} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
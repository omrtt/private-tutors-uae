import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaArrowLeft, FaBookOpen, FaUsers, FaAward, FaGlobeAmericas, FaLanguage, FaCalculator, FaSchool, FaChartLine, FaUniversity, FaChalkboardTeacher } from 'react-icons/fa';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import TutorCard from '../components/TutorCard';

const testIcons = {
  ALCPT: { icon: FaGlobeAmericas },
  SAT: { icon: FaAward },
  IELTS: { icon: FaLanguage },
  TOEFL: { icon: FaGlobeAmericas },
  ACT: { icon: FaCalculator },
  IGCSE: { icon: FaBookOpen },
  ABITUR: { icon: FaUniversity },
  Baccalaureate: { icon: FaAward },
  'مدارس': { icon: FaSchool },
  'ترفيع': { icon: FaChartLine },
};

export default function TestDetail() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/tests/${id}`),
      axios.get(`/api/tests/${id}/tutors`),
    ]).then(([testRes, tutorsRes]) => {
      setTest(testRes.data);
      setTutors(tutorsRes.data);
    }).catch(() => setError(true));
  }, [id]);

  if (error) return (
    <div className="page-container text-center py-20">
      <FaGraduationCap className="text-5xl text-slate-300 mx-auto mb-4" />
      <p className="text-slate-400 mb-4">الاختبار غير موجود</p>
      <Link to="/tests" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl text-sm font-bold hover:bg-primary-600 transition"><FaArrowLeft /> العودة للاختبارات</Link>
    </div>
  );

  if (!test) return (
    <div className="page-container">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  const tStyle = testIcons[test.name] || {};
  const Icon = tStyle.icon || FaGraduationCap;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <SEO title={test.name} />
      <Breadcrumbs items={[{ path: '/tests', label: 'الاختبارات القياسية' }, { label: test.name }]} />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
              <Icon className="text-2xl text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-slate-900 mb-1">{test.name}</h1>
              <p className="text-slate-500 text-sm">{test.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-3 py-2 rounded-xl shrink-0">
              <FaUsers className="text-primary-500" />
              <span className="font-bold text-slate-700">{tutors.length}</span> مدرّس
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">المواد:</span>
            {test.subjects?.map(s => (
              <Link key={s} to={`/tutors?subject=${s}`} className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100 transition">{s}</Link>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FaChalkboardTeacher className="text-primary-500 text-sm" />
          مدرّسون متخصصون في {test.name}
          <span className="text-sm text-slate-400 font-normal">({tutors.length})</span>
        </h2>

        {tutors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <FaGraduationCap className="text-5xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold mb-1">لا يوجد مدرّسون متخصصون بعد</p>
            <p className="text-slate-400 text-sm mb-4">يمكنك تصفح جميع المدرّسين للعثور على من يناسبك</p>
            <Link to="/tutors" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-2xl text-sm font-bold hover:bg-primary-600 transition"><FaArrowLeft /> تصفح المدرّسين</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutors.map((tutor, i) => (
              <motion.div key={tutor._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                <TutorCard tutor={tutor} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
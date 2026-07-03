import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaMoneyBillWave, FaMapMarkerAlt, FaGlobe, FaAward, FaLanguage, FaGraduationCap, FaStar, FaCity } from 'react-icons/fa';
import SEO from '../components/SEO';
import { EMIRATES, getAreas } from '../data/locations';

export default function BecomeTutor() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const emirates = EMIRATES;
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bio: '', subjects: '', qualifications: '', experience: 0, ratePerHour: '',
    emirate: 'دبي', area: '', teachingMode: 'both', languages: '', education: '', isAvailable: true,
    trialAvailable: false, trialPrice: '',
  });

  useEffect(() => {
    if (user?.role === 'tutor') {
      axios.get('/api/tutors/me').then((res) => {
        const t = res.data;
        setForm({
          bio: t.bio || '', subjects: t.subjects?.join('، ') || '', qualifications: t.qualifications?.join('، ') || '',
          experience: t.experience || 0, ratePerHour: t.ratePerHour || '', emirate: t.emirate || 'دبي',
          area: t.area || '', teachingMode: t.teachingMode || 'both', languages: t.languages?.join('، ') || '', education: t.education || '', isAvailable: t.isAvailable,
          trialAvailable: t.trialAvailable || false, trialPrice: t.trialPrice || '',
        });
        setEditing(true);
      }).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      subjects: form.subjects.split('،').map((s) => s.trim()).filter(Boolean),
      qualifications: form.qualifications.split('،').map((q) => q.trim()).filter(Boolean),
      languages: form.languages.split('،').map((l) => l.trim()).filter(Boolean),
      ratePerHour: Number(form.ratePerHour),
      experience: Number(form.experience),
      trialPrice: form.trialAvailable ? Number(form.trialPrice) || Math.round(Number(form.ratePerHour) * 0.5) : 0,
    };

    try {
      if (editing) {
        await axios.put('/api/tutors/profile', data);
        toast.success('تم تحديث الملف الشخصي!');
      } else {
        await axios.post('/api/tutors/profile', data);
        toast.success('تم إنشاء الملف الشخصي!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حفظ الملف الشخصي');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl mx-auto px-4 py-8">
      <SEO title={t('becomeTutor.pageTitle')} />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaChalkboardTeacher className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{editing ? t('becomeTutor.editTitle') : t('becomeTutor.joinTitle')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('becomeTutor.subtitle')}</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaUserGraduate className="text-primary-500" /> {t('becomeTutor.bioLabel')}
            </label>
            <textarea name="bio" className="input-field" rows={3} value={form.bio} onChange={handleChange} placeholder={t('becomeTutor.bioPlaceholder')} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaBookOpen className="text-primary-500" /> المواد التي تدرّسها
            </label>
            <input type="text" name="subjects" className="input-field" value={form.subjects} onChange={handleChange} placeholder="مثال: الرياضيات، الفيزياء، اللغة الإنجليزية" required />
            <p className="text-xs text-slate-400 mt-1">افصل بين المواد بفاصلة (،)</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-500" /> السعر للساعة
              </label>
              <div className="relative">
                <input type="number" name="ratePerHour" className="input-field pl-12" value={form.ratePerHour} onChange={handleChange} required min={1} placeholder="٠" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">درهم</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <FaGraduationCap className="text-primary-500" /> سنوات الخبرة
              </label>
              <input type="number" name="experience" className="input-field" value={form.experience} onChange={handleChange} min={0} placeholder="٠" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-500" /> الإمارة
              </label>
              <select name="emirate" className="input-field" value={form.emirate} onChange={handleChange} required>
                {emirates.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <FaCity className="text-primary-500" /> المنطقة
              </label>
              <select name="area" className="input-field" value={form.area} onChange={handleChange}>
                <option value="">اختر المنطقة</option>
                {getAreas(form.emirate).map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1">اختر منطقتك لعرض أدق للطلاب</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <FaGlobe className="text-primary-500" /> طريقة التدريس
              </label>
              <select name="teachingMode" className="input-field" value={form.teachingMode} onChange={handleChange}>
                <option value="both">أونلاين وحضوري</option>
                <option value="online">أونلاين فقط</option>
                <option value="inPerson">حضوري فقط</option>
              </select>
            </div>
            <div></div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaAward className="text-primary-500" /> المؤهلات
            </label>
            <input type="text" name="qualifications" className="input-field" value={form.qualifications} onChange={handleChange} placeholder="مثال: دكتوراه رياضيات، CELTA، ماجستير فيزياء" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaGraduationCap className="text-primary-500" /> التعليم
            </label>
            <input type="text" name="education" className="input-field" value={form.education} onChange={handleChange} placeholder="مثال: ماجستير، جامعة الإمارات" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <FaLanguage className="text-primary-500" /> اللغات
            </label>
            <input type="text" name="languages" className="input-field" value={form.languages} onChange={handleChange} placeholder="مثال: العربية، الإنجليزية، الفرنسية" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <input type="checkbox" id="available" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
            <label htmlFor="available" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">متاح للحجوزات</label>
          </div>

          {/* Trial Lesson Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                <FaStar className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">الحصة التجريبية</h3>
                <p className="text-xs text-slate-400">قدم حصة تجريبية مخفّضة لجذب طلاب جدد — مستوحى من Preply</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-xl border border-amber-200 dark:border-amber-800">
              <input type="checkbox" id="trialAvailable" checked={form.trialAvailable}
                onChange={(e) => setForm({ ...form, trialAvailable: e.target.checked })}
                className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500" />
              <label htmlFor="trialAvailable" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                تفعيل الحصة التجريبية
              </label>
            </div>

            {form.trialAvailable && (
              <div className="mt-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <FaStar className="text-amber-500" /> سعر الحصة التجريبية
                </label>
                <div className="relative">
                  <input type="number" name="trialPrice" className="input-field pl-12"
                    value={form.trialPrice}
                    onChange={(e) => setForm({ ...form, trialPrice: e.target.value })}
                    min={1} placeholder="اختياري — يحسب تلقائياً ٥٠٪ من السعر العادي" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">درهم</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
                  💡 إذا تركت هذا الحقل فارغاً، سيتم حساب السعر التجريبي تلقائياً (خصم ٥٠٪ من السعر العادي).
                  سيتم عرض شعار "ضمان الرضا — استرداد أموالك" على صفحتك.
                </p>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary w-full text-lg">
            {editing ? 'تحديث الملف الشخصي' : 'إنشاء الملف الشخصي'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

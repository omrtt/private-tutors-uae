import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaClock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRedo, FaChartBar, FaBookOpen, FaBrain, FaCalculator, FaFlask, FaLaptopCode, FaLanguage, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const subjectIcons = {
  'الرياضيات': FaCalculator,
  'الفيزياء': FaFlask,
  'علوم الحاسوب': FaLaptopCode,
  'اللغة العربية': FaLanguage,
  'اللغة الإنجليزية': FaBookOpen,
};
const subjectColors = {
  'الرياضيات': { from: 'from-violet-500', to: 'to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', shadow: 'shadow-violet-500/20' },
  'الفيزياء': { from: 'from-cyan-500', to: 'to-blue-600', bg: 'bg-cyan-50', text: 'text-cyan-600', shadow: 'shadow-cyan-500/20' },
  'علوم الحاسوب': { from: 'from-emerald-500', to: 'to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20' },
  'اللغة العربية': { from: 'from-amber-500', to: 'to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600', shadow: 'shadow-amber-500/20' },
  'اللغة الإنجليزية': { from: 'from-pink-500', to: 'to-rose-600', bg: 'bg-pink-50', text: 'text-pink-600', shadow: 'shadow-pink-500/20' },
};

export default function LevelTest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const levels = [
    { key: 'مبتدئ', label: t('levelTest.levelBeginner'), color: 'text-amber-500', bg: 'bg-amber-50', range: [0, 39] },
    { key: 'متوسط', label: t('levelTest.levelIntermediate'), color: 'text-blue-500', bg: 'bg-blue-50', range: [40, 69] },
    { key: 'متقدم', label: t('levelTest.levelAdvanced'), color: 'text-emerald-500', bg: 'bg-emerald-50', range: [70, 100] },
  ];
  const [tests, setTests] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    axios.get('/api/level-tests').then((res) => setTests(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const startTest = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    try {
      const res = await axios.get(`/api/level-tests/${subject}`);
      setQuestions(res.data.questions);
      setTimeLeft(res.data.questions.length * 60);
      setStarted(true);
      setCurrentQ(0);
      setAnswers({});
      setSubmitted(false);
      setResult(null);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; }), 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  useEffect(() => {
    if (started && timeLeft === 0 && !submitted && questions.length > 0) handleSubmit();
  }, [timeLeft]);

  const handleAnswer = (qId, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const res = await axios.post(`/api/level-tests/${selectedSubject}/submit`, { subject: selectedSubject, answers });
      setResult(res.data);
    } catch {}
  }, [selectedSubject, answers, submitted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (result) {
    const levelInfo = levels.find((l) => result.percent >= l.range[0] && result.percent <= l.range[1]) || levels[0];
    const sc = subjectColors[selectedSubject] || subjectColors['الرياضيات'];
    return (
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="page-container">
        <SEO title={t('levelTest.resultSeoTitle')} />
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center mb-6">
            <div className={`w-20 h-20 rounded-3xl ${sc.bg} flex items-center justify-center mx-auto mb-4`}>
              {result.percent >= 70 ? <FaCheckCircle className="text-4xl text-emerald-500" /> : <FaChartBar className={`text-4xl ${sc.text}`} />}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{t('levelTest.resultHeading')}</h1>
              <p className="text-slate-400 text-sm mb-6 flex items-center justify-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${sc.bg} ${sc.text} text-xs font-bold`}>
                {(() => { const Icon = subjectIcons[selectedSubject] || FaGraduationCap; return <Icon className="text-xs" />; })()}
                {selectedSubject}
              </span>
            </p>

            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <motion.circle
                  initial={{ strokeDashoffset: 327 }}
                  animate={{ strokeDashoffset: 327 - (327 * result.percent / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  cx="60" cy="60" r="52" fill="none"
                  stroke={result.percent >= 70 ? '#10b981' : result.percent >= 40 ? '#6366f1' : '#f59e0b'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="327"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900">{result.percent}<span className="text-lg">%</span></span>
                <span className={`text-xs font-bold mt-0.5 ${levelInfo.color}`}>{levelInfo.label}</span>
              </div>
            </div>

            <p className="text-slate-500 text-sm mb-4">{result.score} / {result.total} إجابات صحيحة</p>

            <div className="flex justify-center gap-1.5 mb-6">
              {questions.map((q, i) => (
                <span key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                  answers[q.id] === q.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  {answers[q.id] === q.correct ? <FaCheckCircle className="text-[10px]" /> : <FaTimesCircle className="text-[10px]" />}
                </span>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => { setStarted(false); setResult(null); setQuestions([]); setSelectedSubject(''); }} className="btn-outline inline-flex items-center gap-2 text-sm">
                <FaRedo /> {t('levelTest.anotherTest')}
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-primary inline-flex items-center gap-2 text-sm">
                <FaArrowLeft /> {t('levelTest.backToDashboard')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><FaBrain className="text-primary-500" /> تفاصيل الإجابات</h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    answers[q.id] === q.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {answers[q.id] === q.correct ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 mb-1">{q.question}</p>
                    <p className="text-xs text-slate-400">
                      {answers[q.id] === q.correct ? 'إجابة صحيحة' : `الإجابة الصحيحة: ${q.options[q.correct]}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="page-container">
        <SEO title={t('levelTest.seoTitle')} />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{t('levelTest.heading')}</h1>
            <p className="text-slate-400 max-w-md mx-auto">{t('levelTest.description')}</p>
          </div>
          {tests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FaGraduationCap className="text-4xl mx-auto mb-3 opacity-30" />
              <p>لا توجد اختبارات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tests.map((t, i) => {
                const Icon = subjectIcons[t.subject] || FaGraduationCap;
                const sc = subjectColors[t.subject] || subjectColors['الرياضيات'];
                return (
                  <motion.button
                    key={t._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3 }}
                    onClick={() => startTest(t.subject)}
                    className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 text-right group"
                  >
                    <div className={`absolute top-0 start-0 w-1.5 h-full bg-gradient-to-b ${sc.from} ${sc.to}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${sc.bg} flex items-center justify-center ${sc.text} group-hover:scale-110 transition-transform`}>
                          <Icon className="text-xl" />
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{t('levelTest.approximately')} {Math.ceil(t.questionCount * 60 / 60)} {t('common.minutes')}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{t.subject}</h3>
                      <p className="text-xs text-slate-400 mb-4">{t.questionCount} {t('levelTest.questions')}</p>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${sc.text} ${sc.bg} px-3 py-1.5 rounded-lg`}>
                        {t('levelTest.startTest')} <FaArrowRight className="text-[10px]" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <SEO title={`الاختبار - ${selectedSubject}`} />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { setStarted(false); setQuestions([]); setSelectedSubject(''); }} className="text-slate-400 hover:text-slate-600 transition text-sm flex items-center gap-1.5">
            <FaArrowLeft /> {t('levelTest.exit')}
          </button>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg text-xs font-medium">
              <span className="text-primary-600 font-bold">{answeredCount}</span>/{questions.length}
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
              timeLeft < 60 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600'
            }`}>
              <FaClock /> {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex gap-1 mb-8">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i === currentQ ? 'bg-primary-500 h-2.5' : answers[questions[i].id] !== undefined ? 'bg-primary-200' : 'bg-slate-200'
              }`} />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <span className="text-primary-500 font-bold">{currentQ + 1}</span>
          <span className="text-slate-300">/</span>
          <span>{questions.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                return (
                  <button key={oi} onClick={() => handleAnswer(q.id, oi)}
                    className={`w-full text-right p-3.5 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold shadow-sm'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50/50'
                    }`}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold shrink-0 ${
                      selected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>{String.fromCharCode(65 + oi)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-50">
              <button onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0}
                className="btn-outline !py-2.5 !px-5 text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5">
                <FaArrowRight className="text-xs" /> {t('levelTest.previous')}
              </button>
              {currentQ < questions.length - 1 ? (
                <button onClick={() => setCurrentQ((p) => p + 1)}
                  className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-1.5">
                  {t('levelTest.next')} <FaArrowLeft className="text-xs" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={answeredCount < questions.length}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white !py-2.5 !px-5 rounded-xl text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
                  <FaCheckCircle /> {t('levelTest.finishTest')}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
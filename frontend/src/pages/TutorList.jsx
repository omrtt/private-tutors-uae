import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TutorCard from '../components/TutorCard';
import { ListSkeleton } from '../components/Skeleton';
import { FaSearch, FaFilter, FaTimes, FaGraduationCap, FaSortAmountDown, FaChevronDown, FaStar, FaDollarSign, FaMapMarkerAlt, FaBook, FaLaptop, FaClipboardList, FaCity } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import { getAreas } from '../data/locations';

const subjects = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية', 'اللغة العربية', 'علوم الحاسوب', 'البرمجة'];

const emirates = ['الكل', 'أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة', 'العين'];

const testIcons = {
  ALCPT: '🌐', SAT: '🎓', IELTS: '🌍', TOEFL: '📘', ACT: '📐', IGCSE: '📚',
  ABITUR: '🏛️', Baccalaureate: '🎯', EMSAT: '🇦🇪',
  'مدارس': '🏫', 'ترفيع': '📈',
};

export default function TutorList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [tests, setTests] = useState([]);

  const getInitialFilters = () => ({
    subject: searchParams.get('subject') || '',
    test: searchParams.get('test') || '',
    emirate: searchParams.get('emirate') || '',
    area: searchParams.get('area') || '',
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    minRating: searchParams.get('minRating') || '',
    teachingMode: searchParams.get('teachingMode') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  const [filters, setFilters] = useState(getInitialFilters);

  useEffect(() => {
    axios.get('/api/tests').then((res) => setTests(res.data)).catch(() => {});
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== '0' && v !== 0) params.set(k, String(v));
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set('limit', '12');
    if (!params.has('sort')) params.set('sort', '');

    axios.get(`/api/tutors?${params}`)
      .then((res) => { setTutors(res.data.tutors); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  const clearFilters = () => setFilters({ subject: '', test: '', emirate: '', minRate: '', maxRate: '', minRating: '', teachingMode: '', sort: '', search: '', page: 1 });

  const hasActiveFilters = filters.subject || filters.test || filters.emirate || filters.area || filters.minRate || filters.maxRate || filters.minRating || filters.teachingMode || filters.search;
  const sortOptions = [
    { value: '', label: t('sortOptions.ratingHighest') },
    { value: 'rate_asc', label: t('sortOptions.priceLowest') },
    { value: 'rate_desc', label: t('sortOptions.priceHighest') },
    { value: 'experience', label: t('sortOptions.experienceMost') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container">
      <SEO title={t('tutorList.seoTitle')} />
      <Breadcrumbs items={[{ label: t('tutorList.breadcrumb') }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title !text-3xl">{t('tutorList.heading')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {loading ? t('common.loading') : `${total} ${t('tutorList.tutorSingular')}${total !== 1 ? t('tutorList.tutorPluralSuffix') : ''} ${t('tutorList.available')}${total !== 1 ? t('tutorList.tutorPluralSuffix') : ''}`}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mr-2 text-primary-500 hover:underline text-sm">{t('tutorList.clearFiltersLabel')}</button>
            )}
          </p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-outline !py-2.5 !px-4 flex items-center gap-2 md:hidden">
          <FaFilter /> {showFilters ? t('common.hide') : t('common.filter')}
        </button>
      </div>

      <div className="flex gap-6">
        <FilterSidebar filters={filters} setFilter={setFilter} clearFilters={clearFilters} hasActiveFilters={hasActiveFilters} showFilters={showFilters} tests={tests} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">{!loading && `${total} ${t('tutorList.resultCount')}`}</p>
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-slate-400 text-sm" />
              <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 outline-none focus:border-primary-400 text-slate-600 dark:text-slate-300"
                value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <ListSkeleton count={6} />
          ) : tutors.length === 0 ? (
            <EmptyState
              illustration="results"
              title={t('tutorList.noResultsTitle')}
              description={t('tutorList.noResultsDescription')}
              actionLabel={t('tutorList.noResultsClear')}
              onAction={clearFilters}
            />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutors.map((tutor, i) => <TutorCard key={tutor._id} tutor={tutor} index={i} />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-1.5 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button key={p}
                      onClick={() => setFilter('page', p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${
                        filters.page === p
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FilterSidebar({ filters, setFilter, clearFilters, hasActiveFilters, showFilters, tests }) {
  const [openSections, setOpenSections] = useState({ emirate: true });
  const areas = filters.emirate ? getAreas(filters.emirate) : [];

  const toggle = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    { key: 'search', icon: FaSearch, label: 'بحث', content: (
      <div className="relative">
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input type="text" className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-500/10 transition placeholder:text-slate-400" placeholder="مادة، اسم..." value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)} />
      </div>
    )},
    { key: 'subject', icon: FaBook, label: 'المادة', badge: filters.subject || null, content: (
      <div className="flex flex-wrap gap-1.5">
        {subjects.map((s) => {
          const active = (filters.subject || 'الكل') === s;
          return (
            <button key={s} onClick={() => setFilter('subject', s === 'الكل' ? '' : s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                active
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}>
              {s}
            </button>
          );
        })}
      </div>
    )},
    { key: 'test', icon: FaClipboardList, label: 'الاختبار القياسي', badge: filters.test || null, content: tests.length === 0 ? (
      <div className="flex flex-wrap gap-1.5">
        <button disabled className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400">
          جاري التحميل...
        </button>
      </div>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setFilter('test', '')}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
            !filters.test
              ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
          }`}>
          الكل
        </button>
        {tests.map((t) => {
          const active = filters.test === t.name;
          return (
            <button key={t._id} onClick={() => setFilter('test', t.name)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition flex items-center gap-1 ${
                active
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}>
              <span className="text-xs">{testIcons[t.name] || '📚'}</span>
              {t.name}
            </button>
          );
        })}
      </div>
    )},
    { key: 'emirate', icon: FaMapMarkerAlt, label: 'الإمارة', badge: filters.emirate || null, content: (
      <div className="flex flex-wrap gap-1.5">
        {emirates.map((e) => {
          const active = (filters.emirate || 'الكل') === e;
          return (
            <button key={e} onClick={() => setFilter('emirate', e === 'الكل' ? '' : e)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                active
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}>
              {e}
            </button>
          );
        })}
      </div>
    )},
    { key: 'area', icon: FaCity, label: 'المنطقة', badge: filters.area || null, content: (
      <div className="flex flex-wrap gap-1.5">
        {areas.length === 0 ? (
          <span className="text-xs text-slate-400 px-1">اختر إمارة أولاً</span>
        ) : (
          <>
            <button onClick={() => setFilter('area', '')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                !filters.area
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}>
              الكل
            </button>
            {areas.map((a) => {
              const active = filters.area === a;
              return (
                <button key={a} onClick={() => setFilter('area', a)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                    active
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}>
                  {a}
                </button>
              );
            })}
          </>
        )}
      </div>
    )},
    { key: 'price', icon: FaDollarSign, label: 'نطاق السعر', badge: (filters.minRate || filters.maxRate) ? `${filters.minRate || '٠'} - ${filters.maxRate || '∞'} درهم` : null, content: (
      <div className="flex gap-2">
        <input type="number" placeholder="من" className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-500/10 transition placeholder:text-slate-400" value={filters.minRate}
          onChange={(e) => setFilter('minRate', e.target.value)} />
        <input type="number" placeholder="إلى" className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-500/10 transition placeholder:text-slate-400" value={filters.maxRate}
          onChange={(e) => setFilter('maxRate', e.target.value)} />
      </div>
    )},
    { key: 'rating', icon: FaStar, label: 'التقييم', badge: filters.minRating ? `${filters.minRating}⭐+` : null, content: (
      <select className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-500/10 transition text-slate-600 dark:text-slate-400" value={filters.minRating}
        onChange={(e) => setFilter('minRating', e.target.value)}>
        <option value="">أي تقييم</option>
        <option value="4">٤ نجوم فأكثر</option>
        <option value="3">٣ نجوم فأكثر</option>
        <option value="2">نجمتين فأكثر</option>
      </select>
    )},
    { key: 'mode', icon: FaLaptop, label: 'طريقة التدريس', badge: filters.teachingMode ? { online: 'أونلاين', inPerson: 'حضوري', both: 'أونلاين + حضوري' }[filters.teachingMode] : null, content: (
      <div className="flex flex-wrap gap-1.5">
        {[
          { value: '', label: 'الكل' },
          { value: 'online', label: 'أونلاين' },
          { value: 'inPerson', label: 'حضوري' },
          { value: 'both', label: 'أونلاين + حضوري' },
        ].map((opt) => {
          const active = (filters.teachingMode || '') === opt.value;
          return (
            <button key={opt.value} onClick={() => setFilter('teachingMode', opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                active
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}>
              {opt.label}
            </button>
          );
        })}
      </div>
    )},
  ];

  return (
    <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
      <motion.div layout className="card p-4 space-y-1 sticky top-20" style={{ position: 'sticky', top: '5rem' }}>
        <div className="flex items-center justify-between px-1 py-2">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaFilter className="text-primary-500 text-xs" /> تصفية
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[11px] text-primary-500 hover:underline font-medium">إعادة تعيين</button>
          )}
        </div>

        {sections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = openSections[sec.key] !== false;
          return (
            <div key={sec.key} className="rounded-xl overflow-hidden">
              <button onClick={() => toggle(sec.key)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition">
                <span className="flex items-center gap-2">
                  <Icon className={`text-xs ${sec.badge ? 'text-primary-500' : 'text-slate-400'}`} />
                  {sec.label}
                  {sec.badge && (
                    <span className="text-[10px] bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-full font-bold">{sec.badge}</span>
                  )}
                </span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FaChevronDown className="text-[10px] text-slate-400" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden">
                    <div className="px-3 pb-3">
                      {sec.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="pt-2 px-1">
          <button onClick={clearFilters} className="w-full py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300 transition">
            إلغاء الفلترة
          </button>
        </div>
      </motion.div>
    </aside>
  );
}

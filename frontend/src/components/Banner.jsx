import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const banners = [
  {
    id: 'summer', icon: '🎉',
    link: '/tutors',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'referral', icon: '👥',
    link: '/tutors',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'tutor-signup', icon: '💡',
    link: '/become-tutor',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

function getTodayBanner() {
  const banners2 = banners;
  return banners2[new Date().getDate() % banners2.length];
}

export default function Banner() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('bannerDismissed') === 'true'; } catch { return false; }
  });

  if (dismissed) return null;

  const banner = getTodayBanner();

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('bannerDismissed', 'true'); } catch {}
  };

  const titles = { summer: t('banner.summerTitle'), referral: t('banner.referralTitle'), 'tutor-signup': t('banner.tutorSignupTitle') };
  const descriptions = { summer: t('banner.summerDescription'), referral: t('banner.referralDescription'), 'tutor-signup': t('banner.tutorSignupDescription') };
  const linkLabels = { summer: t('banner.summerLinkLabel'), referral: t('banner.referralLinkLabel'), 'tutor-signup': t('banner.tutorSignupLinkLabel') };

  return (
    <div className={`bg-gradient-to-r ${banner.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{banner.icon}</span>
          <div className="min-w-0">
            <span className="text-white font-bold text-sm ml-1">{titles[banner.id]}</span>
            <span className="text-white/80 text-xs hidden sm:inline">{descriptions[banner.id]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link to={banner.link}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition backdrop-blur-sm whitespace-nowrap flex items-center gap-1">
            {linkLabels[banner.id]}
            <FaArrowLeft className="text-[9px]" />
          </Link>
          <button onClick={dismiss}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition">
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

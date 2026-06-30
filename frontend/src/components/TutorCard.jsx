import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaCheckCircle, FaHeart, FaRegHeart, FaVideo, FaUserFriends, FaGlobe } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import SubjectBadge from './SubjectBadge';

const modeConfig = {
  online: { icon: FaVideo, label: 'أونلاين', classes: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800' },
  'in-person': { icon: FaUserFriends, label: 'حضوري', classes: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800' },
  both: { icon: FaGlobe, label: 'أونلاين+حضوري', classes: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-800' },
};

export default function TutorCard({ tutor, index }) {
  const { user } = useAuth();
  const { subjects, emirate, ratePerHour, rating, numReviews, experience, isVerified, teachingMode, bio } = tutor;
  const userData = tutor.user || {};
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`/api/favorites/${tutor._id}`).then((r) => setFavorited(r.data.favorited)).catch(() => {});
    }
  }, [user, tutor._id]);

  const toggleFav = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return;
    try {
      const r = await axios.post('/api/favorites/toggle', { tutorId: tutor._id });
      setFavorited(r.data.favorited);
    } catch {}
  };

  const ModeTag = teachingMode && modeConfig[teachingMode];
  const numFullStars = Math.round(rating || 0);

  return (
    <Link to={`/tutors/${tutor._id}`} className="group block animate-slide-up" style={{ animationDelay: `${(index || 0) * 0.05}s` }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1 group-hover:border-primary-200 dark:group-hover:border-primary-700">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center overflow-hidden ring-2 ring-primary-100 dark:ring-primary-800">
                <Avatar name={userData?.name} size="md" radius="none" className="!w-12 !h-12 !rounded-xl" />
              </div>
              {isVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                  <FaCheckCircle className="text-primary-500 text-xs" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {userData?.name || 'مدرّس'}
                </h3>
                {isVerified && (
                  <FaCheckCircle className="text-primary-500 text-xs shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <FaMapMarkerAlt className="text-primary-400 text-[10px]" />
                <span className="text-xs text-slate-500 dark:text-slate-400">{emirate}</span>
              </div>
              {ModeTag && (
                <div className="mt-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${ModeTag.classes}`}>
                    <ModeTag.icon className="text-[10px]" />
                    {ModeTag.label}
                  </span>
                </div>
              )}
            </div>
            <div className="text-left shrink-0">
              <p className="text-xl font-extrabold text-primary-500 leading-none">{ratePerHour}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">درهم/ساعة</p>
            </div>
          </div>

          {bio && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2">
              {bio}
            </p>
          )}

          {subjects?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {subjects.slice(0, 3).map((s, i) => (
                <SubjectBadge label={s} key={i} />
              ))}
              {subjects.length > 3 && (
                <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
                  +{subjects.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={`${s <= numFullStars ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'} text-[11px] ${s <= numFullStars ? 'drop-shadow-sm' : ''}`} />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{rating?.toFixed(1)}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">({numReviews})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FaGraduationCap className="text-primary-400" />
            <span>{experience} سنة خبرة</span>
          </div>
        </div>

        {user && (
          <button
            onClick={toggleFav}
            className={`absolute top-3 left-3 p-2 rounded-xl transition-all duration-200 z-10 ${
              favorited
                ? 'bg-red-50 text-red-500 shadow-sm'
                : 'bg-white/90 text-slate-300 hover:bg-red-50 hover:text-red-400 border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100'
            }`}
          >
            {favorited ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
          </button>
        )}
      </div>
    </Link>
  );
}

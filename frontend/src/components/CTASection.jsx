import { Link } from 'react-router-dom';
import { FaArrowLeft, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 sm:px-12 py-14 sm:py-16 text-white text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">ابدأ رحلتك التعليمية اليوم</h2>
          <p className="text-emerald-100 text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            سواء كنت طالباً تبحث عن مدرّس خصوصي أو مدرّساً تريد مشاركة علمك، منصة خصوصي هي المكان المناسب.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/tutors"
              className="inline-flex items-center gap-2.5 bg-white text-emerald-700 px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaGraduationCap className="text-base" />
              ابحث عن مدرّس
              <FaArrowLeft className="text-xs" />
            </Link>
            <Link
              to="/become-tutor"
              className="inline-flex items-center gap-2.5 bg-emerald-600/30 backdrop-blur-sm text-white border-2 border-white/30 px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/20 hover:border-white/50 transition-all duration-200"
            >
              <FaChalkboardTeacher className="text-base" />
              انضم كمدرّس
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

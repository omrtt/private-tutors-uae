export default function AnimatedBackground({ className = '', variant = 'hero' }) {
  if (variant === 'waves') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg className="absolute bottom-0 w-full h-32 md:h-48" viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ animation: 'waveAnim 8s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path fill="url(#wg)" d="M0,128 C360,160 1080,40 1440,96 L1440,200 L0,200 Z" />
        </svg>
        <style>{`
          @keyframes waveAnim {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.7); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full opacity-[0.018]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke="#475569" strokeWidth="0.4" />
            <circle cx="20" cy="20" r="1.2" fill="#475569" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500 rounded-full opacity-[0.04] blur-3xl"
        style={{ animation: 'bgDrift 15s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full opacity-[0.03] blur-3xl"
        style={{ animation: 'bgDrift 18s ease-in-out infinite reverse' }} />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-amber-400 rounded-full opacity-[0.02] blur-3xl"
        style={{ animation: 'bgDrift 20s ease-in-out infinite' }} />
      <style>{`
        @keyframes bgDrift {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -20px); }
          66% { transform: translate(-20px, 15px); }
        }
      `}</style>
    </div>
  );
}

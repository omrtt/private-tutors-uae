export default function AnimatedGradient({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, #fef3c7 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 90% 80%, #fde68a 0%, transparent 50%),
            radial-gradient(ellipse 70% 40% at 50% 50%, #d1fae5 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 80% 20%, #fbbf24 0%, transparent 50%),
            radial-gradient(ellipse 40% 70% at 20% 80%, #a7f3d0 0%, transparent 50%)
          `,
          animation: 'morphGradient 16s ease-in-out infinite alternate',
        }}
      />
      <div className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 30% 70%, #f59e0b 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 70% 30%, #34d399 0%, transparent 50%),
            radial-gradient(ellipse 70% 40% at 50% 50%, #fcd34d 0%, transparent 50%)
          `,
          animation: 'morphGradient2 20s ease-in-out infinite alternate',
        }}
      />
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
      <style>{`
        @keyframes morphGradient {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(2deg); }
          50% { transform: scale(0.95) rotate(-1deg); }
          75% { transform: scale(1.05) rotate(1.5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes morphGradient2 {
          0% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.15) translate(20px, -15px); }
          66% { transform: scale(0.9) translate(-15px, 10px); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

import { useState, useMemo } from 'react';

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl',
};

const radii = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

const colors = [
  'from-primary-400 to-primary-600',
  'from-emerald-400 to-emerald-600',
  'from-cyan-400 to-cyan-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-accent-400 to-accent-600',
];

export default function Avatar({ name, src, size = 'md', radius = 'lg', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const initial = useMemo(() => name?.charAt(0) || '?', [name]);
  const colorClass = useMemo(() => {
    const idx = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[idx];
  }, [name]);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizes[size]} ${radii[radius]} object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${radii[radius]} bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-extrabold shrink-0 shadow-lg ${className}`}
    >
      {initial}
    </div>
  );
}

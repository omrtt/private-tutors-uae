/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        accent: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        secondary: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'Traditional Arabic', 'Arabic Typesetting', 'Geeza Pro', 'Noto Naskh Arabic', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-lg': '0 8px 24px 0 rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'glow': '0 0 20px -5px rgb(16 185 129 / 0.3)',
        'glow-lg': '0 0 30px -8px rgb(16 185 129 / 0.35)',
        'glow-accent': '0 0 20px -5px rgb(245 158 11 / 0.3)',
        'glass': '0 8px 32px 0 rgb(0 0 0 / 0.08)',
        'premium': '0 20px 60px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgb(255 255 255 / 0.12) 0%, rgb(255 255 255 / 0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgb(30 41 59 / 0.4) 0%, rgb(30 41 59 / 0.1) 100%)',
      },
    },
  },
  plugins: [],
};

import { FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition">
            <FaTimes className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function Tooltip({ children, text, position = 'top' }) {
  const [show, setShow] = useState(false);

  const positions = {
    top: 'bottom-full right-1/2 translate-x-1/2 mb-1.5',
    bottom: 'top-full right-1/2 translate-x-1/2 mt-1.5',
    left: 'top-1/2 -translate-y-1/2 left-full ml-1.5',
    right: 'top-1/2 -translate-y-1/2 right-full mr-1.5',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && text && (
        <div className={`absolute z-50 ${positions[position] || positions.top} whitespace-nowrap`}>
          <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('darkMode', dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

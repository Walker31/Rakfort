import React, { useEffect, useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import clsx from 'clsx';

const DarkModeToggle = React.memo(() => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={clsx(
        'relative p-2 rounded-full transition-colors',
        'hover:bg-black/10 dark:hover:bg-white/10'
      )}
    >
      <div
        className={clsx(
          'absolute inset-0 flex items-center justify-center transition-all duration-300',
          isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
        )}
      >
        <BsMoonFill className="text-xl text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" />
      </div>
      <div
        className={clsx(
          'inset-0 flex items-center justify-center transition-all duration-300',
          isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
        )}
      >
        <BsSunFill className="text-xl text- dark:text-white" />
      </div>
    </button>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';
export default DarkModeToggle;

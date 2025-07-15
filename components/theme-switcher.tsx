'use client'

import { useTheme } from '@libs/client/theme-context'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-lightgray-300 dark:text-gray-400">
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
      <button
        onClick={toggleTheme}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-blue-500' 
            : 'bg-lightgray-100'
        }`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div 
          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm text-lightgray-300 dark:text-gray-400 xl:block hidden">
        {theme === 'light' ? '라이트' : '다크'}
      </span>
    </div>
  )
}
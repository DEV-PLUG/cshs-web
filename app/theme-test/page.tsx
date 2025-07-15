'use client'

import { ThemeProvider } from '@libs/client/theme-context'
import ThemeSwitcher from '@components/theme-switcher'

export default function ThemeTest() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white transition-colors duration-300">
            테마 스위처 테스트
          </h1>
          
          <div className="mb-6">
            <ThemeSwitcher />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                카드 예시
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                이것은 라이트/다크 모드를 테스트하기 위한 카드입니다.
              </p>
            </div>
            
            <input 
              type="text" 
              placeholder="입력 필드 테스트"
              className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
            />
            
            <button className="w-full p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
              버튼 테스트
            </button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
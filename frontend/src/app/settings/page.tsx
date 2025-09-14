'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  // Get theme data from our context
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </header>

      {/* Settings Sections */}
      <main className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <SunIcon className="h-6 w-6 text-yellow-500 mr-3" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose between light and dark mode
                </p>
              </div>
              
              {/* Toggle Button */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                type="button"
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Theme Icons */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SunIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Light</span>
              </div>
              <div className="flex items-center space-x-2">
                <MoonIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Dark</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

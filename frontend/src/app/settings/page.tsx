'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  // Get theme data from our context
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <SunIcon className="h-6 w-6 text-yellow-500 mr-3" />
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
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="switch"
                aria-checked={theme === 'dark'}
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Theme Icons */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SunIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Light</span>
              </div>
              <div className="flex items-center space-x-2">
                <MoonIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Dark</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your personal details
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your account password
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BellIcon className="h-6 w-6 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates via email
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive push notifications
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <LanguageIcon className="h-6 w-6 text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Language</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred language
                </p>
              </div>
              <select className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Currency</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set your default currency
                </p>
              </div>
              <select className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Login History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View your recent login activity
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

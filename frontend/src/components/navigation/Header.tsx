'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/contexts/SidebarContext';
import Breadcrumbs from './Breadcrumbs';
import { showError } from '@/lib/utils/notifications';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { toggleSidebar } = useSidebar();

  const handleSidebarToggle = () => {
    try {
      toggleSidebar();
    } catch (error) {
      showError('Unable to toggle sidebar', 'Please try again.');
    }
  };

  return (
    <header 
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 ${className}`}
      role="banner"
    >
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleSidebarToggle}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Toggle sidebar navigation"
            aria-expanded="false"
            type="button"
          >
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>
          
          {/* Breadcrumbs */}
          <Breadcrumbs />
        </div>
        
        {/* Right side content - placeholder for future features */}
        <div className="flex items-center space-x-4">
          {/* Future: User menu, notifications, etc. */}
        </div>
      </div>
    </header>
  );
}

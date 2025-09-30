'use client';

import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import ToastContainer from '../ui/Toast';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar();

  // Semantic class names for better maintainability
  const mainContentClasses = cn(
    'flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out',
    isOpen ? 'ml-64' : 'ml-0'
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={mainContentClasses}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto focus:outline-none"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

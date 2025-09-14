'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  CogIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  className?: string;
  user?: {
    name: string;
    email: string;
  };
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Notes', href: '/notes', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon }
];

export default function Sidebar({ 
  className = '', 
  user = { name: 'User', email: 'user@example.com' } 
}: SidebarProps) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const sidebarClasses = cn(
    'fixed top-0 left-0 h-full bg-gray-900 dark:bg-gray-800 text-white z-50',
    'transform transition-transform duration-300 ease-in-out w-64',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    className
  );

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={sidebarClasses}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-6 border-b border-gray-700 dark:border-gray-600">
          <h1 className="text-xl font-bold">Finance Manager</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-label="Main menu">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent className="w-5 h-5 mr-3" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700 dark:border-gray-600">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

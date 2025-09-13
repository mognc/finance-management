'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/' }
    ];

    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Handle dynamic routes like [id]
      if (segment.match(/^\d+$/)) {
        // This is likely an ID, get the previous segment to determine the type
        const previousSegment = segments[index - 1];
        if (previousSegment === 'notes') {
          breadcrumbs.push({
            label: 'Note Details',
            href: currentPath
          });
        } else {
          breadcrumbs.push({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: currentPath
          });
        }
      } else {
        // Regular segment
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        // Special cases
        if (segment === 'notes') {
          label = 'Notes';
        } else if (segment === 'new') {
          label = 'New Note';
        }
        
        breadcrumbs.push({
          label,
          href: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on the home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center space-x-2">
          <ChevronRightIcon className="w-4 h-4" />
          {index === breadcrumbs.length - 2 ? (
            <span className="text-gray-900 dark:text-white font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link 
              href={breadcrumb.href}
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

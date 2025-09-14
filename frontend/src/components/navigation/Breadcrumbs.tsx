'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import type { BreadcrumbItem, BreadcrumbsProps } from '@/types';
import { generateBreadcrumbs } from '@/lib/utils';

export default function Breadcrumbs({ homeLabel = 'Dashboard' }: BreadcrumbsProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    return generateBreadcrumbs(pathname, homeLabel);
  }, [pathname, homeLabel]);

  // Don't show breadcrumbs on the home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4"
      aria-label="Breadcrumb navigation"
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Go to home page"
      >
        <HomeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
        {homeLabel}
      </Link>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 2; // -2 because we slice(1)
        return (
          <div key={breadcrumb.href} className="flex items-center space-x-2">
            <ChevronRightIcon 
              className="w-4 h-4" 
              aria-hidden="true"
            />
            {isLast ? (
              <span 
                className="text-gray-900 dark:text-white font-medium"
                aria-current="page"
              >
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
        );
      })}
    </nav>
  );
}

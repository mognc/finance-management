'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export default function BackButton({ 
  fallbackHref = '/', 
  className = '',
  children = 'Back',
  'aria-label': ariaLabel = 'Go back to previous page'
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    try {
      // Use router.back() which is more reliable than window.history
      // Next.js router handles the history management properly
      router.back();
    } catch (error) {
      // Fallback to a specific route if router.back() fails
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        'inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400',
        'hover:text-gray-900 dark:hover:text-white transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      aria-label={ariaLabel}
      type="button"
    >
      <ArrowLeftIcon className="w-4 h-4 mr-1" aria-hidden="true" />
      {children}
    </button>
  );
}

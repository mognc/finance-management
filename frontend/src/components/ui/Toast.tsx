'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { notificationManager } from '@/lib/utils/notifications';
import type { Toast } from '@/lib/utils/notifications';

const ToastComponent = ({ toast }: { toast: Toast }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => notificationManager.removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700';
      case 'error':
        return 'bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
      default:
        return 'bg-gray-50 border-gray-300 dark:bg-gray-900/30 dark:border-gray-700';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`min-w-[320px] max-w-md ${getBackgroundColor()} border rounded-lg shadow-xl p-4 backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">
              {toast.title}
            </p>
            {toast.message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                {toast.message}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <button
              className="rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} />
        </div>
      ))}
    </div>
  );
}

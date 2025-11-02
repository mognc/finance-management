// Simple toast notification system
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

class NotificationManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  // Subscribe to toast changes
  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Add a new toast
  addToast(toast: Omit<Toast, 'id'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    this.toasts.push(newToast);
    this.notifyListeners();

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, newToast.duration);
    }

    return id;
  }

  // Remove a toast
  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  // Convenience methods
  success(title: string, message?: string, duration?: number): string {
    return this.addToast({ 
      type: 'success', 
      title, 
      ...(message !== undefined && { message }), 
      ...(duration !== undefined && { duration }) 
    });
  }

  error(title: string, message?: string, duration?: number): string {
    return this.addToast({ 
      type: 'error', 
      title, 
      ...(message !== undefined && { message }), 
      ...(duration !== undefined && { duration }) 
    });
  }

}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Convenience functions
export const showSuccess = (title: string, message?: string) => 
  notificationManager.success(title, message);

export const showError = (title: string, message?: string) => 
  notificationManager.error(title, message);

// Toast notification examples for your finance management app
import toast from 'react-hot-toast';

// Success notifications
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

// Error notifications
export const showErrorToast = (message: string) => {
  toast.error(message);
};

// Loading notifications
export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

// Promise-based notifications (great for API calls)
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};

// Custom toast with actions
// export const showActionToast = (message: string, action?: () => void) => {
//   toast(message, {
//     duration: 6000,
//     position: 'top-center',
//     action: action ? {
//       label: 'Undo',
//       onClick: action,
//     } : undefined,
//   });
// };

// Examples for your finance app:
export const financeToastExamples = {
  // Note operations
  noteCreated: () => showSuccessToast('Note created successfully!'),
  noteUpdated: () => showSuccessToast('Note updated successfully!'),
//   noteDeleted: () => showActionToast('Note deleted', () => {
//     // Undo delete logic here
//     showSuccessToast('Note restored!');
//   }),
  
  // Settings
  settingsSaved: () => showSuccessToast('Settings saved successfully!'),
  
  // Errors
  networkError: () => showErrorToast('Network error. Please check your connection.'),
  saveError: () => showErrorToast('Failed to save. Please try again.'),
  
  // Loading states
  saving: () => showLoadingToast('Saving...'),
  loading: () => showLoadingToast('Loading...'),
};

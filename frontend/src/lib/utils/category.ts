
/**
 * Note categories configuration
 */
export const NOTE_CATEGORIES = [
  { id: 'all', name: 'All Notes' },
  { id: 'bullet-points', name: 'Bullet Points' },
  { id: 'plans', name: 'Plans' },
  { id: 'strategies', name: 'Strategies' },
  { id: 'wishlist', name: 'Wishlist' },
  { id: 'other', name: 'Other' },
] as const;

/**
 * Get category name by ID
 */
export function getCategoryName(categoryId: string): string {
  const category = NOTE_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.name || 'Other';
}

/**
 * Get category color classes for styling
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'bullet-points':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
    case 'plans':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    case 'strategies':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    case 'wishlist':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
}
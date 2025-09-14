import type { NavigationItem, BreadcrumbItem } from '@/types';

/**
 * Main navigation items
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
  },
  {
    name: 'Notes',
    href: '/notes',
  },
  {
    name: 'Settings',
    href: '/settings',
  },
];

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(pathname: string, homeLabel: string = 'Dashboard'): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: homeLabel, href: '/' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: homeLabel, href: '/' }
  ];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Handle special cases
    if (segment === 'notes') {
      if (segments[index + 1] === 'new') {
        breadcrumbs.push({ label: 'New Note', href: currentPath });
      } else if (segments[index + 1] && segments[index + 1] !== 'new') {
        // This is a note ID, we'll show it as "Edit Note" for now
        breadcrumbs.push({ label: 'Edit Note', href: currentPath });
      } else {
        breadcrumbs.push({ label: 'Notes', href: currentPath });
      }
    } else if (segment === 'new') {
      // Skip 'new' as it's handled above
      return;
    } else if (segment === 'settings') {
      breadcrumbs.push({ label: 'Settings', href: currentPath });
    } else {
      // Generic handling for other segments
      const previousSegment = segments[index - 1];
      const resourceType = previousSegment 
        ? previousSegment.charAt(0).toUpperCase() + previousSegment.slice(1) 
        : segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (isLast && previousSegment) {
        // This is likely a resource ID
        breadcrumbs.push({ label: `Edit ${resourceType}`, href: currentPath });
      } else {
        breadcrumbs.push({ 
          label: resourceType, 
          href: currentPath 
        });
      }
    }
  });

  return breadcrumbs;
}

/**
 * Check if a path is active
 */
export function isActivePath(currentPath: string, targetPath: string): boolean {
  if (targetPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(targetPath);
}

/**
 * Get navigation item by href
 */
export function getNavigationItem(href: string): NavigationItem | undefined {
  return NAVIGATION_ITEMS.find(item => item.href === href);
}

/**
 * Get all navigation items with active state
 */
export function getNavigationItemsWithActiveState(currentPath: string): NavigationItem[] {
  return NAVIGATION_ITEMS.map(item => ({
    ...item,
    current: isActivePath(currentPath, item.href),
  }));
}

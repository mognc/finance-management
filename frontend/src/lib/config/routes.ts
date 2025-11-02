/**
 * Centralized route configuration
 * This single source of truth makes it easy to add new routes and maintain navigation
 */

import type { NavigationItem } from '@/types';
import { 
  HomeIcon,
  CogIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

export interface RouteConfig {
  /** Path segment (e.g., 'notes', 'finance') */
  segment: string;
  /** Display label for this route */
  label: string;
  /** Full href path */
  href: string;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether this route should appear in main navigation */
  showInNav?: boolean;
  /** Custom breadcrumb label (if different from route label) */
  breadcrumbLabel?: string;
  /** Routes that follow this segment (for dynamic routes like /notes/[id]) */
  childRoutes?: {
    /** Path segment after parent (e.g., 'new') */
    segment: string;
    /** Label for breadcrumb */
    label: string;
    /** Full href (can include dynamic parts) */
    href?: string;
  }[];
}

/**
 * Main route configuration
 * Add new routes here - this is the single source of truth
 */
export const ROUTES: RouteConfig[] = [
  {
    segment: '',
    label: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    showInNav: true,
  },
  {
    segment: 'notes',
    label: 'Notes',
    href: '/notes',
    icon: DocumentTextIcon,
    showInNav: true,
    childRoutes: [
      {
        segment: 'new',
        label: 'New Note',
        href: '/notes/new',
      },
      {
        segment: '[id]',
        label: 'Edit Note',
        href: '/notes/[id]',
      },
    ],
  },
  {
    segment: 'finance',
    label: 'Finance',
    href: '/finance',
    icon: CurrencyDollarIcon,
    showInNav: true,
  },
  {
    segment: 'goals',
    label: 'Goals',
    href: '/goals',
    icon: FlagIcon,
    showInNav: true,
  },
  {
    segment: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: CogIcon,
    showInNav: true,
  },
];

/**
 * Get navigation items for sidebar/menu
 * Filters routes that should appear in navigation
 */
export function getNavigationItems(): NavigationItem[] {
  return ROUTES
    .filter(route => route.showInNav !== false && route.icon)
    .map(route => ({
      name: route.label,
      href: route.href,
      icon: route.icon!,
    }));
}

/**
 * Find route config by path segment
 */
export function findRouteBySegment(segment: string): RouteConfig | undefined {
  return ROUTES.find(route => route.segment === segment);
}

/**
 * Find route config by full href
 */
export function findRouteByHref(href: string): RouteConfig | undefined {
  return ROUTES.find(route => route.href === href);
}

/**
 * Get breadcrumb label for a route segment
 */
export function getBreadcrumbLabel(segment: string): string {
  const route = findRouteBySegment(segment);
  if (route?.breadcrumbLabel) {
    return route.breadcrumbLabel;
  }
  if (route?.label) {
    return route.label;
  }
  
  // Fallback: capitalize the segment
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}


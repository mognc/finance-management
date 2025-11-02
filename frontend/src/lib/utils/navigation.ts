import type { BreadcrumbItem } from '@/types';
import { findRouteBySegment, getBreadcrumbLabel } from '@/lib/config/routes';

/**
 * Generate breadcrumbs from pathname using route configuration
 * just add routes to routes.ts config
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
    const previousSegment = index > 0 ? segments[index - 1] : undefined;
    const route = findRouteBySegment(segment);
    
    // Check if this is a child route (e.g., 'new' after 'notes')
    if (previousSegment) {
      const parentRoute = findRouteBySegment(previousSegment);
      const childRoute = parentRoute?.childRoutes?.find(cr => 
        cr.segment === segment || cr.segment === '[id]'
      );
      
      if (childRoute) {
        breadcrumbs.push({ 
          label: childRoute.label, 
          href: currentPath 
        });
        return;
      }
    }
    
    // Check if this is a known route
    if (route) {
      breadcrumbs.push({ 
        label: route.breadcrumbLabel || route.label, 
        href: currentPath 
      });
      return;
    }
    
    // Unknown segment - check if it's a dynamic ID (UUID pattern or numeric)
    const isLikelyId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) 
      || /^\d+$/.test(segment);
    
    if (isLikelyId && previousSegment) {
      const parentRoute = findRouteBySegment(previousSegment);
      const childRoute = parentRoute?.childRoutes?.find(cr => cr.segment === '[id]');
      
      if (childRoute) {
        breadcrumbs.push({ 
          label: childRoute.label, 
          href: currentPath 
        });
        return;
      }
      
      // Fallback: "Edit [Resource]"
      breadcrumbs.push({ 
        label: `Edit ${getBreadcrumbLabel(previousSegment)}`, 
        href: currentPath 
      });
      return;
    }
    
    // Generic fallback for unknown segments
    breadcrumbs.push({ 
      label: getBreadcrumbLabel(segment), 
      href: currentPath 
    });
  });

  return breadcrumbs;
}

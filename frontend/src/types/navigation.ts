// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  homeLabel?: string;
  items?: BreadcrumbItem[];
}

// Navigation Component Props
export interface SidebarProps {
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface HeaderProps {
  className?: string;
}

export interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
}

// Route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
}

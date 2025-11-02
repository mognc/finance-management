import { 
  Target, DollarSign, Calendar, Plane, GraduationCap, Home, Heart, Smartphone, Shield, 
  TrendingUp as TrendingUpIcon, Flag, Star, Briefcase, Users, Book, Dumbbell, 
  Palette, Zap, Leaf, Music, Camera, Gamepad2, Palette as Art
} from 'lucide-react';

/**
 * Icon mapping for goal categories
 * Maps category names to their corresponding Lucide icons
 */
export const CATEGORY_ICON_MAP: Record<string, any> = {
  // Financial
  'Financial Goals': DollarSign,
  'Investment': TrendingUpIcon,
  'Savings': DollarSign,
  'Emergency Fund': Shield,
  
  // Time-based
  'Daily Life Goals': Calendar,
  'Long Term Goals': Flag,
  'Short Term Goals': Zap,
  
  // Personal Development
  'Personal Growth': Star,
  'Education': GraduationCap,
  'Learning': Book,
  'Career': Briefcase,
  'Professional Development': Briefcase,
  'Skills Development': Zap,
  
  // Health & Fitness
  'Health': Heart,
  'Fitness': Dumbbell,
  'Wellness': Heart,
  'Mental Health': Heart,
  
  // Lifestyle
  'Travel': Plane,
  'Lifestyle': Home,
  'Home': Home,
  'Family': Users,
  'Relationships': Users,
  'Social': Users,
  'Hobbies': Palette,
  'Creative': Palette,
  'Art': Art,
  'Music': Music,
  'Photography': Camera,
  'Gaming': Gamepad2,
  'Sports': Dumbbell,
  
  // Technology & Environment
  'Technology': Smartphone,
  'Environmental': Leaf,
  'Sustainability': Leaf,
  
  // Other
  'Emergency': Shield,
  'General': Target,
  'Custom': Target,
};

/**
 * Predefined category options with icons and colors
 * These are the default categories available when creating goals
 */
export const DEFAULT_CATEGORIES: Array<{ name: string; description: string; icon: string; color: string }> = [
  { name: 'Financial Goals', description: 'Money, savings, and financial objectives', icon: 'dollar-sign', color: '#10b981' },
  { name: 'Career', description: 'Professional and career development goals', icon: 'briefcase', color: '#3b82f6' },
  { name: 'Health', description: 'Health and wellness goals', icon: 'heart', color: '#ef4444' },
  { name: 'Fitness', description: 'Physical fitness and exercise goals', icon: 'dumbbell', color: '#f59e0b' },
  { name: 'Education', description: 'Learning and educational goals', icon: 'graduation-cap', color: '#8b5cf6' },
  { name: 'Personal Growth', description: 'Self-improvement and personal development', icon: 'star', color: '#f59e0b' },
  { name: 'Travel', description: 'Travel and adventure goals', icon: 'plane', color: '#06b6d4' },
  { name: 'Relationships', description: 'Family, friends, and relationship goals', icon: 'users', color: '#ec4899' },
  { name: 'Hobbies', description: 'Hobbies and recreational activities', icon: 'palette', color: '#a855f7' },
  { name: 'Home', description: 'Home improvement and lifestyle goals', icon: 'home', color: '#84cc16' },
  { name: 'Technology', description: 'Tech-related goals and learning', icon: 'smartphone', color: '#6366f1' },
  { name: 'Creative', description: 'Artistic and creative pursuits', icon: 'palette', color: '#f97316' },
  { name: 'Daily Life Goals', description: 'Daily habits and routines', icon: 'calendar', color: '#3b82f6' },
  { name: 'Long Term Goals', description: 'Long-term life objectives', icon: 'flag', color: '#8b5cf6' },
  { name: 'Emergency Fund', description: 'Emergency savings and safety nets', icon: 'shield', color: '#06b6d4' },
  { name: 'Investment', description: 'Investment and wealth building', icon: 'trending-up', color: '#84cc16' },
  { name: 'Sports', description: 'Sports and athletic goals', icon: 'dumbbell', color: '#14b8a6' },
  { name: 'Music', description: 'Musical goals and learning', icon: 'music', color: '#f43f5e' },
  { name: 'Learning', description: 'Continuous learning goals', icon: 'book', color: '#6366f1' },
  { name: 'Environmental', description: 'Environmental and sustainability goals', icon: 'leaf', color: '#22c55e' },
];

/**
 * Default color for categories that don't have a specific color assigned
 */
export const DEFAULT_CATEGORY_COLOR = '#6b7280';

/**
 * Default icon for categories that don't have a specific icon
 */
export const DEFAULT_CATEGORY_ICON = Target;


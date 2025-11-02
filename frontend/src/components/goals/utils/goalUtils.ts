import type { GoalWithSubgoals, GoalCategory } from '@/lib/api';
import { CATEGORY_ICON_MAP, DEFAULT_CATEGORY_ICON, DEFAULT_CATEGORY_COLOR } from '../constants/goalConstants';

/**
 * Gets the icon component for a given category name
 * @param categoryName - The name of the category
 * @returns The Lucide React icon component for the category, or default icon if not found
 */
export const getCategoryIcon = (categoryName: string) => {
  return CATEGORY_ICON_MAP[categoryName] || DEFAULT_CATEGORY_ICON;
};

// Re-export defaultCategories for backward compatibility
export { DEFAULT_CATEGORIES as defaultCategories } from '../constants/goalConstants';

/**
 * Gets the color for a given category name
 * @param categoryName - The name of the category
 * @param goalCategories - Array of goal categories to search in
 * @returns The hex color code for the category, or default color if not found
 */
export const getCategoryColor = (categoryName: string, goalCategories: GoalCategory[]) => {
  const category = goalCategories.find(c => c.name === categoryName);
  return category?.color || DEFAULT_CATEGORY_COLOR;
};

export const calculateOverallProgress = (goalGroup: GoalWithSubgoals) => {
  const mainGoal = goalGroup.goal;
  const subgoals = goalGroup.subgoals || [];
  
  // If it's a boolean/completion type goal, check if it's completed
  if (mainGoal.goal_type === 'boolean' || mainGoal.progress_type === 'completion') {
    return mainGoal.is_completed ? 100 : 0;
  }
  
  // For numeric goals, calculate based on current progress vs target
  const mainTarget = mainGoal.target_amount || mainGoal.target_value || 0;
  const mainProgress = mainGoal.current_progress || 0;
  
  if (subgoals.length === 0) {
    return mainTarget > 0 ? Math.min(100, (mainProgress / mainTarget) * 100) : 0;
  }
  
  // For goals with subgoals, calculate weighted progress
  const totalSubgoalsTarget = subgoals.reduce((sum: number, sub: any) => 
    sum + (sub.target_amount || sub.target_value || 0), 0);
  const totalSubgoalsProgress = subgoals.reduce((sum: number, sub: any) => 
    sum + (sub.current_progress || 0), 0);
  
  const totalTarget = mainTarget + totalSubgoalsTarget;
  const totalProgress = mainProgress + totalSubgoalsProgress;
  
  return totalTarget > 0 ? Math.min(100, (totalProgress / totalTarget) * 100) : 0;
};

export const getProgressStatus = (progress: number) => {
  const { CheckCircle, Award, TrendingUp, Clock, AlertCircle } = require('lucide-react');
  
  if (progress >= 100) return { status: 'completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
  if (progress >= 75) return { status: 'excellent', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Award };
  if (progress >= 50) return { status: 'good', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: TrendingUp };
  if (progress >= 25) return { status: 'started', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Clock };
  return { status: 'not-started', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle };
};

export const getGoalPriority = (goal: any) => {
  const { Flag, Clock, Star } = require('lucide-react');
  
  const daysUntilTarget = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  if (daysUntilTarget && daysUntilTarget < 30) return { priority: 'high', color: 'text-red-600', bgColor: 'bg-red-100', icon: Flag };
  if (daysUntilTarget && daysUntilTarget < 90) return { priority: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock };
  return { priority: 'low', color: 'text-green-600', bgColor: 'bg-green-100', icon: Star };
};


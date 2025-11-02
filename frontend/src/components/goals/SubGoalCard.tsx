import { Edit3, PiggyBank, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GoalCategory } from '@/lib/api';
import { getCategoryIcon, getCategoryColor } from './utils/goalUtils';
import { MiniProgressBar } from './MiniProgressBar';

interface SubGoalCardProps {
  subgoal: any;
  goalCategories: GoalCategory[];
  onContribute: (goalId: string) => void;
  onUpdateProgress: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onEdit: (goalId: string) => void;
}

export default function SubGoalCard({
  subgoal,
  goalCategories,
  onContribute,
  onUpdateProgress,
  onComplete,
  onEdit,
}: SubGoalCardProps) {
  const SubCategoryIcon = getCategoryIcon(subgoal.category);
  const subCategoryColor = getCategoryColor(subgoal.category, goalCategories);
  const subProgress = subgoal.is_completed ? 100 : 
    (subgoal.current_progress && (subgoal.target_amount || subgoal.target_value)) ? 
    Math.min(100, (subgoal.current_progress / (subgoal.target_amount || subgoal.target_value)) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${subCategoryColor}15`, color: subCategoryColor }}
          >
            <SubCategoryIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium truncate ${subgoal.is_completed ? 'text-green-600 line-through' : 'text-gray-900 dark:text-white'}`}>
              {subgoal.name}
            </h4>
            {subgoal.is_completed && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅
              </span>
            )}
            <span 
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: subCategoryColor }}
            >
              {subgoal.category}
            </span>
          </div>
          <MiniProgressBar 
            pct={subProgress} 
            amount={subgoal.current_progress || 0} 
            target={subgoal.target_amount || subgoal.target_value || 0}
            goalType={subgoal.goal_type || 'financial'}
          />
        </div>
        <div className="flex items-center gap-2">
          {!subgoal.is_completed && (
            <>
              {subgoal.goal_type === 'financial' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onContribute(subgoal.id)}
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  title="Contribute"
                >
                  <PiggyBank className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdateProgress(subgoal.id)}
                className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                title="Update Progress"
              >
                <TrendingUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onComplete(subgoal.id)}
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                title="Mark as Complete"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(subgoal.id)}
            className="h-8 w-8 p-0"
            title="Edit Sub-goal"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}


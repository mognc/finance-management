import { DollarSign, Calendar, Edit3, Trash2, PiggyBank, TrendingUp, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GoalWithSubgoals, GoalCategory } from '@/lib/api';
import { formatDateShort } from '@/lib/utils/date';
import { getCategoryIcon, getCategoryColor, calculateOverallProgress, getProgressStatus, getGoalPriority } from './utils/goalUtils';
import { ProgressChart } from './ProgressChart';
import SubGoalCard from './SubGoalCard';

interface GoalCardProps {
  goalGroup: GoalWithSubgoals;
  goalCategories: GoalCategory[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onContribute: (goalId: string) => void;
  onUpdateProgress: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalCard({
  goalGroup,
  goalCategories,
  isExpanded,
  onToggleExpand,
  onContribute,
  onUpdateProgress,
  onComplete,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const CategoryIcon = getCategoryIcon(goalGroup.goal.category);
  const categoryColor = getCategoryColor(goalGroup.goal.category, goalCategories);
  const overallProgress = calculateOverallProgress(goalGroup);
  const progressStatus = getProgressStatus(overallProgress);
  const priority = getGoalPriority(goalGroup.goal);
  const PriorityIcon = priority.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Main Goal Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="p-3 rounded-xl shadow-sm"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                <CategoryIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-bold ${goalGroup.goal.is_completed ? 'text-green-600 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {goalGroup.goal.name}
                  </h3>
                  {goalGroup.goal.is_completed && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      ✅ Completed
                    </span>
                  )}
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {goalGroup.goal.category}
                  </span>
                  {!goalGroup.goal.is_completed && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                      <PriorityIcon className="h-3 w-3 inline mr-1" />
                      {priority.priority}
                    </div>
                  )}
                </div>
                {goalGroup.goal.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{goalGroup.goal.description}</p>
                )}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Target: <span className="font-semibold text-gray-900 dark:text-white">
                        {goalGroup.goal.goal_type === 'financial' ? 
                          `$${(goalGroup.goal.target_amount || 0).toLocaleString()}` : 
                          `${goalGroup.goal.target_value || goalGroup.goal.target_amount || 0}`}
                      </span>
                    </span>
                  </div>
                  {goalGroup.goal.target_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDateShort(goalGroup.goal.target_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(overallProgress)}%</span>
                  <div className={`p-1 rounded-full ${progressStatus.bgColor}`}>
                    <progressStatus.icon className={`h-4 w-4 ${progressStatus.color}`} />
                  </div>
                </div>
              </div>
              <ProgressChart pct={overallProgress} size="large" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-6">
            {!goalGroup.goal.is_completed && (
              <>
                {goalGroup.goal.goal_type === 'financial' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onContribute(goalGroup.goal.id)}
                    className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Contribute"
                  >
                    <PiggyBank className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateProgress(goalGroup.goal.id)}
                  className="text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  title="Update Progress"
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onComplete(goalGroup.goal.id)}
                  className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  title="Mark as Complete"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(goalGroup.goal.id)}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Edit Goal"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(goalGroup.goal.id)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete Goal"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sub-goals Section */}
      {goalGroup.subgoals.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30">
          <Button
            variant="ghost"
            onClick={onToggleExpand}
            className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {goalGroup.subgoals.length} Sub-goal{goalGroup.subgoals.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Total: ${goalGroup.subgoals.reduce((sum: number, sub: any) => sum + (sub.target_amount || sub.target_value || 0), 0).toLocaleString()}</span>
              </div>
            </div>
          </Button>
          
          {isExpanded && (
            <div className="mt-4 space-y-3">
              {goalGroup.subgoals.map((subgoal: any) => (
                <SubGoalCard
                  key={subgoal.id}
                  subgoal={subgoal}
                  goalCategories={goalCategories}
                  onContribute={onContribute}
                  onUpdateProgress={onUpdateProgress}
                  onComplete={onComplete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


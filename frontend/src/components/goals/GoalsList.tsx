import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GoalWithSubgoals, GoalCategory } from '@/lib/api';
import GoalCard from './GoalCard';

interface GoalsListProps {
  hierarchicalGoals: GoalWithSubgoals[];
  goalCategories: GoalCategory[];
  expandedGoals: Set<string>;
  onToggleExpand: (goalId: string) => void;
  onCreateGoal: () => void;
  onContribute: (goalId: string) => void;
  onUpdateProgress: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalsList({
  hierarchicalGoals,
  goalCategories,
  expandedGoals,
  onToggleExpand,
  onCreateGoal,
  onContribute,
  onUpdateProgress,
  onComplete,
  onEdit,
  onDelete,
}: GoalsListProps) {
  if (hierarchicalGoals.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
          <Target className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your first goal to start tracking your progress and achieving your dreams</p>
        <Button 
          onClick={onCreateGoal}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Goal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hierarchicalGoals.map((goalGroup) => (
        <GoalCard
          key={goalGroup.goal.id}
          goalGroup={goalGroup}
          goalCategories={goalCategories}
          isExpanded={expandedGoals.has(goalGroup.goal.id)}
          onToggleExpand={() => onToggleExpand(goalGroup.goal.id)}
          onContribute={onContribute}
          onUpdateProgress={onUpdateProgress}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


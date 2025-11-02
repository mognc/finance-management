import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GoalWithSubgoals } from '@/lib/api';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  
  // Form state
  goalId: string;
  progressValue: string;
  progressNote: string;
  date: string;
  
  // Form setters
  setProgressValue: (value: string) => void;
  setProgressNote: (value: string) => void;
  setDate: (value: string) => void;
  
  // Data
  hierarchicalGoals: GoalWithSubgoals[];
}

export default function UpdateProgressModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  goalId,
  progressValue,
  progressNote,
  date,
  setProgressValue,
  setProgressNote,
  setDate,
  hierarchicalGoals,
}: UpdateProgressModalProps) {
  if (!isOpen || !goalId) return null;

  // Find the selected goal from hierarchical goals
  const selectedGoal = hierarchicalGoals
    .flatMap(group => [group.goal, ...group.subgoals])
    .find(g => g.id === goalId);

  const handleClose = () => {
    setProgressValue('');
    setProgressNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Goal Progress</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal
            </label>
            <div className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white flex items-center">
              {selectedGoal?.name || 'Goal'}
              {selectedGoal?.goal_type && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({selectedGoal.goal_type})
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progress Value
            </label>
            <Input
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              placeholder="Enter progress (amount, count, etc.)"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              placeholder="Add a note about this progress..."
              className="w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Updating...' : 'Update Progress'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


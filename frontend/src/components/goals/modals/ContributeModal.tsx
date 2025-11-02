import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GoalWithProgressDTO } from '../hooks/useGoals';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  
  // Form state
  goalId: string;
  amount: string;
  date: string;
  
  // Form setters
  setAmount: (value: string) => void;
  setDate: (value: string) => void;
  
  // Data
  goals: GoalWithProgressDTO[];
}

export default function ContributeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  goalId,
  amount,
  date,
  setAmount,
  setDate,
  goals,
}: ContributeModalProps) {
  if (!isOpen || !goalId) return null;

  const selectedGoal = goals.find(g => g.Goal.id === goalId);

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contribute to Goal</h3>
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
              {selectedGoal?.Goal.name || 'Goal'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              required
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Contribution'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


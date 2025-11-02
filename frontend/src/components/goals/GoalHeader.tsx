import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoalHeaderProps {
  onNewGoalClick: () => void;
}

export default function GoalHeader({ onNewGoalClick }: GoalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Target className="h-10 w-10 text-blue-600" />
          Goals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Track your progress and achieve your personal, financial, and life goals
        </p>
      </div>
      <Button 
        onClick={onNewGoalClick}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Goal
      </Button>
    </div>
  );
}


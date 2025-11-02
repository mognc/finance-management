interface MiniProgressBarProps {
  pct: number;
  amount: number;
  target: number;
  goalType?: string;
}

export function MiniProgressBar({ pct, amount, target, goalType = 'financial' }: MiniProgressBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} 
        />
      </div>
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        {goalType === 'financial' ? 
          `$${amount.toLocaleString()}/$${target.toLocaleString()}` : 
          `${amount.toLocaleString()}/${target.toLocaleString()}`}
      </span>
    </div>
  );
}


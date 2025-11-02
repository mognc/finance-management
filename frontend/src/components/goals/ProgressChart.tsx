import { CheckCircle, Award, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface ProgressChartProps {
  pct: number;
  className?: string;
  size?: "small" | "default" | "large";
}

export function ProgressChart({ pct, className = "", size = "default" }: ProgressChartProps) {
  const height = size === "small" ? "h-2" : size === "large" ? "h-4" : "h-3";
  
  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return { status: 'completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (progress >= 75) return { status: 'excellent', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Award };
    if (progress >= 50) return { status: 'good', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: TrendingUp };
    if (progress >= 25) return { status: 'started', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Clock };
    return { status: 'not-started', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle };
  };

  const progressStatus = getProgressStatus(pct);
  const ProgressIcon = progressStatus.icon;
  
  return (
    <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          pct >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
          pct >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
          pct >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
          pct >= 25 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
          'bg-gradient-to-r from-gray-400 to-gray-500'
        }`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} 
      />
      {pct > 0 && (
        <div className="absolute inset-0 flex items-center justify-end pr-2">
          <ProgressIcon className={`h-3 w-3 ${progressStatus.color}`} />
        </div>
      )}
    </div>
  );
}


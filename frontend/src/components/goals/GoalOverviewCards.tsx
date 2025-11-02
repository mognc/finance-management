import { useState, useMemo } from 'react';
import { TrendingUp, Target, Filter } from 'lucide-react';
import { ProgressChart } from './ProgressChart';
import type { GoalWithSubgoals } from '@/lib/api';

interface GoalOverviewCardsProps {
  hierarchicalGoals: GoalWithSubgoals[];
  progressRows: Array<{ 
    id: string; 
    name: string; 
    saved: number; 
    target: number; 
    pct: number; 
    category?: string;
  }>;
}

export default function GoalOverviewCards({ 
  hierarchicalGoals, 
  progressRows 
}: GoalOverviewCardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Create a map of goal IDs to categories from hierarchical goals
  const goalCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    hierarchicalGoals.forEach(group => {
      map.set(group.goal.id, group.goal.category);
      group.subgoals.forEach(sub => {
        map.set(sub.id, sub.category);
      });
    });
    return map;
  }, [hierarchicalGoals]);

  // Get all unique categories from goals
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    hierarchicalGoals.forEach(group => {
      categories.add(group.goal.category);
      group.subgoals.forEach(sub => categories.add(sub.category));
    });
    return Array.from(categories).sort();
  }, [hierarchicalGoals]);

  // Filter progress rows by selected category
  const filteredProgressRows = useMemo(() => {
    if (selectedCategory === 'all') {
      return progressRows;
    }
    return progressRows.filter(row => {
      const category = goalCategoryMap.get(row.id);
      return category === selectedCategory;
    });
  }, [selectedCategory, progressRows, goalCategoryMap]);

  // Calculate totals for filtered data
  const totalSaved = useMemo(() => 
    filteredProgressRows.reduce((sum, row) => sum + row.saved, 0),
    [filteredProgressRows]
  );
  const totalTarget = useMemo(() => 
    filteredProgressRows.reduce((sum, row) => sum + row.target, 0),
    [filteredProgressRows]
  );
  const overallProgress = useMemo(() => 
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
    [totalSaved, totalTarget]
  );

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        >
          <option value="all">All Categories</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {selectedCategory === 'all' ? 'Total Progress' : `${selectedCategory} Progress`}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSaved.toLocaleString()}</p>
              {selectedCategory !== 'all' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {filteredProgressRows.length} goal{filteredProgressRows.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {selectedCategory === 'all' ? 'Total Targets' : `${selectedCategory} Targets`}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTarget.toLocaleString()}</p>
              {selectedCategory !== 'all' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Combined target value
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {selectedCategory === 'all' ? 'Overall Progress' : `${selectedCategory} Progress`}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(overallProgress)}%</p>
              {selectedCategory !== 'all' && filteredProgressRows.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {filteredProgressRows.filter(r => r.pct >= 100).length} completed
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <ProgressChart pct={overallProgress} className="mt-4" />
        </div>
      </div>
    </div>
  );
}


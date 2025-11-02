import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Filter } from 'lucide-react';
import type { GoalWithSubgoals } from '@/lib/api';

interface GoalAnalyticsProps {
  hierarchicalGoals: GoalWithSubgoals[];
  progressRows: Array<{ 
    id: string; 
    name: string; 
    saved: number; 
    target: number; 
    pct: number; 
    targetDate?: string | undefined;
    category?: string;
  }>;
}

export default function GoalAnalytics({ 
  hierarchicalGoals,
  progressRows 
}: GoalAnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all unique categories from goals
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    hierarchicalGoals.forEach(group => {
      categories.add(group.goal.category);
      group.subgoals.forEach(sub => categories.add(sub.category));
    });
    return Array.from(categories).sort();
  }, [hierarchicalGoals]);

  // Create maps for goal metadata
  const goalMetadataMap = useMemo(() => {
    const categoryMap = new Map<string, string>();
    const typeMap = new Map<string, string>();
    
    hierarchicalGoals.forEach(group => {
      categoryMap.set(group.goal.id, group.goal.category);
      typeMap.set(group.goal.id, group.goal.goal_type || 'financial');
      group.subgoals.forEach(sub => {
        categoryMap.set(sub.id, sub.category);
        typeMap.set(sub.id, sub.goal_type || 'financial');
      });
    });
    
    return { categoryMap, typeMap };
  }, [hierarchicalGoals]);

  // Filter goals and progress rows by selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        hierarchicalGoals,
        progressRows,
      };
    }

    // Filter hierarchical goals
    const filteredHierarchical = hierarchicalGoals
      .map(group => {
        const goalMatches = group.goal.category === selectedCategory;
        const filteredSubgoals = group.subgoals.filter(sub => sub.category === selectedCategory);
        
        if (goalMatches || filteredSubgoals.length > 0) {
          return {
            goal: group.goal,
            subgoals: goalMatches ? group.subgoals : filteredSubgoals,
          };
        }
        return null;
      })
      .filter(Boolean) as GoalWithSubgoals[];

    // Filter progress rows by category
    const filteredProgressRows = progressRows.filter(row => {
      const category = goalMetadataMap.categoryMap.get(row.id);
      return category === selectedCategory;
    });

    return {
      hierarchicalGoals: filteredHierarchical,
      progressRows: filteredProgressRows,
    };
  }, [selectedCategory, hierarchicalGoals, progressRows, goalMetadataMap]);

  const palette = (i: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    return colors[i % colors.length];
  };

  const pieData = useMemo(() => 
    filteredData.progressRows.map(r => {
      const goalType = goalMetadataMap.typeMap.get(r.id) || 'financial';
      return { 
        name: r.name, 
        value: Math.max(0, r.saved),
        goalType 
      };
    }), 
    [filteredData.progressRows, goalMetadataMap]
  );

  const barData = useMemo(() => 
    filteredData.progressRows.map(r => {
      const goalType = goalMetadataMap.typeMap.get(r.id) || 'financial';
      return { 
        name: r.name, 
        saved: r.saved, 
        target: r.target,
        goalType 
      };
    }), 
    [filteredData.progressRows, goalMetadataMap]
  );

  // Check if we have any financial goals to determine chart labels
  const hasFinancialGoals = useMemo(() => 
    filteredData.progressRows.some(r => goalMetadataMap.typeMap.get(r.id) === 'financial'),
    [filteredData.progressRows, goalMetadataMap]
  );

  if (progressRows.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      {filteredData.progressRows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No goals found for the selected category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              {hasFinancialGoals ? 'Progress Distribution' : 'Goal Distribution'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={100}
                    label={({ name }) => name}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={palette(index)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, props: any) => {
                      const isFinancial = props?.payload?.goalType === 'financial' || 
                                         pieData.find((d: any) => d.name === props?.payload?.name)?.goalType === 'financial';
                      const formattedValue = isFinancial 
                        ? `$${Number(value).toLocaleString()}` 
                        : Number(value).toLocaleString();
                      return [formattedValue, 'Progress'];
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress vs Target
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => {
                      const goalType = props?.payload?.goalType || 
                                      barData.find((d: any) => d.name === props?.payload?.name)?.goalType || 
                                      'financial';
                      const isFinancial = goalType === 'financial';
                      const formattedValue = isFinancial 
                        ? `$${Number(value).toLocaleString()}` 
                        : Number(value).toLocaleString();
                      return [formattedValue, name === 'saved' ? 'Progress' : 'Target'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="saved" fill="#10b981" name={hasFinancialGoals ? 'Saved' : 'Progress'} />
                  <Bar dataKey="target" fill="#3b82f6" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useMemo, useState } from 'react';
import { financeApi } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Plus, 
  Edit3, 
  Save,
  X,
  PiggyBank,
  BarChart3,
  PieChart as PieChartIcon,
  Trash2
} from 'lucide-react';

interface GoalWithProgressDTO {
  Goal: {
    id: string;
    name: string;
    target_amount: number;
    target_date?: string | null;
  };
  ContributedSum: number;
  ExpenseSum: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalWithProgressDTO[]>([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [contribGoalId, setContribGoalId] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [contribDate, setContribDate] = useState(() => new Date().toISOString().slice(0, 10));

  // UI State
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Editing table for goals
  const saveGoal = async (g: any) => {
    await financeApi.updateGoal(g.Goal.id, { name: g.Goal.name, target_amount: g.Goal.target_amount, target_date: g.Goal.target_date ? `${g.Goal.target_date.slice(0,10)}T00:00:00Z` : undefined });
    await loadGoals();
    setEditingGoal(null);
  };

  const loadGoals = async () => {
    const res = await financeApi.listGoals();
    if (res.success && Array.isArray(res.data)) setGoals(res.data as any);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const progressRows = useMemo(() => goals.map(g => {
    const saved = g.ContributedSum;
    const target = g.Goal.target_amount || 0;
    const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
    return { id: g.Goal.id, name: g.Goal.name, saved, target, pct, targetDate: g.Goal.target_date };
  }), [goals]);

  const palette = (i: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    return colors[i % colors.length];
  };

  const pieData = useMemo(() => progressRows.map(r => ({ name: r.name, value: Math.max(0, r.saved) })), [progressRows]);
  const barData = useMemo(() => progressRows.map(r => ({ name: r.name, saved: r.saved, target: r.target })), [progressRows]);

  const ProgressChart = ({ pct, className = "" }: { pct: number; className?: string }) => (
    <div className={`w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} 
      />
    </div>
  );

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingGoal(true);
    const amt = parseFloat(targetAmount);
    if (!name.trim() || !amt || amt < 0) {
      showError('Invalid input', 'Please provide a valid goal name and amount');
      setIsCreatingGoal(false);
      return;
    }
    const payload: any = { name: name.trim(), target_amount: amt };
    if (targetDate) payload.target_date = `${targetDate}T00:00:00Z`;
    const res = await financeApi.createGoal(payload);
    if (res.success) {
      setName(''); setTargetAmount(''); setTargetDate('');
      setShowCreateForm(false);
      showSuccess('Goal created successfully');
      await loadGoals();
    } else {
      showError('Failed to create goal', 'Please try again');
    }
    setIsCreatingGoal(false);
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContributing(true);
    const amt = parseFloat(contribAmount);
    if (!contribGoalId || !amt || amt <= 0) {
      showError('Invalid input', 'Please select a goal and enter a valid amount');
      setIsContributing(false);
      return;
    }
    const payload = { goal_id: contribGoalId, amount: amt, contributed_at: `${contribDate}T00:00:00Z` };
    const res = await financeApi.contributeToGoal(payload);
    if (res.success) {
      setContribAmount('');
      setShowContributeForm(false);
      showSuccess('Contribution added successfully');
      await loadGoals();
    } else {
      showError('Failed to contribute', 'Please try again');
    }
    setIsContributing(false);
  };

  const handleDeleteGoal = async (goalId: string) => {
    setDeletingGoal(goalId);
    const res = await financeApi.deleteGoal(goalId);
    if (res.success) {
      setShowDeleteConfirm(null);
      showSuccess('Goal deleted successfully');
      await loadGoals();
    } else {
      showError('Failed to delete goal', 'Please try again');
    }
    setDeletingGoal(null);
  };

  const totalSaved = progressRows.reduce((sum, row) => sum + row.saved, 0);
  const totalTarget = progressRows.reduce((sum, row) => sum + row.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Target className="h-10 w-10 text-blue-600" />
                Financial Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Track your savings progress and achieve your financial targets
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
              <Button 
                onClick={() => setShowContributeForm(true)}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <PiggyBank className="h-4 w-4 mr-2" />
                Contribute
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSaved.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Target</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalTarget.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(overallProgress)}%</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <ProgressChart pct={overallProgress} className="mt-4" />
            </div>
          </div>

          {/* Charts Section */}
          {progressRows.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Analytics</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Savings Distribution
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
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Saved']} />
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
                          formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'saved' ? 'Saved' : 'Target']}
                        />
                        <Legend />
                        <Bar dataKey="saved" fill="#10b981" name="Saved" />
                        <Bar dataKey="target" fill="#3b82f6" name="Target" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Goals</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your financial objectives</p>
            </div>
            
            {progressRows.length === 0 ? (
              <div className="p-12 text-center">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first financial goal to start tracking your progress</p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {goals.map((g: any) => {
                  const row = progressRows.find(r => r.id === g.Goal.id)!;
                  const isEditing = editingGoal === g.Goal.id;
                  
                  return (
                    <div key={g.Goal.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                value={g.Goal.name}
                                onChange={(e) => g.Goal.name = e.target.value}
                                placeholder="Goal name"
                                className="font-medium"
                              />
                              <Input
                                type="number"
                                step="0.01"
                                value={g.Goal.target_amount}
                                onChange={(e) => g.Goal.target_amount = parseFloat(e.target.value)}
                                placeholder="Target amount"
                              />
                              <Input
                                type="date"
                                value={(g.Goal.target_date || '').slice(0,10)}
                                onChange={(e) => g.Goal.target_date = e.target.value}
                              />
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{row.name}</h3>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Target: <span className="font-medium">${row.target.toLocaleString()}</span>
                                </span>
                                {row.targetDate && (
                                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(row.targetDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${row.saved.toLocaleString()} / ${row.target.toLocaleString()} ({row.pct}%)
                              </span>
                            </div>
                            <ProgressChart pct={row.pct} />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveGoal(g)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGoal(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGoal(g.Goal.id)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(g.Goal.id)}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Create Goal Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Goal</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Vacation Fund"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount
                  </label>
                  <Input
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date (Optional)
                  </label>
                  <Input
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    type="date"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingGoal}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isCreatingGoal ? 'Creating...' : 'Create Goal'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contribute Modal */}
        {showContributeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contribute to Goal</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContributeForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Goal
                  </label>
                  <select
                    value={contribGoalId}
                    onChange={(e) => setContribGoalId(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a goal</option>
                    {goals.map(g => (
                      <option key={g.Goal.id} value={g.Goal.id}>{g.Goal.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <Input
                    value={contribAmount}
                    onChange={(e) => setContribAmount(e.target.value)}
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
                    value={contribDate}
                    onChange={(e) => setContribDate(e.target.value)}
                    type="date"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContributeForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isContributing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isContributing ? 'Adding...' : 'Add Contribution'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Goal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this goal? All associated contributions and progress will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteGoal(showDeleteConfirm)}
                  disabled={deletingGoal === showDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deletingGoal === showDeleteConfirm ? 'Deleting...' : 'Delete Goal'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}



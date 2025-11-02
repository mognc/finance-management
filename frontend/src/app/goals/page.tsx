"use client";

import { useEffect, useMemo, useState } from 'react';
import { goalsApi } from '@/lib/api';
import type { GoalCategory, GoalWithSubgoals, GoalPayload } from '@/lib/api';
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
  Trash2,
  Folder,
  Plane,
  GraduationCap,
  Home,
  Heart,
  Smartphone,
  Shield,
  TrendingUp as TrendingUpIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Flag
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
  const [hierarchicalGoals, setHierarchicalGoals] = useState<GoalWithSubgoals[]>([]);
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [parentGoalId, setParentGoalId] = useState('');
  const [isMainGoal, setIsMainGoal] = useState(true);

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
  const [viewMode, setViewMode] = useState<'flat' | 'hierarchical'>('hierarchical');
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  // Editing table for goals
  const saveGoal = async (g: any) => {
    const updates: Partial<GoalPayload> = {
      name: g.Goal.name,
      target_amount: g.Goal.target_amount,
    };
    
    if (g.Goal.target_date) {
      updates.target_date = `${g.Goal.target_date.slice(0, 10)}T00:00:00Z`;
    }
    
    await goalsApi.updateGoal(g.Goal.id, updates);
    await loadGoals();
    setEditingGoal(null);
  };

  const loadGoals = async () => {
    const res = await goalsApi.listGoals();
    if (res.success && Array.isArray(res.data)) setGoals(res.data as any);
  };

  const loadHierarchicalGoals = async () => {
    const res = await goalsApi.listMainGoalsWithSubgoals();
    if (res.success && Array.isArray(res.data)) setHierarchicalGoals(res.data as any);
  };

  const loadGoalCategories = async () => {
    const res = await goalsApi.listGoalCategories();
    if (res.success && Array.isArray(res.data)) setGoalCategories(res.data as any);
  };

  useEffect(() => {
    loadGoals();
    loadHierarchicalGoals();
    loadGoalCategories();
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

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, any> = {
      'Travel': Plane,
      'Education': GraduationCap,
      'Lifestyle': Home,
      'Health': Heart,
      'Technology': Smartphone,
      'Emergency': Shield,
      'Investment': TrendingUpIcon,
      'General': Target
    };
    return iconMap[categoryName] || Target;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = goalCategories.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return { status: 'completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (progress >= 75) return { status: 'excellent', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Award };
    if (progress >= 50) return { status: 'good', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: TrendingUp };
    if (progress >= 25) return { status: 'started', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Clock };
    return { status: 'not-started', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle };
  };

  const getGoalPriority = (goal: any) => {
    const daysUntilTarget = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
    if (daysUntilTarget && daysUntilTarget < 30) return { priority: 'high', color: 'text-red-600', bgColor: 'bg-red-100', icon: Flag };
    if (daysUntilTarget && daysUntilTarget < 90) return { priority: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock };
    return { priority: 'low', color: 'text-green-600', bgColor: 'bg-green-100', icon: Star };
  };

  const calculateOverallProgress = (goalGroup: any) => {
    const totalTarget = goalGroup.goal.target_amount + goalGroup.subgoals.reduce((sum: number, sub: any) => sum + sub.target_amount, 0);
    const totalSaved = 0; // This would need to be calculated from actual data
    return totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  };

  const pieData = useMemo(() => progressRows.map(r => ({ name: r.name, value: Math.max(0, r.saved) })), [progressRows]);
  const barData = useMemo(() => progressRows.map(r => ({ name: r.name, saved: r.saved, target: r.target })), [progressRows]);

  const ProgressChart = ({ pct, className = "", size = "default" }: { pct: number; className?: string; size?: "small" | "default" | "large" }) => {
    const height = size === "small" ? "h-2" : size === "large" ? "h-4" : "h-3";
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
  };

  const MiniProgressBar = ({ pct, amount, target }: { pct: number; amount: number; target: number }) => (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} 
      />
      </div>
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        ${amount.toLocaleString()}/${target.toLocaleString()}
      </span>
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
    const payload: any = { 
      name: name.trim(), 
      description: description.trim(),
      category: category || 'General',
      target_amount: amt,
      is_main_goal: isMainGoal
    };
    if (targetDate) payload.target_date = `${targetDate}T00:00:00Z`;
    if (parentGoalId && !isMainGoal) payload.parent_goal_id = parentGoalId;
    const res = await goalsApi.createGoal(payload);
    if (res.success) {
      setName(''); setDescription(''); setCategory(''); setTargetAmount(''); setTargetDate('');
      setParentGoalId(''); setIsMainGoal(true);
      setShowCreateForm(false);
      showSuccess('Goal created successfully');
      await loadGoals();
      await loadHierarchicalGoals();
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
    const res = await goalsApi.contributeToGoal(payload);
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
    const res = await goalsApi.deleteGoal(goalId);
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
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'hierarchical' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('hierarchical')}
                  className={viewMode === 'hierarchical' ? 'bg-white shadow-sm' : ''}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Hierarchical
                </Button>
                <Button
                  variant={viewMode === 'flat' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('flat')}
                  className={viewMode === 'flat' ? 'bg-white shadow-sm' : ''}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Flat
                </Button>
              </div>
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
            
            {viewMode === 'hierarchical' ? (
              hierarchicalGoals.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                    <Target className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your first financial goal to start tracking your progress and building your future</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {hierarchicalGoals.map((goalGroup) => {
                    const isExpanded = expandedGoals.has(goalGroup.goal.id);
                    const CategoryIcon = getCategoryIcon(goalGroup.goal.category);
                    const categoryColor = getCategoryColor(goalGroup.goal.category);
                    const overallProgress = calculateOverallProgress(goalGroup);
                    const progressStatus = getProgressStatus(overallProgress);
                    const priority = getGoalPriority(goalGroup.goal);
                    const PriorityIcon = priority.icon;
                    
                    return (
                      <div key={goalGroup.goal.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
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
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{goalGroup.goal.name}</h3>
                                    <span 
                                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                      style={{ backgroundColor: categoryColor }}
                                    >
                                      {goalGroup.goal.category}
                                    </span>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                                      <PriorityIcon className="h-3 w-3 inline mr-1" />
                                      {priority.priority}
                                    </div>
                                  </div>
                                  {goalGroup.goal.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">{goalGroup.goal.description}</p>
                                  )}
                                  <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Target: <span className="font-semibold text-gray-900 dark:text-white">${goalGroup.goal.target_amount.toLocaleString()}</span>
                                      </span>
                                    </div>
                                    {goalGroup.goal.target_date && (
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {new Date(goalGroup.goal.target_date).toLocaleDateString()}
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGoal(goalGroup.goal.id)}
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(goalGroup.goal.id)}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                              onClick={() => toggleGoalExpansion(goalGroup.goal.id)}
                              className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
                            >
                              <div className="flex items-center gap-3">
                                {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {goalGroup.subgoals.length} Sub-goal{goalGroup.subgoals.length !== 1 ? 's' : ''}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">Total: ${goalGroup.subgoals.reduce((sum: number, sub: any) => sum + sub.target_amount, 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </Button>
                            
                            {isExpanded && (
                              <div className="mt-4 space-y-3">
                                {goalGroup.subgoals.map((subgoal: any) => {
                                  const SubCategoryIcon = getCategoryIcon(subgoal.category);
                                  const subCategoryColor = getCategoryColor(subgoal.category);
                                  const subProgress = 0; // This would be calculated from actual data
                                  
                                  return (
                                    <div key={subgoal.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                          <div 
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${subCategoryColor}15`, color: subCategoryColor }}
                                          >
                                            <SubCategoryIcon className="h-4 w-4" />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white truncate">{subgoal.name}</h4>
                                            <span 
                                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                              style={{ backgroundColor: subCategoryColor }}
                                            >
                                              {subgoal.category}
                                            </span>
                                          </div>
                                          <MiniProgressBar pct={subProgress} amount={0} target={subgoal.target_amount} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingGoal(subgoal.id)}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Edit3 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              progressRows.length === 0 ? (
              <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                    <Target className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your first financial goal to start tracking your progress and building your future</p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((g: any) => {
                  const row = progressRows.find(r => r.id === g.Goal.id)!;
                  const isEditing = editingGoal === g.Goal.id;
                    const CategoryIcon = getCategoryIcon(g.Goal.category || 'General');
                    const categoryColor = getCategoryColor(g.Goal.category || 'General');
                    const progressStatus = getProgressStatus(row.pct);
                    const priority = getGoalPriority(g.Goal);
                    const PriorityIcon = priority.icon;
                  
                  return (
                      <div key={g.Goal.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                          {isEditing ? (
                          <div className="p-6">
                            <div className="space-y-4">
                              <Input
                                value={g.Goal.name}
                                onChange={(e) => g.Goal.name = e.target.value}
                                placeholder="Goal name"
                                className="font-medium"
                              />
                              <div className="grid grid-cols-2 gap-4">
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
                              <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveGoal(g)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGoal(null)}
                              >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                              </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="p-3 rounded-xl shadow-sm"
                                  style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
                                >
                                  <CategoryIcon className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{row.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span 
                                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                      style={{ backgroundColor: categoryColor }}
                                    >
                                      {g.Goal.category || 'General'}
                                    </span>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                                      <PriorityIcon className="h-3 w-3 inline mr-1" />
                                      {priority.priority}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGoal(g.Goal.id)}
                                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Target: <span className="font-semibold text-gray-900 dark:text-white">${row.target.toLocaleString()}</span>
                                  </span>
                                </div>
                                {row.targetDate && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(row.targetDate).toLocaleDateString()}
                                  </div>
                          )}
                        </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{row.pct}%</span>
                                    <div className={`p-1 rounded-full ${progressStatus.bgColor}`}>
                                      <progressStatus.icon className={`h-4 w-4 ${progressStatus.color}`} />
                                    </div>
                                  </div>
                                </div>
                                <ProgressChart pct={row.pct} size="large" />
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                  <span>Saved: ${row.saved.toLocaleString()}</span>
                                  <span>Remaining: ${(row.target - row.saved).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
              )
            )}
          </div>
        </div>

        {/* Create Goal Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Goal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set up your financial objective with categories and milestones</p>
                  </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <X className="h-5 w-5" />
                </Button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreateGoal} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Goal Name *
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Go to Germany"
                        className="h-12 text-lg"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your goal and what you want to achieve..."
                        className="w-full h-20 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {goalCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Target Amount *
                      </label>
                      <Input
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        className="h-12 text-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Target Date
                      </label>
                      <Input
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        type="date"
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Goal Type
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            checked={isMainGoal}
                            onChange={() => setIsMainGoal(true)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Main Goal</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Primary financial objective</div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            checked={!isMainGoal}
                            onChange={() => setIsMainGoal(false)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Sub-goal</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Part of a larger goal</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {!isMainGoal && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Parent Goal *
                      </label>
                      <select
                        value={parentGoalId}
                        onChange={(e) => setParentGoalId(e.target.value)}
                        className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isMainGoal}
                      >
                        <option value="">Select a parent goal</option>
                        {hierarchicalGoals.map(goalGroup => (
                          <option key={goalGroup.goal.id} value={goalGroup.goal.id}>{goalGroup.goal.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 h-12"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreatingGoal}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    >
                      {isCreatingGoal ? 'Creating...' : 'Create Goal'}
                    </Button>
                  </div>
                </form>
              </div>
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



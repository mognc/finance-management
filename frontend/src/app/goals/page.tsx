"use client";

import { useEffect, useMemo, useState } from 'react';
import { goalsApi } from '@/lib/api';
import type { GoalCategory, GoalWithSubgoals } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';

import MainLayout from '@/components/layout/MainLayout';
import type { GoalWithProgressDTO } from '@/components/goals/hooks/useGoals';
import { 
  GoalHeader,
  GoalOverviewCards,
  GoalsList,
  GoalAnalytics,
  CreateGoalModal,
  ContributeModal,
  UpdateProgressModal,
  DeleteConfirmModal,
  useGoals,
} from '@/components/goals';
import { defaultCategories } from '@/components/goals/utils/goalUtils';
// Alternative import: import { DEFAULT_CATEGORIES as defaultCategories } from '@/components/goals/constants/goalConstants';

// Convert defaultCategories to GoalCategory format for mock data
const mockGoalCategories: GoalCategory[] = defaultCategories.map((cat, index) => ({
  id: String(index + 1),
  name: cat.name,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
  created_at: '2024-01-01'
}));

const mockHierarchicalGoals: GoalWithSubgoals[] = [
  {
    goal: {
      id: '1',
      name: 'Save for a vacation',
      description: 'Plan and save for a dream vacation to Europe',
      category: 'Financial Goals',
      target_amount: 5000,
      target_date: '2024-12-31',
      is_main_goal: true,
      goal_type: 'financial',
      progress_type: 'amount',
      current_progress: 1500,
      is_completed: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    subgoals: [
      {
        id: '2',
        name: 'Research destinations',
        description: 'Research and plan travel destinations',
        category: 'Travel',
        target_value: 1,
        parent_goal_id: '1',
        is_main_goal: false,
        goal_type: 'boolean',
        progress_type: 'completion',
        current_progress: 1,
        is_completed: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '3',
        name: 'Book flights',
        description: 'Find and book affordable flights',
        category: 'Travel',
        target_value: 1,
        parent_goal_id: '1',
        is_main_goal: false,
        goal_type: 'boolean',
        progress_type: 'completion',
        current_progress: 0,
        is_completed: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]
  },
  {
    goal: {
      id: '4',
      name: 'Read 20 books',
      description: 'Read 20 books this year to expand knowledge',
      category: 'Personal Growth',
      target_value: 20,
      target_date: '2024-12-31',
      is_main_goal: true,
      goal_type: 'numeric',
      progress_type: 'count',
      current_progress: 12,
      is_completed: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    subgoals: [
      {
        id: '5',
        name: 'Read 5 books',
        description: 'First milestone - read 5 books',
        category: 'Personal Growth',
        target_value: 5,
        parent_goal_id: '4',
        is_main_goal: false,
        goal_type: 'numeric',
        progress_type: 'count',
        current_progress: 5,
        is_completed: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]
  },
  {
    goal: {
      id: '6',
      name: 'Learn Spanish',
      description: 'Become conversational in Spanish',
      category: 'Personal Growth',
      target_value: 1,
      target_date: '2024-06-30',
      is_main_goal: true,
      goal_type: 'boolean',
      progress_type: 'completion',
      current_progress: 0,
      is_completed: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    subgoals: [
      {
        id: '7',
        name: 'Complete Duolingo course',
        description: 'Finish the Spanish course on Duolingo',
        category: 'Personal Growth',
        target_value: 100,
        parent_goal_id: '6',
        is_main_goal: false,
        goal_type: 'numeric',
        progress_type: 'percentage',
        current_progress: 65,
        is_completed: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '8',
        name: 'Practice conversation',
        description: 'Have 10 conversation sessions with native speakers',
        category: 'Personal Growth',
        target_value: 10,
        parent_goal_id: '6',
        is_main_goal: false,
        goal_type: 'numeric',
        progress_type: 'count',
        current_progress: 3,
        is_completed: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]
  }
];

const mockGoals: GoalWithProgressDTO[] = [
  {
  Goal: {
      id: '1',
      name: 'Save for a vacation',
      target_amount: 5000,
      target_date: '2024-12-31'
    },
    ContributedSum: 1500,
    ExpenseSum: 0
  },
  {
    Goal: {
      id: '4',
      name: 'Read 20 books',
      target_amount: 20,
      target_date: '2024-12-31'
    },
    ContributedSum: 12,
    ExpenseSum: 0
  },
  {
    Goal: {
      id: '6',
      name: 'Learn Spanish',
      target_amount: 1,
      target_date: '2024-06-30'
    },
    ContributedSum: 0,
    ExpenseSum: 0
  }
];

export default function GoalsPage() {
  // Use custom hook for goals management
  const {
    goals,
    hierarchicalGoals,
    goalCategories,
    createGoal,
    deleteGoal,
    completeGoal,
    setGoals,
    setHierarchicalGoals,
    setGoalCategories,
  } = useGoals();

  // Initialize with mock data
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setGoals(mockGoals);
      setHierarchicalGoals(mockHierarchicalGoals);
      setGoalCategories(mockGoalCategories);
      setInitialized(true);
    }
  }, [initialized, setGoals, setHierarchicalGoals, setGoalCategories]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [parentGoalId, setParentGoalId] = useState('');
  const [isMainGoal, setIsMainGoal] = useState(true);
  const [goalType, setGoalType] = useState<'financial' | 'numeric' | 'boolean' | 'habit'>('financial');
  const [progressType, setProgressType] = useState<'amount' | 'percentage' | 'count' | 'completion'>('amount');

  const [contribGoalId, setContribGoalId] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [contribDate, setContribDate] = useState('');

  const [progressGoalId, setProgressGoalId] = useState('');
  const [progressValue, setProgressValue] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [progressDate, setProgressDate] = useState('');

  // UI State
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setContribDate(today);
    setProgressDate(today);
  }, []);

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

  const progressRows = useMemo(() => goals
    .filter(g => g?.Goal)
    .map(g => {
      const saved = g.ContributedSum || 0;
      const target = g.Goal?.target_amount || 0;
      const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
      const category = goalCategoryMap.get(g.Goal.id) || 'General';
      return { 
        id: g.Goal.id, 
        name: g.Goal.name || 'Unnamed Goal', 
        saved, 
        target, 
        pct, 
        category,
        ...(g.Goal.target_date ? { targetDate: g.Goal.target_date } : {})
      };
    }), [goals, goalCategoryMap]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingGoal(true);
    
    if (!name.trim()) {
      showError('Invalid input', 'Please provide a valid goal name');
      setIsCreatingGoal(false);
      return;
    }
    
    // Validate custom category if selected
    if (category === 'Custom') {
      if (!customCategoryName.trim()) {
        showError('Invalid input', 'Please enter a custom category name');
        setIsCreatingGoal(false);
        return;
      }
    }
    
    // Use custom category name if "Custom" is selected, otherwise use selected category
    const finalCategory = category === 'Custom' && customCategoryName.trim() 
      ? customCategoryName.trim() 
      : category || 'General';
    
    const payload: any = { 
      name: name.trim(), 
      description: description.trim(),
      category: finalCategory,
      is_main_goal: isMainGoal,
      goal_type: goalType,
      progress_type: progressType
    };
    
    if (goalType === 'financial') {
      const amt = parseFloat(targetAmount);
      if (!amt || amt < 0) {
        showError('Invalid input', 'Please provide a valid target amount');
        setIsCreatingGoal(false);
        return;
      }
      payload.target_amount = amt;
    } else if (goalType === 'numeric') {
      const val = parseFloat(targetValue);
      if (!val || val < 0) {
        showError('Invalid input', 'Please provide a valid target value');
        setIsCreatingGoal(false);
        return;
      }
      payload.target_value = val;
    }
    
    if (targetDate) payload.target_date = `${targetDate}T00:00:00Z`;
    if (parentGoalId && !isMainGoal) payload.parent_goal_id = parentGoalId;
    
    const success = await createGoal(payload);
    if (success) {
      setName(''); setDescription(''); setCategory(''); setCustomCategoryName(''); 
      setTargetAmount(''); setTargetValue(''); setTargetDate('');
      setParentGoalId(''); setIsMainGoal(true); setGoalType('financial'); setProgressType('amount');
      setShowCreateForm(false);
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
      setContribGoalId('');
    } else {
      showError('Failed to contribute', 'Please try again');
    }
    setIsContributing(false);
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProgress(true);
    const val = parseFloat(progressValue);
    if (!progressGoalId || isNaN(val) || val < 0) {
      showError('Invalid input', 'Please select a goal and enter a valid progress value');
      setIsUpdatingProgress(false);
      return;
    }
    const payload = { 
      goal_id: progressGoalId, 
      progress_value: val, 
      progress_note: progressNote.trim(),
      recorded_at: `${progressDate}T00:00:00Z` 
    };
    const res = await goalsApi.updateGoalProgress(payload);
    if (res.success) {
      setProgressValue(''); setProgressNote('');
      setShowProgressForm(false);
      showSuccess('Progress updated successfully');
      setProgressGoalId('');
    } else {
      showError('Failed to update progress', 'Please try again');
    }
    setIsUpdatingProgress(false);
  };

  const handleDeleteGoal = async (goalId: string) => {
    setDeletingGoal(goalId);
    const success = await deleteGoal(goalId);
    if (success) {
      setShowDeleteConfirm(null);
    }
    setDeletingGoal(null);
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


  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <GoalHeader
            onNewGoalClick={() => setShowCreateForm(true)}
          />

          <GoalOverviewCards
            hierarchicalGoals={hierarchicalGoals}
            progressRows={progressRows}
          />

          {/* Analytics Section */}
          <GoalAnalytics
            hierarchicalGoals={hierarchicalGoals}
            progressRows={progressRows}
          />

          {/* Goals List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Goals</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your personal, financial, and life objectives</p>
            </div>
            
                          <div className="p-6">
              <GoalsList
                hierarchicalGoals={hierarchicalGoals}
                goalCategories={goalCategories}
                expandedGoals={expandedGoals}
                onToggleExpand={toggleGoalExpansion}
                onCreateGoal={() => setShowCreateForm(true)}
                onContribute={(goalId: string) => {
                  setContribGoalId(goalId);
                  setShowContributeForm(true);
                }}
                onUpdateProgress={(goalId: string) => {
                  setProgressGoalId(goalId);
                  setShowProgressForm(true);
                }}
                onComplete={(goalId: string) => completeGoal(goalId)}
                onEdit={(goalId: string) => {
                  // TODO: Implement edit functionality
                  console.log('Edit goal:', goalId);
                }}
                onDelete={(goalId: string) => setShowDeleteConfirm(goalId)}
                              />
                            </div>
                              </div>
                            </div>
                            
        {/* Modals */}
        <CreateGoalModal
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setCustomCategoryName('');
            setCategory('');
          }}
          onSubmit={handleCreateGoal}
          isLoading={isCreatingGoal}
          name={name}
          description={description}
          category={category}
          customCategoryName={customCategoryName}
          targetAmount={targetAmount}
          targetValue={targetValue}
          targetDate={targetDate}
          parentGoalId={parentGoalId}
          isMainGoal={isMainGoal}
          goalType={goalType}
          setName={setName}
          setDescription={setDescription}
          setCategory={setCategory}
          setCustomCategoryName={setCustomCategoryName}
          setTargetAmount={setTargetAmount}
          setTargetValue={setTargetValue}
          setTargetDate={setTargetDate}
          setParentGoalId={setParentGoalId}
          setIsMainGoal={setIsMainGoal}
          setGoalType={setGoalType}
          setProgressType={setProgressType}
          goalCategories={goalCategories}
          hierarchicalGoals={hierarchicalGoals}
        />

        <ContributeModal
          isOpen={showContributeForm}
          onClose={() => {
            setShowContributeForm(false);
            setContribGoalId('');
            setContribAmount('');
          }}
          onSubmit={handleContribute}
          isLoading={isContributing}
          goalId={contribGoalId}
          amount={contribAmount}
          date={contribDate}
          setAmount={setContribAmount}
          setDate={setContribDate}
          goals={goals}
        />

        <UpdateProgressModal
          isOpen={showProgressForm}
          onClose={() => {
            setShowProgressForm(false);
            setProgressGoalId('');
            setProgressValue('');
            setProgressNote('');
          }}
          onSubmit={handleUpdateProgress}
          isLoading={isUpdatingProgress}
          goalId={progressGoalId}
          progressValue={progressValue}
          progressNote={progressNote}
          date={progressDate}
          setProgressValue={setProgressValue}
          setProgressNote={setProgressNote}
          setDate={setProgressDate}
          hierarchicalGoals={hierarchicalGoals}
        />

        <DeleteConfirmModal
          isOpen={showDeleteConfirm !== null}
          goalId={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => showDeleteConfirm && handleDeleteGoal(showDeleteConfirm)}
          isLoading={deletingGoal === showDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
}

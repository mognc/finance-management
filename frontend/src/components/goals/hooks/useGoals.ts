import { useState, useMemo } from 'react';
import { goalsApi } from '@/lib/api';
import type { GoalCategory, GoalWithSubgoals, GoalPayload } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';

export interface GoalWithProgressDTO {
  Goal: {
    id: string;
    name: string;
    target_amount: number;
    target_date?: string | null;
  };
  ContributedSum: number;
  ExpenseSum: number;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<GoalWithProgressDTO[]>([]);
  const [hierarchicalGoals, setHierarchicalGoals] = useState<GoalWithSubgoals[]>([]);
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);

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

  const createGoal = async (payload: GoalPayload) => {
    const res = await goalsApi.createGoal(payload);
    if (res.success) {
      showSuccess('Goal created successfully');
      await loadGoals();
      await loadHierarchicalGoals();
      return true;
    } else {
      showError('Failed to create goal', 'Please try again');
      return false;
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalPayload>) => {
    const res = await goalsApi.updateGoal(id, updates);
    if (res.success) {
      showSuccess('Goal updated successfully');
      await loadGoals();
      await loadHierarchicalGoals();
      return true;
    } else {
      showError('Failed to update goal', 'Please try again');
      return false;
    }
  };

  const deleteGoal = async (id: string) => {
    const res = await goalsApi.deleteGoal(id);
    if (res.success) {
      showSuccess('Goal deleted successfully');
      await loadGoals();
      await loadHierarchicalGoals();
      return true;
    } else {
      showError('Failed to delete goal', 'Please try again');
      return false;
    }
  };

  const completeGoal = async (id: string) => {
    const res = await goalsApi.completeGoal(id);
    if (res.success) {
      showSuccess('Goal completed! 🎉');
      await loadGoals();
      await loadHierarchicalGoals();
      return true;
    } else {
      showError('Failed to complete goal', 'Please try again');
      return false;
    }
  };

  const progressRows = useMemo(() => goals
    .filter(g => g?.Goal)
    .map(g => {
      const saved = g.ContributedSum || 0;
      const target = g.Goal?.target_amount || 0;
      const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
      return { 
        id: g.Goal.id, 
        name: g.Goal.name || 'Unnamed Goal', 
        saved, 
        target, 
        pct, 
        targetDate: g.Goal.target_date 
      };
    }), [goals]);

  return {
    goals,
    hierarchicalGoals,
    goalCategories,
    progressRows,
    loadGoals,
    loadHierarchicalGoals,
    loadGoalCategories,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    setGoals,
    setHierarchicalGoals,
    setGoalCategories,
  };
};


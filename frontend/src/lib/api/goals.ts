import { apiClient, apiRequest } from './client';

export interface GoalPayload {
  name: string;
  description?: string;
  category?: string;
  target_amount: number;
  target_date?: string;
  parent_goal_id?: string;
  is_main_goal?: boolean;
}

export interface GoalContributionPayload {
  goal_id: string;
  amount: number;
  contributed_at: string;
}

export interface GoalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface GoalWithSubgoals {
  goal: {
    id: string;
    name: string;
    description: string;
    category: string;
    target_amount: number;
    target_date?: string;
    parent_goal_id?: string;
    is_main_goal: boolean;
    created_at: string;
    updated_at: string;
  };
  subgoals: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    target_amount: number;
    target_date?: string;
    parent_goal_id?: string;
    is_main_goal: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

export interface GoalExpensePayload {
  goal_id: string;
  expense_id: string;
  amount: number;
  description?: string;
}

export const goalsApi = {
  createGoal: (payload: GoalPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals', payload)),
  updateGoal: (id: string, updates: Partial<GoalPayload>) =>
    apiRequest(() => apiClient.put(`/api/finance/goals/${id}`, updates)),
  deleteGoal: (id: string) => apiRequest(() => apiClient.delete(`/api/finance/goals/${id}`)),
  listGoals: () => apiRequest(() => apiClient.get('/api/finance/goals')),
  
  contributeToGoal: (payload: GoalContributionPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/contributions', payload)),
  
  listGoalCategories: () => apiRequest<GoalCategory[]>(() => apiClient.get('/api/finance/goals/categories')),
  listMainGoalsWithSubgoals: () => apiRequest<GoalWithSubgoals[]>(() => apiClient.get('/api/finance/goals/hierarchical')),
  
  createGoalExpense: (payload: GoalExpensePayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/expenses', payload)),
  listGoalExpenses: (goalId: string) =>
    apiRequest(() => apiClient.get(`/api/finance/goals/${goalId}/expenses`)),
};


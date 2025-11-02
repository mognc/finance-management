import { apiClient, apiRequest } from './client';

export interface GoalPayload {
  name: string;
  description?: string;
  category?: string;
  target_amount?: number; // For financial goals
  target_value?: number; // For numeric goals (books to read, etc.)
  target_date?: string;
  parent_goal_id?: string;
  is_main_goal?: boolean;
  goal_type?: 'financial' | 'numeric' | 'boolean' | 'habit'; // Type of goal
  progress_type?: 'amount' | 'percentage' | 'count' | 'completion'; // How progress is tracked
}

export interface GoalContributionPayload {
  goal_id: string;
  amount: number;
  contributed_at: string;
}

export interface GoalProgressPayload {
  goal_id: string;
  progress_value: number; // Could be amount, count, percentage, etc.
  progress_note?: string;
  recorded_at: string;
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
    target_amount?: number;
    target_value?: number;
    target_date?: string;
    parent_goal_id?: string;
    is_main_goal: boolean;
    goal_type?: string;
    progress_type?: string;
    current_progress?: number;
    is_completed?: boolean;
    created_at: string;
    updated_at: string;
  };
  subgoals: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    target_amount?: number;
    target_value?: number;
    target_date?: string;
    parent_goal_id?: string;
    is_main_goal: boolean;
    goal_type?: string;
    progress_type?: string;
    current_progress?: number;
    is_completed?: boolean;
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
  
  updateGoalProgress: (payload: GoalProgressPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/progress', payload)),
  
  completeGoal: (goalId: string) =>
    apiRequest(() => apiClient.post(`/api/finance/goals/${goalId}/complete`)),
  
  listGoalCategories: () => apiRequest<GoalCategory[]>(() => apiClient.get('/api/finance/goals/categories')),
  listMainGoalsWithSubgoals: () => apiRequest<GoalWithSubgoals[]>(() => apiClient.get('/api/finance/goals/hierarchical')),
  
  createGoalExpense: (payload: GoalExpensePayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/expenses', payload)),
  listGoalExpenses: (goalId: string) =>
    apiRequest(() => apiClient.get(`/api/finance/goals/${goalId}/expenses`)),
};


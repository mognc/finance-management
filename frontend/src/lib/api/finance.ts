import { apiClient, apiRequest } from './client';

export interface IncomePayload {
  source?: string;
  amount: number;
  received_at: string;
}

export interface ExpensePayload {
  category?: string;
  description?: string;
  amount: number;
  spent_at: string;
  goal_id?: string | null;
}

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

export const financeApi = {
  createIncome: (payload: IncomePayload) =>
    apiRequest(() => apiClient.post('/api/finance/incomes', payload)),
  listIncomes: () => apiRequest(() => apiClient.get('/api/finance/incomes')),
  updateIncome: (id: string, updates: Partial<IncomePayload>) =>
    apiRequest(() => apiClient.put(`/api/finance/incomes/${id}`, updates)),
  deleteIncome: (id: string) => apiRequest(() => apiClient.delete(`/api/finance/incomes/${id}`)),

  createExpense: (payload: ExpensePayload) =>
    apiRequest(() => apiClient.post('/api/finance/expenses', payload)),
  listExpenses: () => apiRequest(() => apiClient.get('/api/finance/expenses')),
  updateExpense: (id: string, updates: Partial<ExpensePayload>) =>
    apiRequest(() => apiClient.put(`/api/finance/expenses/${id}`, updates)),
  deleteExpense: (id: string) => apiRequest(() => apiClient.delete(`/api/finance/expenses/${id}`)),

  createGoal: (payload: GoalPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals', payload)),
  updateGoal: (id: string, updates: any) =>
    apiRequest(() => apiClient.put(`/api/finance/goals/${id}`, updates)),
  deleteGoal: (id: string) => apiRequest(() => apiClient.delete(`/api/finance/goals/${id}`)),

  contributeToGoal: (payload: GoalContributionPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/contributions', payload)),

  // Categories
  listCategories: () => apiRequest(() => apiClient.get('/api/finance/categories')),
  createCategory: (name: string) => apiRequest(() => apiClient.post('/api/finance/categories', { name })),
  // Goals
  listGoals: () => apiRequest(() => apiClient.get('/api/finance/goals')),
  
  // Goal categories and hierarchical goals
  listGoalCategories: () => apiRequest<GoalCategory[]>(() => apiClient.get('/api/finance/goals/categories')),
  listMainGoalsWithSubgoals: () => apiRequest<GoalWithSubgoals[]>(() => apiClient.get('/api/finance/goals/hierarchical')),
  createGoalExpense: (payload: GoalExpensePayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/expenses', payload)),
  listGoalExpenses: (goalId: string) =>
    apiRequest(() => apiClient.get(`/api/finance/goals/${goalId}/expenses`)),
};



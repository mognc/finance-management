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
  target_amount: number;
}

export interface GoalContributionPayload {
  goal_id: string;
  amount: number;
  contributed_at: string;
}

export interface MonthlySummaryDTO {
  year: number;
  month: number;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  category_breakdown: Record<string, number>;
  goal_spending: Record<string, number>;
  goal_contributions: Record<string, number>;
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

  contributeToGoal: (payload: GoalContributionPayload) =>
    apiRequest(() => apiClient.post('/api/finance/goals/contributions', payload)),

  getMonthlySummary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    const q = params.toString();
    const url = q ? `/api/finance/summary?${q}` : '/api/finance/summary';
    return apiRequest<MonthlySummaryDTO>(() => apiClient.get(url));
  },
  // Categories
  listCategories: () => apiRequest(() => apiClient.get('/api/finance/categories')),
  createCategory: (name: string) => apiRequest(() => apiClient.post('/api/finance/categories', { name })),
  // Goals
  listGoals: () => apiRequest(() => apiClient.get('/api/finance/goals')),
};



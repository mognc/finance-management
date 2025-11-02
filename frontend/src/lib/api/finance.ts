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

  listCategories: () => apiRequest(() => apiClient.get('/api/finance/categories')),
  createCategory: (name: string) => apiRequest(() => apiClient.post('/api/finance/categories', { name })),
};



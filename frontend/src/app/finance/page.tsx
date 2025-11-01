"use client";

import { useEffect, useState } from 'react';
import { financeApi} from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Receipt,
  Wallet,
  Target
} from 'lucide-react';

export default function FinancePage() {

  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('general');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategory, setNewCategory] = useState('');

  // UI State
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingIncome, setEditingIncome] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);

  const loadCategories = async () => {
    const res = await financeApi.listCategories();
    if (res.success && Array.isArray(res.data)) {
      const items = (res.data as any[]).map((c: any) => ({ id: c.id, name: String(c.name).trim() }));
      const seen = new Set<string>();
      const dedup = items.filter((c) => {
        const key = c.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).sort((a, b) => a.name.localeCompare(b.name));
      setCategories(dedup);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingIncome(true);
    const amt = parseFloat(incomeAmount);
    if (!amt || amt < 0) {
      showError('Invalid amount', 'Please enter a valid amount');
      setIsAddingIncome(false);
      return;
    }
    const iso = incomeDate ? `${incomeDate}T00:00:00Z` : new Date().toISOString();
    const res = await financeApi.createIncome({ 
      amount: amt, 
      source: incomeSource || 'salary', 
      received_at: iso 
    });
    if (res.success) {
      setIncomeAmount('');
      setIncomeSource('');
      setShowIncomeForm(false);
      showSuccess('Income added successfully');
    } else {
      showError('Failed to add income', 'Please try again');
    }
    setIsAddingIncome(false);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingExpense(true);
    const amt = parseFloat(expenseAmount);
    if (!amt || amt < 0) {
      showError('Invalid amount', 'Please enter a valid amount');
      setIsAddingExpense(false);
      return;
    }
    const iso = expenseDate ? `${expenseDate}T00:00:00Z` : new Date().toISOString();
    const res = await financeApi.createExpense({ 
      amount: amt, 
      category: expenseCategory, 
      description: expenseDescription, 
      spent_at: iso 
    });
    if (res.success) {
      setExpenseAmount('');
      setExpenseDescription('');
      setShowExpenseForm(false);
      showSuccess('Expense added successfully');
    } else {
      showError('Failed to add expense', 'Please try again');
    }
    setIsAddingExpense(false);
  };

  // Editable tables
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const loadLists = async () => {
    const [inc, exp] = await Promise.all([financeApi.listIncomes(), financeApi.listExpenses()]);
    if (inc.success) setIncomes((inc.data as any) || []);
    if (exp.success) setExpenses((exp.data as any) || []);
  };
  useEffect(() => { loadLists(); }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCategory(true);
    const name = newCategory.trim();
    if (!name) {
      showError('Invalid input', 'Please enter a category name');
      setIsAddingCategory(false);
      return;
    }
    const exists = categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) { 
      showError('Category already exists', 'Please choose a different name');
      setIsAddingCategory(false);
      return; 
    }
    const res = await financeApi.createCategory(name);
    if (res.success) {
      setNewCategory('');
      setShowCategoryForm(false);
      showSuccess('Category added successfully');
      await loadCategories();
    } else {
      showError('Failed to add category', 'Please try again');
    }
    setIsAddingCategory(false);
  };

  const updateIncome = async (row: any) => {
    await financeApi.updateIncome(row.id, { 
      amount: row.amount, 
      source: row.source, 
      received_at: row.received_at 
    });
    setEditingIncome(null);
    showSuccess('Income updated');
  };

  const deleteIncome = async (id: string) => { 
    await financeApi.deleteIncome(id); 
    showSuccess('Income deleted');
  };

  const updateExpense = async (row: any) => {
    await financeApi.updateExpense(row.id, { 
      amount: row.amount, 
      category: row.category, 
      spent_at: row.spent_at, 
      description: row.description 
    });
    setEditingExpense(null);
    showSuccess('Expense updated');
  };

  const deleteExpense = async (id: string) => { 
    await financeApi.deleteExpense(id); 
    showSuccess('Expense deleted');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Wallet className="h-10 w-10 text-blue-600" />
                Financial Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Track your income, expenses, and financial health
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowIncomeForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Button 
                onClick={() => setShowExpenseForm(true)}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button 
                onClick={() => setShowCategoryForm(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Target className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

            </div>

          {/* Income and Expense Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Income</h2>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setShowIncomeForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {incomes.length === 0 ? (
                <div className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No income records yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {incomes.map((r) => {
                    const isEditing = editingIncome === r.id;
                    return (
                      <div key={r.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-2">
                            {isEditing ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Input
                                  value={r.source || ''}
                                  onChange={(e) => r.source = e.target.value}
                                  placeholder="Source"
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={r.amount}
                                  onChange={(e) => r.amount = parseFloat(e.target.value)}
                                  placeholder="Amount"
                                />
                                <Input
                                  type="date"
                                  value={(r.received_at || '').slice(0,10)}
                                  onChange={(e) => r.received_at = `${e.target.value}T00:00:00Z`}
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 dark:text-white">${r.amount.toLocaleString()}</span>
                                  <span className="text-sm text-gray-500">{r.source}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(r.received_at).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateIncome(r)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingIncome(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingIncome(r.id)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteIncome(r.id)}
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

            {/* Expense Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {expenses.length === 0 ? (
                <div className="p-8 text-center">
                  <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No expense records yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((r) => {
                    const isEditing = editingExpense === r.id;
                    return (
                      <div key={r.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-2">
                            {isEditing ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                  value={r.category || ''}
                                  onChange={(e) => r.category = e.target.value}
                                  placeholder="Category"
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={r.amount}
                                  onChange={(e) => r.amount = parseFloat(e.target.value)}
                                  placeholder="Amount"
                                />
                                <Input
                                  type="date"
                                  value={(r.spent_at || '').slice(0,10)}
                                  onChange={(e) => r.spent_at = `${e.target.value}T00:00:00Z`}
                                />
                                <Input
                                  value={r.description || ''}
                                  onChange={(e) => r.description = e.target.value}
                                  placeholder="Description"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 dark:text-white">${r.amount.toLocaleString()}</span>
                                  <span className="text-sm text-gray-500">{r.category}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(r.spent_at).toLocaleDateString()}
                                  {r.description && <span className="ml-2">• {r.description}</span>}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateExpense(r)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingExpense(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingExpense(r.id)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteExpense(r.id)}
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
        </div>

        {/* Add Income Modal */}
        {showIncomeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Income</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIncomeForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddIncome} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <Input
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source
                  </label>
                  <Input
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                    placeholder="e.g., Salary, Freelance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <Input
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    type="date"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowIncomeForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAddingIncome}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAddingIncome ? 'Adding...' : 'Add Income'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Expense Modal */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Expense</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExpenseForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <Input
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="general">General</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="What was this expense for?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <Input
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    type="date"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExpenseForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAddingExpense}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isAddingExpense ? 'Adding...' : 'Add Expense'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Category</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Groceries, Entertainment"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCategoryForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAddingCategory}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isAddingCategory ? 'Adding...' : 'Add Category'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </MainLayout>
  );
}

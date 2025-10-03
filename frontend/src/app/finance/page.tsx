'use client';

import { useEffect, useMemo, useState } from 'react';
import { financeApi, type MonthlySummaryDTO } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';

export default function FinancePage() {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummaryDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('general');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategory, setNewCategory] = useState('');

  const loadCategories = async () => {
    const res = await financeApi.listCategories();
    if (res.success && Array.isArray(res.data)) {
      setCategories(res.data as any);
    }
  };

  const refresh = async (y = year, m = month) => {
    setLoading(true);
    const res = await financeApi.getMonthlySummary(y, m);
    setLoading(false);
    if (res.success && res.data) setSummary(res.data);
    else showError('Failed to load summary');
  };

  useEffect(() => {
    refresh();
    loadCategories();
  }, []);

  const categoryRows = useMemo(() => {
    if (!summary) return [] as Array<{ key: string; value: number }>;
    return Object.entries(summary.category_breakdown).map(([k, v]) => ({ key: k, value: v }));
  }, [summary]);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(incomeAmount);
    if (!amt || amt < 0) return;
    const iso = incomeDate ? `${incomeDate}T00:00:00Z` : new Date().toISOString();
    const res = await financeApi.createIncome({ amount: amt, source: 'salary', received_at: iso });
    if (res.success) {
      setIncomeAmount('');
      await refresh();
    } else showError('Failed to add income');
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (!amt || amt < 0) return;
    const iso = expenseDate ? `${expenseDate}T00:00:00Z` : new Date().toISOString();
    const res = await financeApi.createExpense({ amount: amt, category: expenseCategory, description: '', spent_at: iso });
    if (res.success) {
      setExpenseAmount('');
      await refresh();
    } else showError('Failed to add expense');
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const res = await financeApi.createCategory(newCategory.trim());
    if (res.success) {
      setNewCategory('');
      showSuccess('Category added');
      await loadCategories();
    } else showError('Failed to add category');
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Finance</h1>
        <p className="text-gray-500">Track income and expenses; view monthly summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Add Income</h2>
          <form onSubmit={handleAddIncome} className="space-y-3">
            <input value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="Amount" className="w-full border rounded p-2" type="number" step="0.01" />
            <input value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} className="w-full border rounded p-2" type="date" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Add Income</button>
          </form>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-3">
            <input value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Amount" className="w-full border rounded p-2" type="number" step="0.01" />
            <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="w-full border rounded p-2">
              <option value="general">general</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="w-full border rounded p-2" type="date" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Add Expense</button>
          </form>
          <form onSubmit={handleCreateCategory} className="space-y-3 mt-4">
            <div className="text-sm font-medium">Add Custom Category</div>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name" className="w-full border rounded p-2" />
            <button className="px-4 py-2 bg-gray-700 text-white rounded" type="submit">Add Category</button>
          </form>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Summary Period</h2>
          <div className="flex gap-2">
            <input value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full border rounded p-2" type="number" />
            <input value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full border rounded p-2" type="number" min={1} max={12} />
            <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={() => refresh()}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="font-semibold mb-3">Monthly Summary</h2>
        {loading ? (
          <div>Loading...</div>
        ) : summary ? (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat label="Income" value={summary.total_income} />
              <Stat label="Expenses" value={summary.total_expenses} />
              <Stat label="Savings" value={summary.total_savings} />
            </div>
            <div>
              <h3 className="font-medium mb-2">By Category</h3>
              {categoryRows.length === 0 ? (
                <p className="text-sm text-gray-500">No data</p>
              ) : (
                <ul className="list-disc ml-6">
                  {categoryRows.map((row) => (
                    <li key={row.key} className="flex justify-between">
                      <span>{row.key}</span>
                      <span>${row.value.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div>No summary available.</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 border rounded">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">${value.toFixed(2)}</div>
    </div>
  );
}



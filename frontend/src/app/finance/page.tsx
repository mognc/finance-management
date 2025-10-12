"use client";

import { useEffect, useMemo, useState } from 'react';
import { financeApi, type MonthlySummaryDTO } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

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

  // Simple SVG bar for category distribution
  const CategoryChart = ({ data }: { data: Array<{ key: string; value: number }> }) => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let x = 0;
    const width = 600;
    const height = 16;
    return (
      <svg width={width} height={height} className="rounded overflow-hidden border">
        {data.map((d, i) => {
          const w = Math.max(1, Math.round((d.value / total) * width));
          const rect = (
            <rect key={i} x={x} y={0} width={w} height={height} fill={palette(i)} />
          );
          x += w;
          return rect;
        })}
      </svg>
    );
  };

  const palette = (i: number) => {
    const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#22c55e'];
    return colors[i % colors.length];
  };

  const categoryData = useMemo(() => categoryRows.map((d) => ({ name: d.key, value: d.value })), [categoryRows]);
  const kpisData = useMemo(() => ([
    { name: 'Income', value: summary?.total_income || 0 },
    { name: 'Expenses', value: summary?.total_expenses || 0 },
    { name: 'Savings', value: summary?.total_savings || 0 },
  ]), [summary]);

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

  // Editable tables
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const loadLists = async () => {
    const [inc, exp] = await Promise.all([financeApi.listIncomes(), financeApi.listExpenses()]);
    if (inc.success) setIncomes((inc.data as any) || []);
    if (exp.success) setExpenses((exp.data as any) || []);
  };
  useEffect(() => { loadLists(); }, []);
  useEffect(() => { loadLists(); }, [summary]);

  const updateIncome = async (row: any) => {
    await financeApi.updateIncome(row.id, { amount: row.amount, source: row.source, received_at: row.received_at });
    await refresh();
  };
  const deleteIncome = async (id: string) => { await financeApi.deleteIncome(id); await refresh(); };
  const updateExpense = async (row: any) => {
    await financeApi.updateExpense(row.id, { amount: row.amount, category: row.category, spent_at: row.spent_at, description: row.description });
    await refresh();
  };
  const deleteExpense = async (id: string) => { await financeApi.deleteExpense(id); await refresh(); };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    const exists = categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) { showError('Category already exists'); return; }
    const res = await financeApi.createCategory(name);
    if (res.success) {
      setNewCategory('');
      showSuccess('Category added');
      await loadCategories();
    } else showError('Failed to add category');
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track income and expenses; view monthly summary.</p>
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
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="w-full h-64 bg-white/0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={palette(index)} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={kpisData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2563eb" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                      <CategoryChart data={categoryRows} />
                    </div>
                    <ul className="list-disc ml-6">
                      {categoryRows.map((row) => (
                        <li key={row.key} className="flex justify-between">
                          <span>{row.key}</span>
                          <span>${row.value.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>No summary available.</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-3">Recent Incomes</h2>
            {incomes.length === 0 ? <p className="text-sm text-gray-500">No incomes</p> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Date</th>
                    <th>Source</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2"><input className="border rounded px-2 py-1" value={(r.received_at || '').slice(0,10)} onChange={(e) => r.received_at = `${e.target.value}T00:00:00Z`} type="date" /></td>
                      <td><input className="border rounded px-2 py-1" value={r.source || ''} onChange={(e) => r.source = e.target.value} /></td>
                      <td><input className="border rounded px-2 py-1" value={r.amount} type="number" step="0.01" onChange={(e) => r.amount = parseFloat(e.target.value)} /></td>
                      <td className="text-right">
                        <button className="px-2 py-1 text-blue-600" onClick={() => updateIncome(r)}>Save</button>
                        <button className="px-2 py-1 text-red-600" onClick={() => deleteIncome(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-3">Recent Expenses</h2>
            {expenses.length === 0 ? <p className="text-sm text-gray-500">No expenses</p> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2"><input className="border rounded px-2 py-1" value={(r.spent_at || '').slice(0,10)} onChange={(e) => r.spent_at = `${e.target.value}T00:00:00Z`} type="date" /></td>
                      <td><input className="border rounded px-2 py-1" value={r.category || ''} onChange={(e) => r.category = e.target.value} /></td>
                      <td><input className="border rounded px-2 py-1" value={r.amount} type="number" step="0.01" onChange={(e) => r.amount = parseFloat(e.target.value)} /></td>
                      <td className="text-right">
                        <button className="px-2 py-1 text-blue-600" onClick={() => updateExpense(r)}>Save</button>
                        <button className="px-2 py-1 text-red-600" onClick={() => deleteExpense(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
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



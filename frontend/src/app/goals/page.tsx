"use client";

import { useEffect, useMemo, useState } from 'react';
import { financeApi } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface GoalWithProgressDTO {
  Goal: {
    id: string;
    name: string;
    target_amount: number;
    target_date?: string | null;
  };
  ContributedSum: number;
  ExpenseSum: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalWithProgressDTO[]>([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [contribGoalId, setContribGoalId] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [contribDate, setContribDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Editing table for goals
  const saveGoal = async (g: any) => {
    await financeApi.updateGoal(g.Goal.id, { name: g.Goal.name, target_amount: g.Goal.target_amount, target_date: g.Goal.target_date ? `${g.Goal.target_date.slice(0,10)}T00:00:00Z` : undefined });
    await loadGoals();
  };

  const loadGoals = async () => {
    const res = await financeApi.listGoals();
    if (res.success && Array.isArray(res.data)) setGoals(res.data as any);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const progressRows = useMemo(() => goals.map(g => {
    const saved = g.ContributedSum;
    const target = g.Goal.target_amount || 0;
    const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
    return { id: g.Goal.id, name: g.Goal.name, saved, target, pct, targetDate: g.Goal.target_date };
  }), [goals]);

  const palette = (i: number) => {
    const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#22c55e'];
    return colors[i % colors.length];
  };

  const pieData = useMemo(() => progressRows.map(r => ({ name: r.name, value: Math.max(0, r.saved) })), [progressRows]);
  const barData = useMemo(() => progressRows.map(r => ({ name: r.name, saved: r.saved, target: r.target })), [progressRows]);

  const ProgressChart = ({ pct }: { pct: number }) => (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div className="h-2 bg-green-600 rounded" style={{ width: `${pct}%` }} />
    </div>
  );

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(targetAmount);
    if (!name.trim() || !amt || amt < 0) return;
    const payload: any = { name: name.trim(), target_amount: amt };
    if (targetDate) payload.target_date = `${targetDate}T00:00:00Z`;
    const res = await financeApi.createGoal(payload);
    if (res.success) {
      setName(''); setTargetAmount(''); setTargetDate('');
      showSuccess('Goal created');
      await loadGoals();
    } else showError('Failed to create goal');
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contribAmount);
    if (!contribGoalId || !amt || amt <= 0) return;
    const payload = { goal_id: contribGoalId, amount: amt, contributed_at: `${contribDate}T00:00:00Z` };
    const res = await financeApi.contributeToGoal(payload);
    if (res.success) {
      setContribAmount('');
      showSuccess('Contribution added');
      await loadGoals();
    } else showError('Failed to contribute');
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals & Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track savings progress and timelines for your targets.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Create Goal</h2>
          <form onSubmit={handleCreateGoal} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name" className="w-full border rounded p-2" />
            <input value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Target amount" className="w-full border rounded p-2" type="number" step="0.01" />
            <input value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full border rounded p-2" type="date" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Add Goal</button>
          </form>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Contribute to Goal</h2>
          <form onSubmit={handleContribute} className="space-y-3">
            <select value={contribGoalId} onChange={(e) => setContribGoalId(e.target.value)} className="w-full border rounded p-2">
              <option value="">Select goal</option>
              {goals.map(g => (
                <option key={g.Goal.id} value={g.Goal.id}>{g.Goal.name}</option>
              ))}
            </select>
            <input value={contribAmount} onChange={(e) => setContribAmount(e.target.value)} placeholder="Amount" className="w-full border rounded p-2" type="number" step="0.01" />
            <input value={contribDate} onChange={(e) => setContribDate(e.target.value)} className="w-full border rounded p-2" type="date" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Contribute</button>
          </form>
        </div>
      </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-3">Goals Progress</h2>
        {progressRows.length === 0 ? (
            <p className="text-sm text-gray-500">No goals yet</p>
          ) : (
          <div className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={palette(index)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" hide={false} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="saved" fill="#16a34a" />
                    <Bar dataKey="target" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {goals.map((g: any) => {
              const row = progressRows.find(r => r.id === g.Goal.id)!;
              return (
                <div key={g.Goal.id} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                    <input className="border rounded px-2 py-1" value={g.Goal.name} onChange={(e) => g.Goal.name = e.target.value} />
                    <input className="border rounded px-2 py-1" type="number" step="0.01" value={g.Goal.target_amount} onChange={(e) => g.Goal.target_amount = parseFloat(e.target.value)} />
                    <input className="border rounded px-2 py-1" type="date" value={(g.Goal.target_date || '').slice(0,10)} onChange={(e) => g.Goal.target_date = e.target.value} />
                    <div className="text-right">
                      <button className="px-2 py-1 text-blue-600" onClick={() => saveGoal(g)}>Save</button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{row.name}</span>
                    <span>${row.saved.toFixed(2)} / ${row.target.toFixed(2)} ({row.pct}%) {row.targetDate ? `· target ${row.targetDate}` : ''}</span>
                  </div>
                  <ProgressChart pct={row.pct} />
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}



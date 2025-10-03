'use client';

import { useEffect, useMemo, useState } from 'react';
import { financeApi } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';

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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Goals & Wishlist</h1>
        <p className="text-gray-500">Track savings progress and timelines for your targets.</p>
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
          <div className="space-y-3">
            {progressRows.map(row => (
              <div key={row.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{row.name}</span>
                  <span>${row.saved.toFixed(2)} / ${row.target.toFixed(2)} ({row.pct}%) {row.targetDate ? `· target ${row.targetDate}` : ''}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-green-600 rounded" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



"use client";

import { useEffect, useMemo, useState } from 'react';
import { financeApi, type MonthlySummaryDTO, type HistoricalSummaryDTO } from '@/lib/api';
import { showError, showSuccess } from '@/lib/utils/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';
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
  PiggyBank,
  BarChart3,
  PieChart as PieChartIcon,
  Receipt,
  Wallet,
  Target,
  Filter,
  Download,
  Calendar,
  History,
  FileText
} from 'lucide-react';

export default function FinancePage() {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummaryDTO | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Historical data state
  const [historicalData, setHistoricalData] = useState<HistoricalSummaryDTO[]>([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalPeriod, setHistoricalPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [historicalStartDate, setHistoricalStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6); // 6 months ago
    return date.toISOString().slice(0, 10);
  });
  const [historicalEndDate, setHistoricalEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showHistoricalView, setShowHistoricalView] = useState(false);

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

  const refresh = async (y = year, m = month) => {
    setLoading(true);
    const res = await financeApi.getMonthlySummary(y, m);
    setLoading(false);
    if (res.success && res.data) setSummary(res.data);
    else showError('Failed to load summary');
  };

  const loadHistoricalData = async () => {
    setHistoricalLoading(true);
    const res = await financeApi.getHistoricalData(historicalPeriod, historicalStartDate, historicalEndDate);
    setHistoricalLoading(false);
    if (res.success && res.data) {
      setHistoricalData(res.data);
    } else {
      showError('Failed to load historical data');
    }
  };

  const generateHistoricalSummary = async () => {
    const res = await financeApi.generateHistoricalSummary({
      period_type: historicalPeriod,
      start_date: historicalStartDate,
      end_date: historicalEndDate
    });
    if (res.success) {
      showSuccess('Historical summary generated successfully');
      await loadHistoricalData();
    } else {
      showError('Failed to generate historical summary');
    }
  };

  const downloadPDFReport = async () => {
    const res = await financeApi.generatePDFReport({
      period_type: historicalPeriod,
      start_date: historicalStartDate,
      end_date: historicalEndDate,
      format: 'summary'
    });
    if (res.success) {
      // Create a blob and download
      const blob = new Blob([res.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${historicalPeriod}-${historicalStartDate}-to-${historicalEndDate}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSuccess('Report downloaded successfully');
    } else {
      showError('Failed to generate PDF report');
    }
  };

  useEffect(() => {
    refresh();
    loadCategories();
  }, []);

  const categoryRows = useMemo(() => {
    if (!summary) return [] as Array<{ key: string; value: number }>;
    return Object.entries(summary.category_breakdown).map(([k, v]) => ({ key: k, value: v }));
  }, [summary]);


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

  // Historical data for charts
  const historicalChartData = useMemo(() => {
    return historicalData.map(item => ({
      period: item.period_start.slice(0, 10),
      income: item.total_income,
      expenses: item.total_expense,
      savings: item.total_savings,
      period_type: item.period_type
    })).sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
  }, [historicalData]);

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
      await refresh();
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
      await refresh();
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
  useEffect(() => { loadLists(); }, [summary]);

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
    await refresh();
  };

  const deleteIncome = async (id: string) => { 
    await financeApi.deleteIncome(id); 
    showSuccess('Income deleted');
    await refresh(); 
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
    await refresh();
  };

  const deleteExpense = async (id: string) => { 
    await financeApi.deleteExpense(id); 
    showSuccess('Expense deleted');
    await refresh(); 
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
              <Button 
                onClick={() => setShowHistoricalView(!showHistoricalView)}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <History className="h-4 w-4 mr-2" />
                {showHistoricalView ? 'Current View' : 'Historical View'}
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Summary Period</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <Input
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  type="number"
                  min="2020"
                  max="2030"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Month
                </label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  type="number"
                  min="1"
                  max="12"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => refresh()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Historical Data Controls */}
          {showHistoricalView && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historical Data Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Period Type
                  </label>
                  <select
                    value={historicalPeriod}
                    onChange={(e) => setHistoricalPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                    className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <Input
                    value={historicalStartDate}
                    onChange={(e) => setHistoricalStartDate(e.target.value)}
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <Input
                    value={historicalEndDate}
                    onChange={(e) => setHistoricalEndDate(e.target.value)}
                    type="date"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    onClick={loadHistoricalData}
                    disabled={historicalLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {historicalLoading ? 'Loading...' : 'Load Data'}
                  </Button>
                  <Button 
                    onClick={generateHistoricalSummary}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button 
                    onClick={downloadPDFReport}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading summary...</span>
              </div>
            </div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">${summary.total_income.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">${summary.total_expenses.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Savings</p>
                    <p className={`text-2xl font-bold ${summary.total_savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${summary.total_savings.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${summary.total_savings >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    <PiggyBank className={`h-6 w-6 ${summary.total_savings >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No data available</h3>
              <p className="text-gray-600 dark:text-gray-400">Start by adding some income or expenses</p>
            </div>
          )}

          {/* Charts Section */}
          {summary && categoryRows.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Analytics</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Expense Categories
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={categoryData} 
                          dataKey="value" 
                          nameKey="name" 
                          outerRadius={100}
                          label={({ name }) => name}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={palette(index)} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Income vs Expenses
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={kpisData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Data Charts */}
          {showHistoricalView && historicalChartData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Historical Financial Trends</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Income vs Expenses Over Time
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="income" fill="#16a34a" name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Savings Trend
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                        <Legend />
                        <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Savings" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

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
      </div>
    </MainLayout>
  );
}

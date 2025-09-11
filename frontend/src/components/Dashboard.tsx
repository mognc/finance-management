'use client';

import { 
  BanknotesIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Balance',
    value: '$12,345.67',
    change: '+2.5%',
    changeType: 'positive',
    icon: BanknotesIcon,
  },
  {
    name: 'Monthly Income',
    value: '$4,500.00',
    change: '+5.2%',
    changeType: 'positive',
    icon: ArrowUpIcon,
  },
  {
    name: 'Monthly Expenses',
    value: '$3,200.45',
    change: '-1.8%',
    changeType: 'negative',
    icon: ArrowDownIcon,
  },
  {
    name: 'Credit Cards',
    value: '$1,234.56',
    change: '-3.1%',
    changeType: 'negative',
    icon: CreditCardIcon,
  },
];

const recentTransactions = [
  { id: 1, description: 'Grocery Store', amount: '-$85.50', date: 'Today', type: 'expense' },
  { id: 2, description: 'Salary Deposit', amount: '+$4,500.00', date: 'Yesterday', type: 'income' },
  { id: 3, description: 'Coffee Shop', amount: '-$12.75', date: '2 days ago', type: 'expense' },
  { id: 4, description: 'Freelance Work', amount: '+$250.00', date: '3 days ago', type: 'income' },
  { id: 5, description: 'Gas Station', amount: '-$45.20', date: '4 days ago', type: 'expense' },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all transactions →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Add Transaction
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Set Budget
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Income</span>
              <span className="font-medium text-green-600">$4,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-medium text-red-600">$3,200.45</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Net</span>
              <span className="font-bold text-blue-600">$1,299.55</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Rent</span>
              <span className="font-medium">$1,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Electricity</span>
              <span className="font-medium">$85.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Internet</span>
              <span className="font-medium">$65.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

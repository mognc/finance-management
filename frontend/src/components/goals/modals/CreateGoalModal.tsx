import { X, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GoalCategory, GoalWithSubgoals } from '@/lib/api';
import { getCategorySuggestions } from '../constants/categoryGoalTypeMapping';
import { getCategoryIcon } from '../utils/goalUtils';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  
  // Form state
  name: string;
  description: string;
  category: string;
  customCategoryName: string;
  targetAmount: string;
  targetValue: string;
  targetDate: string;
  parentGoalId: string;
  isMainGoal: boolean;
  goalType: 'financial' | 'numeric' | 'boolean' | 'habit';
  
  // Form setters
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setCategory: (value: string) => void;
  setCustomCategoryName: (value: string) => void;
  setTargetAmount: (value: string) => void;
  setTargetValue: (value: string) => void;
  setTargetDate: (value: string) => void;
  setParentGoalId: (value: string) => void;
  setIsMainGoal: (value: boolean) => void;
  setGoalType: (value: 'financial' | 'numeric' | 'boolean' | 'habit') => void;
  setProgressType: (value: 'amount' | 'percentage' | 'count' | 'completion') => void;
  
  // Data
  goalCategories: GoalCategory[];
  hierarchicalGoals: GoalWithSubgoals[];
}

export default function CreateGoalModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  name,
  description,
  category,
  customCategoryName,
  targetAmount,
  targetValue,
  targetDate,
  parentGoalId,
  isMainGoal,
  goalType,
  setName,
  setDescription,
  setCategory,
  setCustomCategoryName,
  setTargetAmount,
  setTargetValue,
  setTargetDate,
  setParentGoalId,
  setIsMainGoal,
  setGoalType,
  setProgressType,
  goalCategories,
  hierarchicalGoals,
}: CreateGoalModalProps) {
  const isCustomCategory = category === 'Custom';
  const selectedCategoryData = goalCategories.find(c => c.name === category);
  const categorySuggestions = category ? getCategorySuggestions(category) : null;
  const CategoryIcon = category ? getCategoryIcon(category) : null;
  
  if (!isOpen) return null;

  // Auto-suggest goal type when category is selected
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (newCategory !== 'Custom') {
      setCustomCategoryName('');
      // Auto-suggest goal type based on category
      const suggestions = getCategorySuggestions(newCategory);
      setGoalType(suggestions.suggestedType);
      // Set progress type based on suggested goal type
      if (suggestions.suggestedType === 'financial') setProgressType('amount');
      else if (suggestions.suggestedType === 'numeric') setProgressType('count');
      else if (suggestions.suggestedType === 'boolean') setProgressType('completion');
      else if (suggestions.suggestedType === 'habit') setProgressType('count');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set up your personal, financial, or life objective with categories and milestones</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Goal Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Go to Germany"
                  className="h-12 text-lg"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal and what you want to achieve..."
                  className="w-full h-20 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {goalCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
                
                {/* Category Description and Suggestions */}
                {category && !isCustomCategory && categorySuggestions && (
                  <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      {CategoryIcon && (
                        <div 
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ 
                            backgroundColor: selectedCategoryData?.color ? `${selectedCategoryData.color}20` : '#e0f2fe',
                            color: selectedCategoryData?.color || '#0284c7'
                          }}
                        >
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {categorySuggestions.description}
                        </p>
                        {categorySuggestions.examples.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center gap-1 mb-2">
                              <Lightbulb className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Examples:</span>
                            </div>
                            <ul className="space-y-1">
                              {categorySuggestions.examples.slice(0, 2).map((example: string, idx: number) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {isCustomCategory && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Custom Category Name *
                  </label>
                  <Input
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="Enter your custom category name"
                    className="h-12 text-lg"
                    required={isCustomCategory}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Create a custom category that suits your specific goal
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Goal Type *
                  {category && categorySuggestions && (
                    <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">
                      (Suggested: {categorySuggestions.suggestedType === 'financial' ? 'Financial' : 
                        categorySuggestions.suggestedType === 'numeric' ? 'Numeric' :
                        categorySuggestions.suggestedType === 'boolean' ? 'Simple' : 'Habit'})
                    </span>
                  )}
                </label>
                <select
                  value={goalType}
                  onChange={(e) => {
                    const newType = e.target.value as 'financial' | 'numeric' | 'boolean' | 'habit';
                    setGoalType(newType);
                    if (newType === 'financial') setProgressType('amount');
                    else if (newType === 'numeric') setProgressType('count');
                    else if (newType === 'boolean') setProgressType('completion');
                    else if (newType === 'habit') setProgressType('count');
                  }}
                  className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="financial">💰 Financial Goal (Track money amounts)</option>
                  <option value="numeric">🔢 Numeric Goal (Count quantities, numbers)</option>
                  <option value="boolean">✓ Simple Goal (Complete/Incomplete tasks)</option>
                  <option value="habit">🔄 Habit Goal (Recurring daily/weekly habits)</option>
                </select>
                <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <div>
                    {goalType === 'financial' && 'Track savings, expenses, or financial targets in monetary terms'}
                    {goalType === 'numeric' && 'Track progress by counting items, quantities, or measurable numbers'}
                    {goalType === 'boolean' && 'Simple on/off goals that are either complete or incomplete'}
                    {goalType === 'habit' && 'Build recurring habits tracked over time (daily, weekly, etc.)'}
                  </div>
                </div>
              </div>
              
              {(goalType === 'financial') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Target Amount *
                  </label>
                  <Input
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    className="h-12 text-lg"
                    required
                  />
                </div>
              )}
              
              {(goalType === 'numeric' || goalType === 'habit') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Target {goalType === 'habit' ? 'Count' : 'Value'} *
                  </label>
                  <Input
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={goalType === 'habit' ? "30 (days)" : "20 (books)"}
                    type="number"
                    min="1"
                    className="h-12 text-lg"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Target Date
                </label>
                <Input
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  type="date"
                  className="h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Goal Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isMainGoal}
                      onChange={() => setIsMainGoal(true)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Main Goal</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Primary objective</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isMainGoal}
                      onChange={() => setIsMainGoal(false)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Sub-goal</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Part of a larger goal</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {!isMainGoal && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Parent Goal *
                </label>
                <select
                  value={parentGoalId}
                  onChange={(e) => setParentGoalId(e.target.value)}
                  className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isMainGoal}
                >
                  <option value="">Select a parent goal</option>
                  {hierarchicalGoals.map(goalGroup => (
                    <option key={goalGroup.goal.id} value={goalGroup.goal.id}>{goalGroup.goal.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                {isLoading ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


/**
 * Mapping of categories to suggested goal types
 * Helps auto-suggest appropriate goal types based on category selection
 */
export const CATEGORY_TO_GOAL_TYPE_MAP: Record<string, {
  suggestedType: 'financial' | 'numeric' | 'boolean' | 'habit';
  examples: string[];
  description: string;
}> = {
  'Financial Goals': {
    suggestedType: 'financial',
    examples: ['Save $10,000 for emergency fund', 'Pay off credit card debt', 'Save for down payment'],
    description: 'Track monetary targets and financial milestones'
  },
  'Career': {
    suggestedType: 'numeric',
    examples: ['Complete 5 certification courses', 'Attend 10 networking events', 'Apply to 20 companies'],
    description: 'Track professional achievements and milestones'
  },
  'Health': {
    suggestedType: 'boolean',
    examples: ['Complete annual health checkup', 'Get vaccinated', 'Schedule dental appointment'],
    description: 'Track health-related tasks and milestones'
  },
  'Fitness': {
    suggestedType: 'habit',
    examples: ['Exercise 3 times per week', 'Run 5km daily', 'Do 100 push-ups per week'],
    description: 'Build and maintain fitness habits'
  },
  'Education': {
    suggestedType: 'numeric',
    examples: ['Read 12 books this year', 'Complete 5 online courses', 'Learn 100 new words'],
    description: 'Track learning progress and educational achievements'
  },
  'Personal Growth': {
    suggestedType: 'boolean',
    examples: ['Start daily meditation practice', 'Write in journal daily', 'Practice gratitude'],
    description: 'Track personal development and self-improvement'
  },
  'Travel': {
    suggestedType: 'financial',
    examples: ['Save $5,000 for Europe trip', 'Book flights to Japan', 'Save for travel insurance'],
    description: 'Plan and save for travel adventures'
  },
  'Relationships': {
    suggestedType: 'habit',
    examples: ['Call family weekly', 'Date night twice a month', 'Send birthday cards on time'],
    description: 'Nurture relationships and maintain connections'
  },
  'Hobbies': {
    suggestedType: 'habit',
    examples: ['Practice guitar 30 min daily', 'Paint 2 paintings per month', 'Complete one puzzle per week'],
    description: 'Pursue interests and creative activities'
  },
  'Home': {
    suggestedType: 'boolean',
    examples: ['Organize garage', 'Repaint living room', 'Install new lighting'],
    description: 'Track home improvement projects'
  },
  'Technology': {
    suggestedType: 'numeric',
    examples: ['Complete 10 coding projects', 'Learn 5 new frameworks', 'Build 3 apps'],
    description: 'Track tech learning and projects'
  },
  'Creative': {
    suggestedType: 'habit',
    examples: ['Write 500 words daily', 'Create one artwork per week', 'Practice piano 20 min daily'],
    description: 'Track creative practice and output'
  },
  'Daily Life Goals': {
    suggestedType: 'habit',
    examples: ['Wake up at 6 AM daily', 'Drink 8 glasses of water', 'Read before bed'],
    description: 'Establish daily routines and habits'
  },
  'Long Term Goals': {
    suggestedType: 'financial',
    examples: ['Save for retirement', 'Buy a house', 'Start a business'],
    description: 'Plan for major life milestones'
  },
  'Emergency Fund': {
    suggestedType: 'financial',
    examples: ['Save 6 months of expenses', 'Build $10,000 emergency fund'],
    description: 'Build financial security and safety net'
  },
  'Investment': {
    suggestedType: 'financial',
    examples: ['Invest $500 monthly', 'Reach $50,000 portfolio value', 'Max out 401k'],
    description: 'Grow wealth through investments'
  },
  'Sports': {
    suggestedType: 'habit',
    examples: ['Play soccer twice a week', 'Run 5km three times per week', 'Attend gym 4x weekly'],
    description: 'Track athletic training and sports activities'
  },
  'Music': {
    suggestedType: 'habit',
    examples: ['Practice 1 hour daily', 'Learn 12 new songs', 'Perform at open mic'],
    description: 'Track musical practice and achievements'
  },
  'Learning': {
    suggestedType: 'numeric',
    examples: ['Complete 20 courses', 'Learn 1000 new words', 'Read 50 books'],
    description: 'Track continuous learning progress'
  },
  'Environmental': {
    suggestedType: 'habit',
    examples: ['Reduce plastic use', 'Plant 20 trees', 'Use bike for commute 3x weekly'],
    description: 'Track environmental actions and sustainability'
  },
};

/**
 * Get suggested goal type and examples for a category
 */
export const getCategorySuggestions = (categoryName: string) => {
  return CATEGORY_TO_GOAL_TYPE_MAP[categoryName] || {
    suggestedType: 'numeric' as const,
    examples: [],
    description: 'Set and track your goal progress'
  };
};


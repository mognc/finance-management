// Re-export the API client and notes API
export { apiClient, apiRequest, checkApiHealth } from './client';
export { notesApi } from './notes';
export { financeApi } from './finance';
export { goalsApi } from './goals';
export type { 
  GoalPayload, 
  GoalContributionPayload, 
  GoalCategory, 
  GoalWithSubgoals, 
  GoalExpensePayload 
} from './goals';
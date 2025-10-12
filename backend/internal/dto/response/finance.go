package response

import (
	"time"

	"github.com/google/uuid"
)

// IncomeResponse represents income data in API responses
type IncomeResponse struct {
	ID         uuid.UUID `json:"id"`
	UserID     uuid.UUID `json:"user_id"`
	Source     string    `json:"source"`
	Amount     float64   `json:"amount"`
	ReceivedAt time.Time `json:"received_at"`
	CreatedAt  time.Time `json:"created_at"`
}

// ExpenseResponse represents expense data in API responses
type ExpenseResponse struct {
	ID          uuid.UUID  `json:"id"`
	UserID      uuid.UUID  `json:"user_id"`
	Category    string     `json:"category"`
	Description string     `json:"description"`
	Amount      float64    `json:"amount"`
	SpentAt     time.Time  `json:"spent_at"`
	GoalID      *uuid.UUID `json:"goal_id"`
	CreatedAt   time.Time  `json:"created_at"`
}

// GoalResponse represents goal data in API responses
type GoalResponse struct {
	ID           uuid.UUID  `json:"id"`
	UserID       uuid.UUID  `json:"user_id"`
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	Category     string     `json:"category"`
	TargetAmount float64    `json:"target_amount"`
	TargetDate   *time.Time `json:"target_date"`
	ParentGoalID *uuid.UUID `json:"parent_goal_id"`
	IsMainGoal   bool       `json:"is_main_goal"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// GoalContributionResponse represents goal contribution data in API responses
type GoalContributionResponse struct {
	ID            uuid.UUID `json:"id"`
	UserID        uuid.UUID `json:"user_id"`
	GoalID        uuid.UUID `json:"goal_id"`
	Amount        float64   `json:"amount"`
	ContributedAt time.Time `json:"contributed_at"`
	CreatedAt     time.Time `json:"created_at"`
}

// GoalCategoryResponse represents goal category data in API responses
type GoalCategoryResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	Color       string    `json:"color"`
	CreatedAt   time.Time `json:"created_at"`
}

// GoalExpenseResponse represents goal expense data in API responses
type GoalExpenseResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	GoalID      uuid.UUID `json:"goal_id"`
	ExpenseID   uuid.UUID `json:"expense_id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// GoalWithSubgoalsResponse represents a goal with its sub-goals in API responses
type GoalWithSubgoalsResponse struct {
	Goal     GoalResponse   `json:"goal"`
	Subgoals []GoalResponse `json:"subgoals"`
}

// MonthlySummaryResponse represents monthly summary data in API responses
type MonthlySummaryResponse struct {
	Year              int                   `json:"year"`
	Month             int                   `json:"month"`
	TotalIncome       float64               `json:"total_income"`
	TotalExpenses     float64               `json:"total_expenses"`
	TotalSavings      float64               `json:"total_savings"`
	CategoryBreakdown map[string]float64    `json:"category_breakdown"`
	GoalSpending      map[uuid.UUID]float64 `json:"goal_spending"`
	GoalContributions map[uuid.UUID]float64 `json:"goal_contributions"`
}

// CategoryResponse represents category data in API responses
type CategoryResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// HistoricalSummaryResponse represents historical summary data in API responses
type HistoricalSummaryResponse struct {
	ID           uuid.UUID `json:"id"`
	UserID       uuid.UUID `json:"user_id"`
	PeriodType   string    `json:"period_type"`
	PeriodStart  time.Time `json:"period_start"`
	PeriodEnd    time.Time `json:"period_end"`
	TotalIncome  float64   `json:"total_income"`
	TotalExpense float64   `json:"total_expense"`
	TotalSavings float64   `json:"total_savings"`
	CategoryData string    `json:"category_data"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// GoalWithProgressResponse represents a goal with progress data in API responses
type GoalWithProgressResponse struct {
	Goal           GoalResponse `json:"goal"`
	ContributedSum float64      `json:"contributed_sum"`
	ExpenseSum     float64      `json:"expense_sum"`
	Progress       float64      `json:"progress"` // percentage of target achieved
}

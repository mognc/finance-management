package request

import (
	"time"

	"github.com/google/uuid"
)

// CreateIncomeRequest for adding income
type CreateIncomeRequest struct {
	Source     string    `json:"source" binding:"required"`
	Amount     float64   `json:"amount" binding:"required,min=0"`
	ReceivedAt time.Time `json:"received_at" binding:"required"`
}

// UpdateIncomeRequest for editing income
type UpdateIncomeRequest struct {
	Source     *string    `json:"source"`
	Amount     *float64   `json:"amount" binding:"omitempty,min=0"`
	ReceivedAt *time.Time `json:"received_at"`
}

// CreateExpenseRequest for adding expense
type CreateExpenseRequest struct {
	Category    string     `json:"category" binding:"required"`
	Description string     `json:"description"`
	Amount      float64    `json:"amount" binding:"required,min=0"`
	SpentAt     time.Time  `json:"spent_at" binding:"required"`
	GoalID      *uuid.UUID `json:"goal_id"`
}

// UpdateExpenseRequest for editing expense
type UpdateExpenseRequest struct {
	Category    *string     `json:"category"`
	Description *string     `json:"description"`
	Amount      *float64    `json:"amount" binding:"omitempty,min=0"`
	SpentAt     *time.Time  `json:"spent_at"`
	GoalID      **uuid.UUID `json:"goal_id"`
}

// CreateGoalRequest for creating a goal
type CreateGoalRequest struct {
	Name         string     `json:"name" binding:"required,min=1,max=200"`
	Description  string     `json:"description" binding:"max=1000"`
	Category     string     `json:"category" binding:"max=100"`
	TargetAmount float64    `json:"target_amount" binding:"required,min=0"`
	TargetDate   *time.Time `json:"target_date"`
	ParentGoalID *uuid.UUID `json:"parent_goal_id"`
	IsMainGoal   bool       `json:"is_main_goal"`
}

// UpdateGoalRequest for editing goal
type UpdateGoalRequest struct {
	Name         *string     `json:"name" binding:"omitempty,min=1,max=200"`
	Description  *string     `json:"description" binding:"omitempty,max=1000"`
	Category     *string     `json:"category" binding:"omitempty,max=100"`
	TargetAmount *float64    `json:"target_amount" binding:"omitempty,min=0"`
	TargetDate   *time.Time  `json:"target_date"`
	ParentGoalID **uuid.UUID `json:"parent_goal_id"`
	IsMainGoal   *bool       `json:"is_main_goal"`
}

// CreateGoalContributionRequest for contributing to a goal
type CreateGoalContributionRequest struct {
	GoalID        uuid.UUID `json:"goal_id" binding:"required"`
	Amount        float64   `json:"amount" binding:"required,min=0"`
	ContributedAt time.Time `json:"contributed_at" binding:"required"`
}

// CreateCategoryRequest for creating a category
type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// CreateGoalExpenseRequest for associating expenses with goals
type CreateGoalExpenseRequest struct {
	GoalID      uuid.UUID `json:"goal_id" binding:"required"`
	ExpenseID   uuid.UUID `json:"expense_id" binding:"required"`
	Amount      float64   `json:"amount" binding:"required,min=0"`
	Description string    `json:"description" binding:"max=500"`
}

// HistoricalDataRequest for fetching historical data
type HistoricalDataRequest struct {
	PeriodType string `json:"period_type" binding:"required,oneof=weekly monthly yearly"`
	StartDate  string `json:"start_date" binding:"required"`
	EndDate    string `json:"end_date" binding:"required"`
}

// PDFReportRequest for generating PDF reports
type PDFReportRequest struct {
	PeriodType string `json:"period_type" binding:"required,oneof=weekly monthly yearly"`
	StartDate  string `json:"start_date" binding:"required"`
	EndDate    string `json:"end_date" binding:"required"`
	Format     string `json:"format" binding:"omitempty,oneof=summary detailed"`
}

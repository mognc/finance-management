package models

import (
	"time"

	"github.com/google/uuid"
)

// Income represents an income entry (e.g., monthly salary)
type Income struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	Source     string    `json:"source" gorm:"column:source"`
	Amount     float64   `json:"amount" gorm:"column:amount"`
	ReceivedAt time.Time `json:"received_at" gorm:"type:date;column:received_at"`
	CreatedAt  time.Time `json:"created_at" gorm:"column:created_at"`
}

// Expense represents a spending entry
type Expense struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	Category    string     `json:"category" gorm:"column:category"`
	Description string     `json:"description" gorm:"column:description"`
	Amount      float64    `json:"amount" gorm:"column:amount"`
	SpentAt     time.Time  `json:"spent_at" gorm:"type:date;column:spent_at"`
	GoalID      *uuid.UUID `json:"goal_id" gorm:"type:uuid;column:goal_id"`
	CreatedAt   time.Time  `json:"created_at" gorm:"column:created_at"`
}

// Goal represents a savings goal
type Goal struct {
	ID           uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID       uuid.UUID  `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	Name         string     `json:"name" gorm:"column:name"`
	Description  string     `json:"description" gorm:"column:description"`
	Category     string     `json:"category" gorm:"column:category"`
	TargetAmount float64    `json:"target_amount" gorm:"column:target_amount"`
	TargetDate   *time.Time `json:"target_date" gorm:"type:date;column:target_date"`
	ParentGoalID *uuid.UUID `json:"parent_goal_id" gorm:"type:uuid;column:parent_goal_id"`
	IsMainGoal   bool       `json:"is_main_goal" gorm:"column:is_main_goal"`
	CreatedAt    time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"column:updated_at"`
}

// GoalContribution represents money allocated to a goal
type GoalContribution struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID        uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	GoalID        uuid.UUID `json:"goal_id" gorm:"type:uuid;index;column:goal_id"`
	Amount        float64   `json:"amount" gorm:"column:amount"`
	ContributedAt time.Time `json:"contributed_at" gorm:"type:date;column:contributed_at"`
	CreatedAt     time.Time `json:"created_at" gorm:"column:created_at"`
}

// CreateIncomeRequest for adding income
type CreateIncomeRequest struct {
	Source     string    `json:"source"`
	Amount     float64   `json:"amount" binding:"required"`
	ReceivedAt time.Time `json:"received_at" binding:"required"`
}

// UpdateIncomeRequest for editing income
type UpdateIncomeRequest struct {
	Source     *string    `json:"source"`
	Amount     *float64   `json:"amount"`
	ReceivedAt *time.Time `json:"received_at"`
}

// CreateExpenseRequest for adding expense
type CreateExpenseRequest struct {
	Category    string     `json:"category"`
	Description string     `json:"description"`
	Amount      float64    `json:"amount" binding:"required"`
	SpentAt     time.Time  `json:"spent_at" binding:"required"`
	GoalID      *uuid.UUID `json:"goal_id"`
}

// UpdateExpenseRequest for editing expense
type UpdateExpenseRequest struct {
	Category    *string     `json:"category"`
	Description *string     `json:"description"`
	Amount      *float64    `json:"amount"`
	SpentAt     *time.Time  `json:"spent_at"`
	GoalID      **uuid.UUID `json:"goal_id"`
}

// CreateGoalRequest for creating a goal
type CreateGoalRequest struct {
	Name         string     `json:"name" binding:"required"`
	Description  string     `json:"description"`
	Category     string     `json:"category"`
	TargetAmount float64    `json:"target_amount" binding:"required"`
	TargetDate   *time.Time `json:"target_date"`
	ParentGoalID *uuid.UUID `json:"parent_goal_id"`
	IsMainGoal   bool       `json:"is_main_goal"`
}

// UpdateGoalRequest for editing goal
type UpdateGoalRequest struct {
	Name         *string     `json:"name"`
	Description  *string     `json:"description"`
	Category     *string     `json:"category"`
	TargetAmount *float64    `json:"target_amount"`
	TargetDate   *time.Time  `json:"target_date"`
	ParentGoalID **uuid.UUID `json:"parent_goal_id"`
	IsMainGoal   *bool       `json:"is_main_goal"`
}

// CreateGoalContributionRequest for contributing to a goal
type CreateGoalContributionRequest struct {
	GoalID        uuid.UUID `json:"goal_id" binding:"required"`
	Amount        float64   `json:"amount" binding:"required"`
	ContributedAt time.Time `json:"contributed_at" binding:"required"`
}

// GoalCategory represents predefined goal categories
type GoalCategory struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	Name        string    `json:"name" gorm:"column:name"`
	Description string    `json:"description" gorm:"column:description"`
	Icon        string    `json:"icon" gorm:"column:icon"`
	Color       string    `json:"color" gorm:"column:color"`
	CreatedAt   time.Time `json:"created_at" gorm:"column:created_at"`
}

// GoalExpense represents expenses associated with goals
type GoalExpense struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	GoalID      uuid.UUID `json:"goal_id" gorm:"type:uuid;index;column:goal_id"`
	ExpenseID   uuid.UUID `json:"expense_id" gorm:"type:uuid;index;column:expense_id"`
	Amount      float64   `json:"amount" gorm:"column:amount"`
	Description string    `json:"description" gorm:"column:description"`
	CreatedAt   time.Time `json:"created_at" gorm:"column:created_at"`
}

// GoalWithSubgoals represents a goal with its sub-goals
type GoalWithSubgoals struct {
	Goal     Goal   `json:"goal"`
	Subgoals []Goal `json:"subgoals"`
}

// CreateGoalExpenseRequest for associating expenses with goals
type CreateGoalExpenseRequest struct {
	GoalID      uuid.UUID `json:"goal_id" binding:"required"`
	ExpenseID   uuid.UUID `json:"expense_id" binding:"required"`
	Amount      float64   `json:"amount" binding:"required"`
	Description string    `json:"description"`
}

// MonthlySummary groups totals for a month
type MonthlySummary struct {
	Year              int                   `json:"year"`
	Month             int                   `json:"month"`
	TotalIncome       float64               `json:"total_income"`
	TotalExpenses     float64               `json:"total_expenses"`
	TotalSavings      float64               `json:"total_savings"`
	CategoryBreakdown map[string]float64    `json:"category_breakdown"`
	GoalSpending      map[uuid.UUID]float64 `json:"goal_spending"`
	GoalContributions map[uuid.UUID]float64 `json:"goal_contributions"`
}

// Category for expenses
type Category struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	Name      string    `json:"name" gorm:"column:name"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
}

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required"`
}

// HistoricalSummary represents aggregated financial data for different time periods
type HistoricalSummary struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID       uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	PeriodType   string    `json:"period_type" gorm:"column:period_type"` // "weekly", "monthly", "yearly"
	PeriodStart  time.Time `json:"period_start" gorm:"type:date;column:period_start"`
	PeriodEnd    time.Time `json:"period_end" gorm:"type:date;column:period_end"`
	TotalIncome  float64   `json:"total_income" gorm:"column:total_income"`
	TotalExpense float64   `json:"total_expense" gorm:"column:total_expense"`
	TotalSavings float64   `json:"total_savings" gorm:"column:total_savings"`
	CategoryData string    `json:"category_data" gorm:"type:text;column:category_data"` // JSON string
	CreatedAt    time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"column:updated_at"`
}

// HistoricalDataRequest for fetching historical data
type HistoricalDataRequest struct {
	PeriodType string `json:"period_type" binding:"required"` // "weekly", "monthly", "yearly"
	StartDate  string `json:"start_date" binding:"required"`
	EndDate    string `json:"end_date" binding:"required"`
}

// PDFReportRequest for generating PDF reports
type PDFReportRequest struct {
	PeriodType string `json:"period_type" binding:"required"`
	StartDate  string `json:"start_date" binding:"required"`
	EndDate    string `json:"end_date" binding:"required"`
	Format     string `json:"format"` // "summary", "detailed"
}

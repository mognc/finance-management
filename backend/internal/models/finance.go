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
	TargetAmount float64    `json:"target_amount" gorm:"column:target_amount"`
	TargetDate   *time.Time `json:"target_date" gorm:"type:date;column:target_date"`
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

// CreateExpenseRequest for adding expense
type CreateExpenseRequest struct {
	Category    string     `json:"category"`
	Description string     `json:"description"`
	Amount      float64    `json:"amount" binding:"required"`
	SpentAt     time.Time  `json:"spent_at" binding:"required"`
	GoalID      *uuid.UUID `json:"goal_id"`
}

// CreateGoalRequest for creating a goal
type CreateGoalRequest struct {
	Name         string     `json:"name" binding:"required"`
	TargetAmount float64    `json:"target_amount" binding:"required"`
	TargetDate   *time.Time `json:"target_date"`
}

// CreateGoalContributionRequest for contributing to a goal
type CreateGoalContributionRequest struct {
	GoalID        uuid.UUID `json:"goal_id" binding:"required"`
	Amount        float64   `json:"amount" binding:"required"`
	ContributedAt time.Time `json:"contributed_at" binding:"required"`
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

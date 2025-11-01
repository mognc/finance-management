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

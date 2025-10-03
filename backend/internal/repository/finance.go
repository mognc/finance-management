package repository

import (
	"time"

	"finance-management/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// FinanceRepositoryInterface defines CRUD and aggregation operations for finance data
type FinanceRepositoryInterface interface {
	CreateIncome(income *models.Income) error
	CreateExpense(expense *models.Expense) error
	CreateGoal(goal *models.Goal) error
	CreateGoalContribution(contrib *models.GoalContribution) error
	GetMonthlySummary(userID uuid.UUID, year int, month int) (*models.MonthlySummary, error)
	CreateCategory(cat *models.Category) error
	ListCategories(userID uuid.UUID) ([]models.Category, error)
	ListGoalsWithProgress(userID uuid.UUID) ([]GoalWithProgress, error)
}

type FinanceRepository struct {
	db *gorm.DB
}

func NewFinanceRepository(db *gorm.DB) *FinanceRepository { return &FinanceRepository{db: db} }

func (r *FinanceRepository) CreateIncome(income *models.Income) error {
	return r.db.Create(income).Error
}

func (r *FinanceRepository) CreateExpense(expense *models.Expense) error {
	return r.db.Create(expense).Error
}

func (r *FinanceRepository) CreateGoal(goal *models.Goal) error {
	return r.db.Create(goal).Error
}

func (r *FinanceRepository) CreateGoalContribution(contrib *models.GoalContribution) error {
	return r.db.Create(contrib).Error
}

func (r *FinanceRepository) CreateCategory(cat *models.Category) error {
	return r.db.Create(cat).Error
}

func (r *FinanceRepository) ListCategories(userID uuid.UUID) ([]models.Category, error) {
	var cats []models.Category
	if err := r.db.Where("user_id = ?", userID).Order("name ASC").Find(&cats).Error; err != nil {
		return nil, err
	}
	return cats, nil
}

type GoalWithProgress struct {
	Goal           models.Goal
	ContributedSum float64
	ExpenseSum     float64
}

func (r *FinanceRepository) ListGoalsWithProgress(userID uuid.UUID) ([]GoalWithProgress, error) {
	var goals []models.Goal
	if err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&goals).Error; err != nil {
		return nil, err
	}
	// sums per goal
	type sumRow struct {
		GoalID uuid.UUID
		Total  float64
	}
	var contribRows []sumRow
	_ = r.db.Model(&models.GoalContribution{}).Where("user_id = ?", userID).Select("goal_id, COALESCE(SUM(amount),0) AS total").Group("goal_id").Scan(&contribRows).Error
	var expenseRows []sumRow
	_ = r.db.Model(&models.Expense{}).Where("user_id = ? AND goal_id IS NOT NULL", userID).Select("goal_id, COALESCE(SUM(amount),0) AS total").Group("goal_id").Scan(&expenseRows).Error
	contribMap := map[uuid.UUID]float64{}
	for _, r := range contribRows {
		contribMap[r.GoalID] = r.Total
	}
	expenseMap := map[uuid.UUID]float64{}
	for _, r := range expenseRows {
		expenseMap[r.GoalID] = r.Total
	}
	result := make([]GoalWithProgress, 0, len(goals))
	for _, g := range goals {
		result = append(result, GoalWithProgress{Goal: g, ContributedSum: contribMap[g.ID], ExpenseSum: expenseMap[g.ID]})
	}
	return result, nil
}

// GetMonthlySummary aggregates income, expenses, savings and breakdowns for a given month
func (r *FinanceRepository) GetMonthlySummary(userID uuid.UUID, year int, month int) (*models.MonthlySummary, error) {
	start := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0)

	summary := &models.MonthlySummary{
		Year:              year,
		Month:             month,
		CategoryBreakdown: map[string]float64{},
		GoalSpending:      map[uuid.UUID]float64{},
		GoalContributions: map[uuid.UUID]float64{},
	}

	// Total income
	var totalIncome float64
	if err := r.db.Model(&models.Income{}).
		Where("user_id = ? AND received_at >= ? AND received_at < ?", userID, start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalIncome).Error; err != nil {
		return nil, err
	}
	summary.TotalIncome = totalIncome

	// Total expenses
	var totalExpenses float64
	if err := r.db.Model(&models.Expense{}).
		Where("user_id = ? AND spent_at >= ? AND spent_at < ?", userID, start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalExpenses).Error; err != nil {
		return nil, err
	}
	summary.TotalExpenses = totalExpenses

	// Category breakdown
	type catRow struct {
		Category string
		Total    float64
	}
	var catRows []catRow
	if err := r.db.Model(&models.Expense{}).
		Where("user_id = ? AND spent_at >= ? AND spent_at < ?", userID, start, end).
		Select("category, COALESCE(SUM(amount), 0) as total").
		Group("category").
		Scan(&catRows).Error; err != nil {
		return nil, err
	}
	for _, row := range catRows {
		summary.CategoryBreakdown[row.Category] = row.Total
	}

	// Goal-linked spending (expenses with goal_id)
	type goalRow struct {
		GoalID uuid.UUID
		Total  float64
	}
	var goalSpendRows []goalRow
	if err := r.db.Model(&models.Expense{}).
		Where("user_id = ? AND spent_at >= ? AND spent_at < ? AND goal_id IS NOT NULL", userID, start, end).
		Select("goal_id, COALESCE(SUM(amount), 0) as total").
		Group("goal_id").
		Scan(&goalSpendRows).Error; err != nil {
		return nil, err
	}
	for _, row := range goalSpendRows {
		summary.GoalSpending[row.GoalID] = row.Total
	}

	// Goal contributions
	var contribRows []goalRow
	if err := r.db.Model(&models.GoalContribution{}).
		Where("user_id = ? AND contributed_at >= ? AND contributed_at < ?", userID, start, end).
		Select("goal_id, COALESCE(SUM(amount), 0) as total").
		Group("goal_id").
		Scan(&contribRows).Error; err != nil {
		return nil, err
	}
	var totalContrib float64
	for _, row := range contribRows {
		summary.GoalContributions[row.GoalID] = row.Total
		totalContrib += row.Total
	}

	// Define savings as total contributions for now (can evolve later)
	summary.TotalSavings = totalContrib

	return summary, nil
}

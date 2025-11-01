package services

import (
	"fmt"
	"time"

	"finance-management/internal/dto/request"
	"finance-management/internal/dto/response"
	"finance-management/internal/errors"
	"finance-management/internal/models"
	"finance-management/internal/repository"
	"finance-management/internal/validation"

	"github.com/google/uuid"
)

// FinanceService handles business logic for finance operations
type FinanceService struct {
	financeRepo repository.FinanceRepositoryInterface
}

// NewFinanceService creates a new finance service
func NewFinanceService(financeRepo repository.FinanceRepositoryInterface) *FinanceService {
	return &FinanceService{
		financeRepo: financeRepo,
	}
}

// CreateIncome creates a new income entry
func (s *FinanceService) CreateIncome(userID uuid.UUID, req *request.CreateIncomeRequest) (*response.IncomeResponse, error) {
	// Validate amount
	if err := validation.ValidateAmount(req.Amount); err != nil {
		return nil, err
	}

	// Create income model
	income := &models.Income{
		ID:         uuid.New(),
		UserID:     userID,
		Source:     req.Source,
		Amount:     req.Amount,
		ReceivedAt: req.ReceivedAt,
		CreatedAt:  time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateIncome(income); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create income")
	}

	// Convert to response
	return &response.IncomeResponse{
		ID:         income.ID,
		UserID:     income.UserID,
		Source:     income.Source,
		Amount:     income.Amount,
		ReceivedAt: income.ReceivedAt,
		CreatedAt:  income.CreatedAt,
	}, nil
}

// ListIncomes retrieves user's income entries
func (s *FinanceService) ListIncomes(userID uuid.UUID, limit int) ([]response.IncomeResponse, error) {
	incomes, err := s.financeRepo.ListIncomes(userID, limit)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list incomes")
	}

	// Convert to response
	responses := make([]response.IncomeResponse, len(incomes))
	for i, income := range incomes {
		responses[i] = response.IncomeResponse{
			ID:         income.ID,
			UserID:     income.UserID,
			Source:     income.Source,
			Amount:     income.Amount,
			ReceivedAt: income.ReceivedAt,
			CreatedAt:  income.CreatedAt,
		}
	}

	return responses, nil
}

// UpdateIncome updates an existing income entry
func (s *FinanceService) UpdateIncome(userID, incomeID uuid.UUID, req *request.UpdateIncomeRequest) error {
	updates := make(map[string]interface{})

	if req.Source != nil {
		updates["source"] = *req.Source
	}
	if req.Amount != nil {
		if err := validation.ValidateAmount(*req.Amount); err != nil {
			return err
		}
		updates["amount"] = *req.Amount
	}
	if req.ReceivedAt != nil {
		updates["received_at"] = *req.ReceivedAt
	}

	if len(updates) == 0 {
		return errors.ErrInvalidInput
	}

	if err := s.financeRepo.UpdateIncome(incomeID, userID, updates); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to update income")
	}

	return nil
}

// DeleteIncome deletes an income entry
func (s *FinanceService) DeleteIncome(userID, incomeID uuid.UUID) error {
	if err := s.financeRepo.DeleteIncome(incomeID, userID); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to delete income")
	}
	return nil
}

// CreateExpense creates a new expense entry
func (s *FinanceService) CreateExpense(userID uuid.UUID, req *request.CreateExpenseRequest) (*response.ExpenseResponse, error) {
	// Validate amount
	if err := validation.ValidateAmount(req.Amount); err != nil {
		return nil, err
	}

	// Create expense model
	expense := &models.Expense{
		ID:          uuid.New(),
		UserID:      userID,
		Category:    req.Category,
		Description: req.Description,
		Amount:      req.Amount,
		SpentAt:     req.SpentAt,
		GoalID:      req.GoalID,
		CreatedAt:   time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateExpense(expense); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create expense")
	}

	// Convert to response
	return &response.ExpenseResponse{
		ID:          expense.ID,
		UserID:      expense.UserID,
		Category:    expense.Category,
		Description: expense.Description,
		Amount:      expense.Amount,
		SpentAt:     expense.SpentAt,
		GoalID:      expense.GoalID,
		CreatedAt:   expense.CreatedAt,
	}, nil
}

// ListExpenses retrieves user's expense entries
func (s *FinanceService) ListExpenses(userID uuid.UUID, limit int) ([]response.ExpenseResponse, error) {
	expenses, err := s.financeRepo.ListExpenses(userID, limit)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list expenses")
	}

	// Convert to response
	responses := make([]response.ExpenseResponse, len(expenses))
	for i, expense := range expenses {
		responses[i] = response.ExpenseResponse{
			ID:          expense.ID,
			UserID:      expense.UserID,
			Category:    expense.Category,
			Description: expense.Description,
			Amount:      expense.Amount,
			SpentAt:     expense.SpentAt,
			GoalID:      expense.GoalID,
			CreatedAt:   expense.CreatedAt,
		}
	}

	return responses, nil
}

// UpdateExpense updates an existing expense entry
func (s *FinanceService) UpdateExpense(userID, expenseID uuid.UUID, req *request.UpdateExpenseRequest) error {
	updates := make(map[string]interface{})

	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Amount != nil {
		if err := validation.ValidateAmount(*req.Amount); err != nil {
			return err
		}
		updates["amount"] = *req.Amount
	}
	if req.SpentAt != nil {
		updates["spent_at"] = *req.SpentAt
	}
	if req.GoalID != nil {
		updates["goal_id"] = req.GoalID
	}

	if len(updates) == 0 {
		return errors.ErrInvalidInput
	}

	if err := s.financeRepo.UpdateExpense(expenseID, userID, updates); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to update expense")
	}

	return nil
}

// DeleteExpense deletes an expense entry
func (s *FinanceService) DeleteExpense(userID, expenseID uuid.UUID) error {
	if err := s.financeRepo.DeleteExpense(expenseID, userID); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to delete expense")
	}
	return nil
}

// CreateGoal creates a new savings goal
func (s *FinanceService) CreateGoal(userID uuid.UUID, req *request.CreateGoalRequest) (*response.GoalResponse, error) {
	// Validate goal data
	if err := validation.ValidateGoalName(req.Name); err != nil {
		return nil, err
	}
	if err := validation.ValidateGoalDescription(req.Description); err != nil {
		return nil, err
	}
	if err := validation.ValidateGoalTarget(req.TargetAmount); err != nil {
		return nil, err
	}
	if req.TargetDate != nil {
		if err := validation.ValidateGoalDate(*req.TargetDate); err != nil {
			return nil, err
		}
	}

	// Create goal model
	goal := &models.Goal{
		ID:           uuid.New(),
		UserID:       userID,
		Name:         req.Name,
		Description:  req.Description,
		Category:     req.Category,
		TargetAmount: req.TargetAmount,
		TargetDate:   req.TargetDate,
		ParentGoalID: req.ParentGoalID,
		IsMainGoal:   req.IsMainGoal,
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateGoal(goal); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create goal")
	}

	// Convert to response
	return &response.GoalResponse{
		ID:           goal.ID,
		UserID:       goal.UserID,
		Name:         goal.Name,
		Description:  goal.Description,
		Category:     goal.Category,
		TargetAmount: goal.TargetAmount,
		TargetDate:   goal.TargetDate,
		ParentGoalID: goal.ParentGoalID,
		IsMainGoal:   goal.IsMainGoal,
		CreatedAt:    goal.CreatedAt,
		UpdatedAt:    goal.UpdatedAt,
	}, nil
}

// ListGoalsWithProgress retrieves user's goals with progress information
func (s *FinanceService) ListGoalsWithProgress(userID uuid.UUID) ([]response.GoalWithProgressResponse, error) {
	goalsWithProgress, err := s.financeRepo.ListGoalsWithProgress(userID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list goals with progress")
	}

	// Convert to response
	responses := make([]response.GoalWithProgressResponse, len(goalsWithProgress))
	for i, goalWithProgress := range goalsWithProgress {
		// Calculate progress percentage
		progress := 0.0
		if goalWithProgress.Goal.TargetAmount > 0 {
			progress = (goalWithProgress.ContributedSum / goalWithProgress.Goal.TargetAmount) * 100
			if progress > 100 {
				progress = 100
			}
		}

		responses[i] = response.GoalWithProgressResponse{
			Goal: response.GoalResponse{
				ID:           goalWithProgress.Goal.ID,
				UserID:       goalWithProgress.Goal.UserID,
				Name:         goalWithProgress.Goal.Name,
				Description:  goalWithProgress.Goal.Description,
				Category:     goalWithProgress.Goal.Category,
				TargetAmount: goalWithProgress.Goal.TargetAmount,
				TargetDate:   goalWithProgress.Goal.TargetDate,
				ParentGoalID: goalWithProgress.Goal.ParentGoalID,
				IsMainGoal:   goalWithProgress.Goal.IsMainGoal,
				CreatedAt:    goalWithProgress.Goal.CreatedAt,
				UpdatedAt:    goalWithProgress.Goal.UpdatedAt,
			},
			ContributedSum: goalWithProgress.ContributedSum,
			ExpenseSum:     goalWithProgress.ExpenseSum,
			Progress:       progress,
		}
	}

	return responses, nil
}

// UpdateGoal updates an existing goal
func (s *FinanceService) UpdateGoal(userID, goalID uuid.UUID, req *request.UpdateGoalRequest) error {
	updates := make(map[string]interface{})

	if req.Name != nil {
		if err := validation.ValidateGoalName(*req.Name); err != nil {
			return err
		}
		updates["name"] = *req.Name
	}
	if req.Description != nil {
		if err := validation.ValidateGoalDescription(*req.Description); err != nil {
			return err
		}
		updates["description"] = *req.Description
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.TargetAmount != nil {
		if err := validation.ValidateGoalTarget(*req.TargetAmount); err != nil {
			return err
		}
		updates["target_amount"] = *req.TargetAmount
	}
	if req.TargetDate != nil {
		if err := validation.ValidateGoalDate(*req.TargetDate); err != nil {
			return err
		}
		updates["target_date"] = *req.TargetDate
	}
	if req.ParentGoalID != nil {
		updates["parent_goal_id"] = req.ParentGoalID
	}
	if req.IsMainGoal != nil {
		updates["is_main_goal"] = *req.IsMainGoal
	}

	if len(updates) == 0 {
		return errors.ErrInvalidInput
	}

	if err := s.financeRepo.UpdateGoal(goalID, userID, updates); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to update goal")
	}

	return nil
}

// DeleteGoal deletes a goal
func (s *FinanceService) DeleteGoal(userID, goalID uuid.UUID) error {
	if err := s.financeRepo.DeleteGoal(goalID, userID); err != nil {
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to delete goal")
	}
	return nil
}

// GetMonthlySummary retrieves monthly financial summary
func (s *FinanceService) GetMonthlySummary(userID uuid.UUID, year, month int) (*response.MonthlySummaryResponse, error) {
	summary, err := s.financeRepo.GetMonthlySummary(userID, year, month)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get monthly summary")
	}

	// Convert to response
	return &response.MonthlySummaryResponse{
		Year:              summary.Year,
		Month:             summary.Month,
		TotalIncome:       summary.TotalIncome,
		TotalExpenses:     summary.TotalExpenses,
		TotalSavings:      summary.TotalSavings,
		CategoryBreakdown: summary.CategoryBreakdown,
		GoalSpending:      summary.GoalSpending,
		GoalContributions: summary.GoalContributions,
	}, nil
}

// CreateGoalContribution creates a new goal contribution
func (s *FinanceService) CreateGoalContribution(userID uuid.UUID, req *request.CreateGoalContributionRequest) (*response.GoalContributionResponse, error) {
	// Validate amount
	if err := validation.ValidateAmount(req.Amount); err != nil {
		return nil, err
	}

	// Create goal contribution model
	contribution := &models.GoalContribution{
		ID:            uuid.New(),
		UserID:        userID,
		GoalID:        req.GoalID,
		Amount:        req.Amount,
		ContributedAt: req.ContributedAt,
		CreatedAt:     time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateGoalContribution(contribution); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create goal contribution")
	}

	// Convert to response
	return &response.GoalContributionResponse{
		ID:            contribution.ID,
		UserID:        contribution.UserID,
		GoalID:        contribution.GoalID,
		Amount:        contribution.Amount,
		ContributedAt: contribution.ContributedAt,
		CreatedAt:     contribution.CreatedAt,
	}, nil
}

// CreateCategory creates a new expense category
func (s *FinanceService) CreateCategory(userID uuid.UUID, req *request.CreateCategoryRequest) (*response.CategoryResponse, error) {
	// Validate category name
	if req.Name == "" {
		return nil, errors.ErrInvalidInput
	}

	// Create category model
	category := &models.Category{
		ID:        uuid.New(),
		UserID:    userID,
		Name:      req.Name,
		CreatedAt: time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateCategory(category); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create category")
	}

	// Convert to response
	return &response.CategoryResponse{
		ID:        category.ID,
		UserID:    category.UserID,
		Name:      category.Name,
		CreatedAt: category.CreatedAt,
	}, nil
}

// ListCategories retrieves user's expense categories
func (s *FinanceService) ListCategories(userID uuid.UUID) ([]response.CategoryResponse, error) {
	categories, err := s.financeRepo.ListCategories(userID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list categories")
	}

	// Convert to response
	responses := make([]response.CategoryResponse, len(categories))
	for i, category := range categories {
		responses[i] = response.CategoryResponse{
			ID:        category.ID,
			UserID:    category.UserID,
			Name:      category.Name,
			CreatedAt: category.CreatedAt,
		}
	}

	return responses, nil
}

// ListGoalCategories retrieves all goal categories
func (s *FinanceService) ListGoalCategories() ([]response.GoalCategoryResponse, error) {
	categories, err := s.financeRepo.ListGoalCategories()
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list goal categories")
	}

	// Convert to response
	responses := make([]response.GoalCategoryResponse, len(categories))
	for i, category := range categories {
		responses[i] = response.GoalCategoryResponse{
			ID:          category.ID,
			Name:        category.Name,
			Description: category.Description,
			CreatedAt:   category.CreatedAt,
		}
	}

	return responses, nil
}

// ListMainGoalsWithSubgoals retrieves main goals with their subgoals
func (s *FinanceService) ListMainGoalsWithSubgoals(userID uuid.UUID) ([]response.GoalWithSubgoalsResponse, error) {
	goalsWithSubgoals, err := s.financeRepo.ListMainGoalsWithSubgoals(userID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list main goals with subgoals")
	}

	// Convert to response
	responses := make([]response.GoalWithSubgoalsResponse, len(goalsWithSubgoals))
	for i, goalWithSubgoals := range goalsWithSubgoals {
		// Convert main goal
		mainGoal := response.GoalResponse{
			ID:           goalWithSubgoals.Goal.ID,
			UserID:       goalWithSubgoals.Goal.UserID,
			Name:         goalWithSubgoals.Goal.Name,
			Description:  goalWithSubgoals.Goal.Description,
			Category:     goalWithSubgoals.Goal.Category,
			TargetAmount: goalWithSubgoals.Goal.TargetAmount,
			TargetDate:   goalWithSubgoals.Goal.TargetDate,
			ParentGoalID: goalWithSubgoals.Goal.ParentGoalID,
			IsMainGoal:   goalWithSubgoals.Goal.IsMainGoal,
			CreatedAt:    goalWithSubgoals.Goal.CreatedAt,
			UpdatedAt:    goalWithSubgoals.Goal.UpdatedAt,
		}

		// Convert subgoals
		subgoals := make([]response.GoalResponse, len(goalWithSubgoals.Subgoals))
		for j, subgoal := range goalWithSubgoals.Subgoals {
			subgoals[j] = response.GoalResponse{
				ID:           subgoal.ID,
				UserID:       subgoal.UserID,
				Name:         subgoal.Name,
				Description:  subgoal.Description,
				Category:     subgoal.Category,
				TargetAmount: subgoal.TargetAmount,
				TargetDate:   subgoal.TargetDate,
				ParentGoalID: subgoal.ParentGoalID,
				IsMainGoal:   subgoal.IsMainGoal,
				CreatedAt:    subgoal.CreatedAt,
				UpdatedAt:    subgoal.UpdatedAt,
			}
		}

		responses[i] = response.GoalWithSubgoalsResponse{
			Goal:     mainGoal,
			Subgoals: subgoals,
		}
	}

	return responses, nil
}

// CreateGoalExpense creates a new goal expense
func (s *FinanceService) CreateGoalExpense(userID uuid.UUID, req *request.CreateGoalExpenseRequest) (*response.GoalExpenseResponse, error) {
	// Validate amount
	if err := validation.ValidateAmount(req.Amount); err != nil {
		return nil, err
	}

	// Create goal expense model
	goalExpense := &models.GoalExpense{
		ID:          uuid.New(),
		UserID:      userID,
		GoalID:      req.GoalID,
		ExpenseID:   req.ExpenseID,
		Amount:      req.Amount,
		Description: req.Description,
		CreatedAt:   time.Now().UTC(),
	}

	// Save to database
	if err := s.financeRepo.CreateGoalExpense(goalExpense); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create goal expense")
	}

	// Convert to response
	return &response.GoalExpenseResponse{
		ID:          goalExpense.ID,
		UserID:      goalExpense.UserID,
		GoalID:      goalExpense.GoalID,
		ExpenseID:   goalExpense.ExpenseID,
		Amount:      goalExpense.Amount,
		Description: goalExpense.Description,
		CreatedAt:   goalExpense.CreatedAt,
	}, nil
}

// ListGoalExpenses retrieves expenses for a specific goal
func (s *FinanceService) ListGoalExpenses(userID, goalID uuid.UUID) ([]response.GoalExpenseResponse, error) {
	goalExpenses, err := s.financeRepo.ListGoalExpenses(userID, goalID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list goal expenses")
	}

	// Convert to response
	responses := make([]response.GoalExpenseResponse, len(goalExpenses))
	for i, goalExpense := range goalExpenses {
		responses[i] = response.GoalExpenseResponse{
			ID:          goalExpense.ID,
			UserID:      goalExpense.UserID,
			GoalID:      goalExpense.GoalID,
			ExpenseID:   goalExpense.ExpenseID,
			Amount:      goalExpense.Amount,
			Description: goalExpense.Description,
			CreatedAt:   goalExpense.CreatedAt,
		}
	}

	return responses, nil
}

// GetHistoricalData retrieves historical financial data
func (s *FinanceService) GetHistoricalData(userID uuid.UUID, periodType string, startDate, endDate time.Time) ([]response.HistoricalSummaryResponse, error) {
	summaries, err := s.financeRepo.GetHistoricalSummaries(userID, periodType, startDate, endDate)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get historical data")
	}

	// Convert to response
	responses := make([]response.HistoricalSummaryResponse, len(summaries))
	for i, summary := range summaries {
		responses[i] = response.HistoricalSummaryResponse{
			ID:           summary.ID,
			UserID:       summary.UserID,
			PeriodType:   summary.PeriodType,
			PeriodStart:  summary.PeriodStart,
			PeriodEnd:    summary.PeriodEnd,
			TotalIncome:  summary.TotalIncome,
			TotalExpense: summary.TotalExpense,
			TotalSavings: summary.TotalSavings,
			CategoryData: summary.CategoryData,
			CreatedAt:    summary.CreatedAt,
		}
	}

	return responses, nil
}

// GenerateHistoricalSummary generates and stores historical summary data
func (s *FinanceService) GenerateHistoricalSummary(userID uuid.UUID, req *request.HistoricalDataRequest) (*response.HistoricalSummaryResponse, error) {
	// Parse dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		return nil, errors.ErrInvalidInput
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		return nil, errors.ErrInvalidInput
	}

	// Validate period type
	if req.PeriodType != "weekly" && req.PeriodType != "monthly" && req.PeriodType != "yearly" {
		return nil, errors.ErrInvalidInput
	}

	// Get historical data for the period
	summary, err := s.financeRepo.GetHistoricalDataForPeriod(userID, req.PeriodType, startDate, endDate)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get historical data for period")
	}

	// Store the summary
	if err := s.financeRepo.CreateHistoricalSummary(summary); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to store historical summary")
	}

	// Convert to response
	return &response.HistoricalSummaryResponse{
		ID:           summary.ID,
		UserID:       summary.UserID,
		PeriodType:   summary.PeriodType,
		PeriodStart:  summary.PeriodStart,
		PeriodEnd:    summary.PeriodEnd,
		TotalIncome:  summary.TotalIncome,
		TotalExpense: summary.TotalExpense,
		TotalSavings: summary.TotalSavings,
		CategoryData: summary.CategoryData,
		CreatedAt:    summary.CreatedAt,
	}, nil
}

// GeneratePDFReport generates a PDF report for the specified period
func (s *FinanceService) GeneratePDFReport(userID uuid.UUID, req *request.PDFReportRequest) (string, error) {
	// Parse dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		return "", errors.ErrInvalidInput
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		return "", errors.ErrInvalidInput
	}

	// Validate period type
	if req.PeriodType != "weekly" && req.PeriodType != "monthly" && req.PeriodType != "yearly" {
		return "", errors.ErrInvalidInput
	}

	// Get historical data for the period
	summary, err := s.financeRepo.GetHistoricalDataForPeriod(userID, req.PeriodType, startDate, endDate)
	if err != nil {
		return "", errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get data for PDF report")
	}

	// Generate HTML content for the PDF
	htmlContent := s.generateHTMLReport(summary)

	return htmlContent, nil
}

// generateHTMLReport creates HTML content for the financial report
func (s *FinanceService) generateHTMLReport(summary *models.HistoricalSummary) string {
	// This is a simplified HTML generation - in production, you'd use a proper template engine
	html := `
<!DOCTYPE html>
<html>
<head>
    <title>Financial Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-item.total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; }
        .category-breakdown { margin-top: 20px; }
        .category-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .positive { color: green; }
        .negative { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Financial Report</h1>
        <p>Period: ` + summary.PeriodStart.Format("2006-01-02") + " to " + summary.PeriodEnd.Format("2006-01-02") + `</p>
        <p>Type: ` + summary.PeriodType + `</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-item">
            <span>Total Income:</span>
            <span class="positive">$` + fmt.Sprintf("%.2f", summary.TotalIncome) + `</span>
        </div>
        <div class="summary-item">
            <span>Total Expenses:</span>
            <span class="negative">$` + fmt.Sprintf("%.2f", summary.TotalExpense) + `</span>
        </div>
        <div class="summary-item total">
            <span>Net Savings:</span>
            <span class="` + func() string {
		if summary.TotalSavings >= 0 {
			return "positive"
		} else {
			return "negative"
		}
	}() + `">$` + fmt.Sprintf("%.2f", summary.TotalSavings) + `</span>
        </div>
    </div>
    
    <div class="category-breakdown">
        <h2>Expense Categories</h2>
        <p>Category breakdown data would be displayed here based on the CategoryData field.</p>
    </div>
</body>
</html>`

	return html
}

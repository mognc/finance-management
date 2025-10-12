package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"finance-management/internal/models"
	"finance-management/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// FinanceHandler handles finance-related endpoints
type FinanceHandler struct {
	repo repository.FinanceRepositoryInterface
}

func NewFinanceHandler(repo repository.FinanceRepositoryInterface) *FinanceHandler {
	return &FinanceHandler{repo: repo}
}

// CreateIncome handles POST /api/finance/incomes
func (h *FinanceHandler) CreateIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}
	income := &models.Income{
		ID:         uuid.New(),
		UserID:     userID,
		Source:     req.Source,
		Amount:     req.Amount,
		ReceivedAt: req.ReceivedAt,
		CreatedAt:  time.Now().UTC(),
	}
	if err := h.repo.CreateIncome(income); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create income"})
		return
	}
	c.JSON(http.StatusCreated, income)
}

// ListIncomes GET /api/finance/incomes
func (h *FinanceHandler) ListIncomes(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	items, err := h.repo.ListIncomes(userID, 100)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list incomes"})
		return
	}
	c.JSON(http.StatusOK, items)
}

// CreateExpense handles POST /api/finance/expenses
func (h *FinanceHandler) CreateExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}
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
	if err := h.repo.CreateExpense(expense); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create expense"})
		return
	}
	c.JSON(http.StatusCreated, expense)
}

// ListExpenses GET /api/finance/expenses
func (h *FinanceHandler) ListExpenses(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	items, err := h.repo.ListExpenses(userID, 100)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list expenses"})
		return
	}
	c.JSON(http.StatusOK, items)
}

// UpdateIncome PUT /api/finance/incomes/:id
func (h *FinanceHandler) UpdateIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req models.UpdateIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}
	updates := map[string]interface{}{}
	if req.Source != nil {
		updates["source"] = *req.Source
	}
	if req.Amount != nil {
		updates["amount"] = *req.Amount
	}
	if req.ReceivedAt != nil {
		updates["received_at"] = *req.ReceivedAt
	}
	if err := h.repo.UpdateIncome(id, userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// UpdateExpense PUT /api/finance/expenses/:id
func (h *FinanceHandler) UpdateExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req models.UpdateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}
	updates := map[string]interface{}{}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Amount != nil {
		updates["amount"] = *req.Amount
	}
	if req.SpentAt != nil {
		updates["spent_at"] = *req.SpentAt
	}
	if req.GoalID != nil {
		updates["goal_id"] = req.GoalID
	}
	if err := h.repo.UpdateExpense(id, userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteIncome DELETE /api/finance/incomes/:id
func (h *FinanceHandler) DeleteIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.repo.DeleteIncome(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteExpense DELETE /api/finance/expenses/:id
func (h *FinanceHandler) DeleteExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.repo.DeleteExpense(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// CreateGoal handles POST /api/finance/goals
func (h *FinanceHandler) CreateGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}
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
	if err := h.repo.CreateGoal(goal); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create goal"})
		return
	}
	c.JSON(http.StatusCreated, goal)
}

// CreateGoalContribution handles POST /api/finance/goals/contributions
func (h *FinanceHandler) CreateGoalContribution(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateGoalContributionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}
	contrib := &models.GoalContribution{
		ID:            uuid.New(),
		UserID:        userID,
		GoalID:        req.GoalID,
		Amount:        req.Amount,
		ContributedAt: req.ContributedAt,
		CreatedAt:     time.Now().UTC(),
	}
	if err := h.repo.CreateGoalContribution(contrib); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create goal contribution"})
		return
	}
	c.JSON(http.StatusCreated, contrib)
}

// GetMonthlySummary handles GET /api/finance/summary?year=YYYY&month=M
func (h *FinanceHandler) GetMonthlySummary(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	yearStr := c.Query("year")
	monthStr := c.Query("month")
	if yearStr == "" || monthStr == "" {
		now := time.Now().UTC()
		yearStr = strconv.Itoa(now.Year())
		monthStr = strconv.Itoa(int(now.Month()))
	}
	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid year"})
		return
	}
	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid month"})
		return
	}

	summary, err := h.repo.GetMonthlySummary(userID, year, month)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to compute summary"})
		return
	}
	c.JSON(http.StatusOK, summary)
}

// CreateCategory handles POST /api/finance/categories
func (h *FinanceHandler) CreateCategory(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	cat := &models.Category{ID: uuid.New(), UserID: userID, Name: req.Name, CreatedAt: time.Now().UTC()}
	if err := h.repo.CreateCategory(cat); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create category"})
		return
	}
	c.JSON(http.StatusCreated, cat)
}

// ListCategories handles GET /api/finance/categories
func (h *FinanceHandler) ListCategories(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	cats, err := h.repo.ListCategories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list categories"})
		return
	}
	c.JSON(http.StatusOK, cats)
}

// ListGoalsWithProgress handles GET /api/finance/goals
func (h *FinanceHandler) ListGoalsWithProgress(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	goals, err := h.repo.ListGoalsWithProgress(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list goals"})
		return
	}
	c.JSON(http.StatusOK, goals)
}

// UpdateGoal PUT /api/finance/goals/:id
func (h *FinanceHandler) UpdateGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req models.UpdateGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}
	updates := map[string]interface{}{}
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.TargetAmount != nil {
		updates["target_amount"] = *req.TargetAmount
	}
	if req.TargetDate != nil {
		updates["target_date"] = *req.TargetDate
	}
	if req.ParentGoalID != nil {
		updates["parent_goal_id"] = req.ParentGoalID
	}
	if req.IsMainGoal != nil {
		updates["is_main_goal"] = *req.IsMainGoal
	}
	if err := h.repo.UpdateGoal(id, userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteGoal DELETE /api/finance/goals/:id
func (h *FinanceHandler) DeleteGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.repo.DeleteGoal(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// GetHistoricalData handles GET /api/finance/historical
func (h *FinanceHandler) GetHistoricalData(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	periodType := c.Query("period_type")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if periodType == "" || startDateStr == "" || endDateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "period_type, start_date, and end_date are required"})
		return
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format (YYYY-MM-DD)"})
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format (YYYY-MM-DD)"})
		return
	}

	if periodType != "weekly" && periodType != "monthly" && periodType != "yearly" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "period_type must be weekly, monthly, or yearly"})
		return
	}

	summaries, err := h.repo.GetHistoricalSummaries(userID, periodType, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get historical data"})
		return
	}

	c.JSON(http.StatusOK, summaries)
}

// GenerateHistoricalSummary handles POST /api/finance/historical/generate
func (h *FinanceHandler) GenerateHistoricalSummary(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.HistoricalDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}

	// Parse date strings
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format (YYYY-MM-DD)"})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format (YYYY-MM-DD)"})
		return
	}

	summary, err := h.repo.GetHistoricalDataForPeriod(userID, req.PeriodType, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate historical summary"})
		return
	}

	// Store the summary
	if err := h.repo.CreateHistoricalSummary(summary); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to store historical summary"})
		return
	}

	c.JSON(http.StatusCreated, summary)
}

// GeneratePDFReport handles POST /api/finance/reports/pdf
func (h *FinanceHandler) GeneratePDFReport(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.PDFReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}

	// Parse date strings
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format (YYYY-MM-DD)"})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format (YYYY-MM-DD)"})
		return
	}

	// Get historical data for the period
	summary, err := h.repo.GetHistoricalDataForPeriod(userID, req.PeriodType, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get data for PDF report"})
		return
	}

	// Generate HTML content for the PDF
	htmlContent := h.generateHTMLReport(summary, req.Format)

	// For now, return the HTML content as a simple response
	// In a production environment, you would use a library like wkhtmltopdf
	// or a Go PDF library to convert HTML to PDF
	c.Header("Content-Type", "text/html")
	c.String(http.StatusOK, htmlContent)
}

// generateHTMLReport creates HTML content for the financial report
func (h *FinanceHandler) generateHTMLReport(summary *models.HistoricalSummary, format string) string {
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
        <h2>Expense Categories</h2>`

	// Parse category data if available
	if summary.CategoryData != "" {
		var categoryData map[string]float64
		if err := json.Unmarshal([]byte(summary.CategoryData), &categoryData); err == nil {
			for category, amount := range categoryData {
				html += `
        <div class="category-item">
            <span>` + category + `:</span>
            <span>$` + fmt.Sprintf("%.2f", amount) + `</span>
        </div>`
			}
		}
	}

	html += `
    </div>
</body>
</html>`

	return html
}

// ListGoalCategories handles GET /api/finance/goals/categories
func (h *FinanceHandler) ListGoalCategories(c *gin.Context) {
	categories, err := h.repo.ListGoalCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list goal categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// ListMainGoalsWithSubgoals handles GET /api/finance/goals/hierarchical
func (h *FinanceHandler) ListMainGoalsWithSubgoals(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	goals, err := h.repo.ListMainGoalsWithSubgoals(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list hierarchical goals"})
		return
	}
	c.JSON(http.StatusOK, goals)
}

// CreateGoalExpense handles POST /api/finance/goals/expenses
func (h *FinanceHandler) CreateGoalExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req models.CreateGoalExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request", "details": err.Error()})
		return
	}
	goalExpense := &models.GoalExpense{
		ID:          uuid.New(),
		UserID:      userID,
		GoalID:      req.GoalID,
		ExpenseID:   req.ExpenseID,
		Amount:      req.Amount,
		Description: req.Description,
		CreatedAt:   time.Now().UTC(),
	}
	if err := h.repo.CreateGoalExpense(goalExpense); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create goal expense"})
		return
	}
	c.JSON(http.StatusCreated, goalExpense)
}

// ListGoalExpenses handles GET /api/finance/goals/:id/expenses
func (h *FinanceHandler) ListGoalExpenses(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	goalID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid goal id"})
		return
	}
	expenses, err := h.repo.ListGoalExpenses(userID, goalID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list goal expenses"})
		return
	}
	c.JSON(http.StatusOK, expenses)
}

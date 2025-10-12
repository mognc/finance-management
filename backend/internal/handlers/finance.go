package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"finance-management/internal/dto/request"
	"finance-management/internal/errors"
	"finance-management/internal/models"
	"finance-management/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// FinanceHandler handles finance-related endpoints
type FinanceHandler struct {
	financeService *services.FinanceService
}

func NewFinanceHandler(financeService *services.FinanceService) *FinanceHandler {
	return &FinanceHandler{financeService: financeService}
}

// CreateIncome handles POST /api/finance/incomes
func (h *FinanceHandler) CreateIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	income, err := h.financeService.CreateIncome(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, income)
}

// ListIncomes GET /api/finance/incomes
func (h *FinanceHandler) ListIncomes(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	items, err := h.financeService.ListIncomes(userID, 100)
	if err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, items)
}

// CreateExpense handles POST /api/finance/expenses
func (h *FinanceHandler) CreateExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	expense, err := h.financeService.CreateExpense(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, expense)
}

// ListExpenses GET /api/finance/expenses
func (h *FinanceHandler) ListExpenses(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	items, err := h.financeService.ListExpenses(userID, 100)
	if err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, items)
}

// UpdateIncome PUT /api/finance/incomes/:id
func (h *FinanceHandler) UpdateIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	var req request.UpdateIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	if err := h.financeService.UpdateIncome(userID, id, &req); err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// UpdateExpense PUT /api/finance/expenses/:id
func (h *FinanceHandler) UpdateExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	var req request.UpdateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	if err := h.financeService.UpdateExpense(userID, id, &req); err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteIncome DELETE /api/finance/incomes/:id
func (h *FinanceHandler) DeleteIncome(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	if err := h.financeService.DeleteIncome(userID, id); err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteExpense DELETE /api/finance/expenses/:id
func (h *FinanceHandler) DeleteExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	if err := h.financeService.DeleteExpense(userID, id); err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// CreateGoal handles POST /api/finance/goals
func (h *FinanceHandler) CreateGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	goal, err := h.financeService.CreateGoal(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, goal)
}

// CreateGoalContribution handles POST /api/finance/goals/contributions
func (h *FinanceHandler) CreateGoalContribution(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateGoalContributionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	contribution, err := h.financeService.CreateGoalContribution(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, contribution)
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
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	summary, err := h.financeService.GetMonthlySummary(userID, year, month)
	if err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, summary)
}

// CreateCategory handles POST /api/finance/categories
func (h *FinanceHandler) CreateCategory(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	category, err := h.financeService.CreateCategory(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, category)
}

// ListCategories handles GET /api/finance/categories
func (h *FinanceHandler) ListCategories(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")

	categories, err := h.financeService.ListCategories(userID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, categories)
}

// ListGoalsWithProgress handles GET /api/finance/goals
func (h *FinanceHandler) ListGoalsWithProgress(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	goals, err := h.financeService.ListGoalsWithProgress(userID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, goals)
}

// UpdateGoal PUT /api/finance/goals/:id
func (h *FinanceHandler) UpdateGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	var req request.UpdateGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	if err := h.financeService.UpdateGoal(userID, id, &req); err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteGoal DELETE /api/finance/goals/:id
func (h *FinanceHandler) DeleteGoal(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}
	if err := h.financeService.DeleteGoal(userID, id); err != nil {
		errors.HandleError(c, err)
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
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	if periodType != "weekly" && periodType != "monthly" && periodType != "yearly" {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	historicalData, err := h.financeService.GetHistoricalData(userID, periodType, startDate, endDate)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, historicalData)
}

// GenerateHistoricalSummary handles POST /api/finance/historical/generate
func (h *FinanceHandler) GenerateHistoricalSummary(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.HistoricalDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	summary, err := h.financeService.GenerateHistoricalSummary(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, summary)
}

// GeneratePDFReport handles POST /api/finance/reports/pdf
func (h *FinanceHandler) GeneratePDFReport(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.PDFReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	htmlContent, err := h.financeService.GeneratePDFReport(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	// Return HTML content for PDF generation
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
	categories, err := h.financeService.ListGoalCategories()
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, categories)
}

// ListMainGoalsWithSubgoals handles GET /api/finance/goals/hierarchical
func (h *FinanceHandler) ListMainGoalsWithSubgoals(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")

	goals, err := h.financeService.ListMainGoalsWithSubgoals(userID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, goals)
}

// CreateGoalExpense handles POST /api/finance/goals/expenses
func (h *FinanceHandler) CreateGoalExpense(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	var req request.CreateGoalExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	goalExpense, err := h.financeService.CreateGoalExpense(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, goalExpense)
}

// ListGoalExpenses handles GET /api/finance/goals/:id/expenses
func (h *FinanceHandler) ListGoalExpenses(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
	goalID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	expenses, err := h.financeService.ListGoalExpenses(userID, goalID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, expenses)
}

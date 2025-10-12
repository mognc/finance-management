package handlers

import (
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
		TargetAmount: req.TargetAmount,
		TargetDate:   req.TargetDate,
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
	if req.TargetAmount != nil {
		updates["target_amount"] = *req.TargetAmount
	}
	if req.TargetDate != nil {
		updates["target_date"] = *req.TargetDate
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

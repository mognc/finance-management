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

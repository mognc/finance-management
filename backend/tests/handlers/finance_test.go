package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"finance-management/internal/handlers"
	"finance-management/internal/models"
	"finance-management/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type mockFinanceRepo struct {
	createIncomeFn      func(income *models.Income) error
	createExpenseFn     func(expense *models.Expense) error
	createGoalFn        func(goal *models.Goal) error
	createGoalContribFn func(contrib *models.GoalContribution) error
	getMonthlySummaryFn func(userID uuid.UUID, year int, month int) (*models.MonthlySummary, error)
}

func (m *mockFinanceRepo) CreateIncome(income *models.Income) error { return m.createIncomeFn(income) }
func (m *mockFinanceRepo) CreateExpense(expense *models.Expense) error {
	return m.createExpenseFn(expense)
}
func (m *mockFinanceRepo) CreateGoal(goal *models.Goal) error { return m.createGoalFn(goal) }
func (m *mockFinanceRepo) CreateGoalContribution(contrib *models.GoalContribution) error {
	return m.createGoalContribFn(contrib)
}
func (m *mockFinanceRepo) GetMonthlySummary(userID uuid.UUID, year int, month int) (*models.MonthlySummary, error) {
	return m.getMonthlySummaryFn(userID, year, month)
}

var _ repository.FinanceRepositoryInterface = (*mockFinanceRepo)(nil)

func setupFinanceRouter(t *testing.T, repo repository.FinanceRepositoryInterface) *gin.Engine {
	t.Helper()
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := handlers.NewFinanceHandler(repo)
	api := r.Group("/api")
	{
		api.GET("/finance/summary", h.GetMonthlySummary)
	}
	return r
}

func TestGetMonthlySummary_Success(t *testing.T) {
	repo := &mockFinanceRepo{
		getMonthlySummaryFn: func(userID uuid.UUID, year int, month int) (*models.MonthlySummary, error) {
			return &models.MonthlySummary{
				Year:              year,
				Month:             month,
				TotalIncome:       5000,
				TotalExpenses:     3200,
				TotalSavings:      500,
				CategoryBreakdown: map[string]float64{"rent": 1500, "food": 600},
				GoalSpending:      map[uuid.UUID]float64{},
				GoalContributions: map[uuid.UUID]float64{},
			}, nil
		},
	}
	r := setupFinanceRouter(t, repo)

	w := httptest.NewRecorder()
	now := time.Now().UTC()
	req, _ := http.NewRequest(http.MethodGet, "/api/finance/summary?year="+now.Format("2006")+"&month="+strconv.Itoa(int(now.Month())), nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var resp models.MonthlySummary
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}
	if resp.TotalIncome != 5000 {
		t.Fatalf("unexpected income: %v", resp.TotalIncome)
	}
}

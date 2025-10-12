package handlers

import (
	"finance-management/internal/config"
	"finance-management/internal/repository"
	"finance-management/internal/services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize database connection
	db := config.GetDB()

	// Initialize repositories
	notesRepo := repository.NewNotesRepository(db)
	financeRepo := repository.NewFinanceRepository(db)

	// Initialize services
	notesService := services.NewNotesService(notesRepo)
	financeService := services.NewFinanceService(financeRepo)

	// Initialize handlers
	healthHandler := NewHealthHandler()
	notesHandler := NewNotesHandler(notesService)
	financeHandler := NewFinanceHandler(financeService)

	// Health check routes
	api := r.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Health)
		api.GET("/health/db", healthHandler.DatabaseHealth)
	}

	// Notes routes
	api = r.Group("/api/v1")
	{
		// Notes CRUD operations
		api.GET("/notes", notesHandler.GetNotes)
		api.GET("/notes/:id", notesHandler.GetNote)
		api.POST("/notes", notesHandler.CreateNote)
		api.PUT("/notes/:id", notesHandler.UpdateNote)
		api.DELETE("/notes/:id", notesHandler.DeleteNote)

		// Finance MVP endpoints
		api.GET("/finance/incomes", financeHandler.ListIncomes)
		api.POST("/finance/incomes", financeHandler.CreateIncome)
		api.PUT("/finance/incomes/:id", financeHandler.UpdateIncome)
		api.DELETE("/finance/incomes/:id", financeHandler.DeleteIncome)
		api.GET("/finance/expenses", financeHandler.ListExpenses)
		api.POST("/finance/expenses", financeHandler.CreateExpense)
		api.PUT("/finance/expenses/:id", financeHandler.UpdateExpense)
		api.DELETE("/finance/expenses/:id", financeHandler.DeleteExpense)
		api.POST("/finance/goals", financeHandler.CreateGoal)
		api.PUT("/finance/goals/:id", financeHandler.UpdateGoal)
		api.DELETE("/finance/goals/:id", financeHandler.DeleteGoal)
		api.POST("/finance/goals/contributions", financeHandler.CreateGoalContribution)
		api.GET("/finance/summary", financeHandler.GetMonthlySummary)
		api.GET("/finance/categories", financeHandler.ListCategories)
		api.POST("/finance/categories", financeHandler.CreateCategory)
		api.GET("/finance/goals", financeHandler.ListGoalsWithProgress)

		// New goal categories and hierarchical goals endpoints
		api.GET("/finance/goals/categories", financeHandler.ListGoalCategories)
		api.GET("/finance/goals/hierarchical", financeHandler.ListMainGoalsWithSubgoals)
		api.POST("/finance/goals/expenses", financeHandler.CreateGoalExpense)
		api.GET("/finance/goals/:id/expenses", financeHandler.ListGoalExpenses)

		// Historical data and reporting endpoints
		api.GET("/finance/historical", financeHandler.GetHistoricalData)
		api.POST("/finance/historical/generate", financeHandler.GenerateHistoricalSummary)
		api.POST("/finance/reports/pdf", financeHandler.GeneratePDFReport)
	}

	// Root health check
	r.GET("/health", healthHandler.Health)
	r.GET("/health/db", healthHandler.DatabaseHealth)
}

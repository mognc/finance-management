package handlers

import (
	"finance-management/internal/config"
	"finance-management/internal/repository"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize database connection
	db := config.GetDB()

	// Initialize repositories
	notesRepo := repository.NewNotesRepository(db)

	// Initialize handlers
	healthHandler := NewHealthHandler()
	notesHandler := NewNotesHandler(notesRepo)

	// Health check routes
	api := r.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Health)
		api.GET("/health/db", healthHandler.DatabaseHealth)
	}

	// Notes routes
	api = r.Group("/api")
	{
		// Notes CRUD operations
		api.GET("/notes", notesHandler.GetNotes)
		api.GET("/notes/:id", notesHandler.GetNote)
		api.POST("/notes", notesHandler.CreateNote)
		api.PUT("/notes/:id", notesHandler.UpdateNote)
		api.DELETE("/notes/:id", notesHandler.DeleteNote)
	}

	// Root health check
	r.GET("/health", healthHandler.Health)
	r.GET("/health/db", healthHandler.DatabaseHealth)
}

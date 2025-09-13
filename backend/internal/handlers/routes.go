package handlers

import (
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize handlers
	healthHandler := NewHealthHandler()

	// Health check routes
	api := r.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Health)
		api.GET("/health/db", healthHandler.DatabaseHealth)
	}

	// Root health check
	r.GET("/health", healthHandler.Health)
	r.GET("/health/db", healthHandler.DatabaseHealth)
}

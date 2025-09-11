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
	}

	// Root health check
	r.GET("/health", healthHandler.Health)
}

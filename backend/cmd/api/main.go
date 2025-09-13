package main

import (
	"log"
	"os"

	"finance-management/internal/config"
	"finance-management/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin mode based on environment
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.DebugMode)
	}

	// Initialize database connection
	if err := config.InitDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer config.CloseDatabase()

	// Create Gin router
	r := gin.Default()

	// Setup routes
	handlers.SetupRoutes(r)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

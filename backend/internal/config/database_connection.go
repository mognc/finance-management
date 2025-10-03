package config

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the global database connection
var DB *gorm.DB

// InitDatabase initializes the database connection
func InitDatabase() error {
	config := GetDatabaseConfig()

	dsn := config.GetDSN()

	// Open GORM database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	DB = db

	log.Println("✅ Database connection established successfully")
	return nil
}

// CloseDatabase closes the database connection
func CloseDatabase() error { return nil }

// GetDB returns the database connection
func GetDB() *gorm.DB { return DB }

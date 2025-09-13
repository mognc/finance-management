package config

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// DB is the global database connection
var DB *sqlx.DB

// InitDatabase initializes the database connection
func InitDatabase() error {
	config := GetDatabaseConfig()

	dsn := config.GetDSN()

	// Open database connection
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	// Wrap with sqlx for better functionality
	DB = sqlx.NewDb(db, "postgres")

	log.Println("✅ Database connection established successfully")
	return nil
}

// CloseDatabase closes the database connection
func CloseDatabase() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

// GetDB returns the database connection
func GetDB() *sqlx.DB {
	return DB
}

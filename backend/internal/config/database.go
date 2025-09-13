package config

import (
	"fmt"
	"os"
	"strconv"
)

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	Name     string
	User     string
	Password string
	SSLMode  string
}

// GetDatabaseConfig returns database configuration from environment variables
func GetDatabaseConfig() *DatabaseConfig {
	port, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		port = 5432
	}

	return &DatabaseConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     port,
		Name:     getEnv("DB_NAME", "finance_management"),
		User:     getEnv("DB_USER", "finance_user"),
		Password: getEnv("DB_PASSWORD", "finance_password"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}
}

// GetDSN returns the database connection string
func (db *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		db.Host, db.Port, db.User, db.Password, db.Name, db.SSLMode)
}

// getEnv gets an environment variable with a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"

	"finance-management/internal/config"

	_ "github.com/lib/pq"
)

func main() {
	// Get database configuration
	dbConfig := config.GetDatabaseConfig()

	// Create connection string
	dsn := dbConfig.GetDSN()

	// Connect to database
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Get migration directory
	migrationDir := "db/migrations"
	if len(os.Args) > 1 {
		migrationDir = os.Args[1]
	}

	// Run migrations
	if err := runMigrations(db, migrationDir); err != nil {
		log.Fatal("Migration failed:", err)
	}

	log.Println("✅ Migrations completed successfully")
}

func runMigrations(db *sql.DB, migrationDir string) error {
	// Read migration files
	files, err := filepath.Glob(filepath.Join(migrationDir, "*.sql"))
	if err != nil {
		return fmt.Errorf("failed to read migration files: %w", err)
	}

	// Use an application-owned migrations table to avoid conflicts with other tools
	createMigrationsTable := `
        CREATE TABLE IF NOT EXISTS app_schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
	if _, err := db.Exec(createMigrationsTable); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Sort files to ensure proper order
	sort.Strings(files)

	// Apply each migration
	for _, file := range files {
		version := filepath.Base(file)

		// Check if migration already applied
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM app_schema_migrations WHERE version = $1", version).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to check migration status: %w", err)
		}

		if count > 0 {
			log.Printf("⏭️  Skipping %s (already applied)", version)
			continue
		}

		// Read and execute migration
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}

		log.Printf("🔄 Applying migration: %s", version)
		if _, err := db.Exec(string(content)); err != nil {
			return fmt.Errorf("failed to apply migration %s: %w", version, err)
		}

		// Record migration as applied
		if _, err := db.Exec("INSERT INTO app_schema_migrations (version) VALUES ($1)", version); err != nil {
			return fmt.Errorf("failed to record migration %s: %w", version, err)
		}

		log.Printf("✅ Applied migration: %s", version)
	}

	return nil
}

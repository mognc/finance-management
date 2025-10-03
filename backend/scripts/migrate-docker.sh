#!/bin/bash

# Docker Migration Runner Script
# This script handles database migrations in Docker environment

set -e

echo "🐳 Starting Docker Migration Process..."

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    until docker-compose exec -T postgres pg_isready -U finance_user -d finance_management; do
        echo "Database is unavailable - sleeping"
        sleep 2
    done
    echo "✅ Database is ready!"
}

# Function to run migrations
run_migrations() {
    echo "🔄 Running database migrations..."
    
    # Try Docker migration first, fallback to local if it fails
    if docker-compose run --rm migrate; then
        echo "✅ Docker migrations completed!"
    else
        echo "⚠️  Docker migration failed, trying local migration..."
        if command -v go &> /dev/null; then
            go run ./cmd/migrate
            echo "✅ Local migrations completed!"
        else
            echo "❌ Both Docker and local migration failed"
            exit 1
        fi
    fi
}

# Function to check migration status
check_migrations() {
    echo "📊 Checking migration status..."
    docker-compose exec -T postgres psql -U finance_user -d finance_management -c "
        SELECT version, applied_at 
        FROM schema_migrations 
        ORDER BY applied_at DESC;
    "
}

# Main execution
case "${1:-migrate}" in
    "migrate")
        wait_for_db
        run_migrations
        ;;
    "status")
        wait_for_db
        check_migrations
        ;;
    "reset")
        echo "⚠️  Resetting database (this will delete all data!)"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker-compose up -d postgres
            wait_for_db
            run_migrations
        else
            echo "❌ Reset cancelled"
        fi
        ;;
    "help")
        echo "Usage: $0 [migrate|status|reset|help]"
        echo "  migrate - Run pending migrations (default)"
        echo "  status  - Show migration status"
        echo "  reset   - Reset database and run all migrations"
        echo "  help    - Show this help message"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

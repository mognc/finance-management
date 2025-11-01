# Docker Migration Guide

## 🐳 **Migration Strategies in Docker**

### **Option 1: Migration Service (Recommended)**

This approach uses a dedicated migration service that runs once and exits.

#### **Setup:**
```bash
# 1. Start database
docker-compose up -d postgres

# 2. Run migrations
make docker-migrate

# 3. Start application
docker-compose up -d backend
```

#### **Workflow:**
```bash
# Check migration status
make docker-migrate-status

# Run new migrations
make docker-migrate

# Reset database (development only!)
make docker-migrate-reset
```

### **Option 2: Init Container Pattern**

For production environments, use init containers:

```yaml
# docker-compose.prod.yml
services:
  migrate:
    image: your-app:migration
    environment:
      - DB_HOST=postgres
    depends_on:
      - postgres
    restart: "no"

  backend:
    image: your-app:latest
    depends_on:
      - migrate
```

### **Option 3: Application-Integrated Migrations**

Run migrations as part of application startup:

```go
// In main.go
func main() {
    // Run migrations on startup
    if err := runMigrations(); err != nil {
        log.Fatal("Migration failed:", err)
    }
    
    // Start application
    startServer()
}
```

## 🚀 **Development Workflow**

### **Daily Development:**
```bash
# Start everything with migrations
docker-compose up

# Or step by step:
docker-compose up -d postgres
make docker-migrate
docker-compose up backend
```

### **Adding New Migrations:**
```bash
# 1. Create new migration file
touch db/migrations/003_add_user_preferences.sql

# 2. Add your SQL
echo "-- Add user preferences table" > db/migrations/003_add_user_preferences.sql

# 3. Run migration
make docker-migrate
```

### **Checking Migration Status:**
```bash
# See which migrations have been applied
make docker-migrate-status

# Check in database directly
docker-compose exec postgres psql -U finance_user -d finance_management -c "
    SELECT version, applied_at FROM schema_migrations ORDER BY applied_at;
"
```

## 🔧 **Production Deployment**

### **CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
- name: Run Migrations
  run: |
    docker-compose -f docker-compose.migrate.yml run --rm migrate
```

### **Kubernetes:**
```yaml
# k8s-migration-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: your-app:migration
        env:
        - name: DB_HOST
          value: "postgres-service"
      restartPolicy: Never
```

## 📊 **Migration Best Practices**

### **1. Always Test Migrations:**
```bash
# Test on local database first
make docker-migrate-reset
make docker-migrate
```

### **2. Backup Before Production:**
```bash
# Create backup before migration
docker-compose exec postgres pg_dump -U finance_user finance_management > backup.sql

# Run migration
make docker-migrate

# Verify everything works
make docker-migrate-status
```

### **3. Rollback Strategy:**
```sql
-- Create rollback migration
-- db/migrations/004_rollback_user_preferences.sql
DROP TABLE IF EXISTS user_preferences;
```

### **4. Zero-Downtime Migrations:**
```sql
-- Add column with default value
ALTER TABLE notes ADD COLUMN new_field VARCHAR(100) DEFAULT 'default_value';

-- Update existing rows
UPDATE notes SET new_field = 'calculated_value' WHERE new_field = 'default_value';

-- Make column NOT NULL (after all rows updated)
ALTER TABLE notes ALTER COLUMN new_field SET NOT NULL;
```

## 🚨 **Troubleshooting**

### **Migration Fails:**
```bash
# Check logs
docker-compose logs migrate

# Check database state
make docker-migrate-status

# Manual rollback
docker-compose exec postgres psql -U finance_user -d finance_management -c "
    DELETE FROM schema_migrations WHERE version = 'failed_migration.sql';
"
```

### **Database Connection Issues:**
```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U finance_user -d finance_management

# Check network connectivity
docker-compose exec migrate ping postgres
```

### **Permission Issues:**
```bash
# Make sure script is executable
chmod +x scripts/migrate-docker.sh

# Check file permissions
ls -la scripts/migrate-docker.sh
```

## 📝 **Migration File Naming Convention**

```
db/migrations/
├── 001_create_notes_table.sql
├── 002_add_user_preferences.sql
├── 003_add_indexes.sql
└── 004_rollback_user_preferences.sql
```

**Format:** `{number}_{description}.sql`

## 🔍 **Monitoring Migrations**

### **Check Applied Migrations:**
```sql
SELECT 
    version,
    applied_at,
    EXTRACT(EPOCH FROM (NOW() - applied_at)) as seconds_ago
FROM schema_migrations 
ORDER BY applied_at DESC;
```

### **Find Failed Migrations:**
```sql
-- Check for incomplete migrations
SELECT * FROM schema_migrations 
WHERE applied_at IS NULL;
```

This setup gives you professional-grade migration management in Docker! 🎯

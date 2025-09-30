# Finance Management Backend Makefile

.PHONY: help build run test clean docker-build docker-up docker-down

# Default target
help:
	@echo "Available commands:"
	@echo "  build          - Build the application"
	@echo "  run            - Run the application locally"
	@echo "  test           - Run all tests with coverage across packages"
	@echo "  coverage       - Generate coverage.out and coverage.html"
	@echo "  clean          - Clean build artifacts"
	@echo "  docker-build   - Build Docker image"
	@echo "  docker-up      - Start Docker containers"
	@echo "  docker-down    - Stop Docker containers"
	@echo "  docker-logs    - Show Docker container logs"

# Build the application
build:
	go build -o bin/api ./cmd/api
	go build -o bin/migrate ./cmd/migrate

# Run the application locally
run:
	go run ./cmd/api

# Run tests
test:
	go test -coverpkg=./... ./... -cover

coverage:
	go test -coverpkg=./... ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html

# Clean build artifacts
clean:
	rm -rf bin/
	rm -rf tmp/

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Development commands
dev-up:
	docker-compose up -d postgres
	sleep 5
	make migrate-up
	go run ./cmd/api

dev-down:
	docker-compose down

# Production commands
prod-build:
	docker build --target production -t finance-management-backend .

prod-run:
	docker run -p 8080:8080 --env-file .env finance-management-backend


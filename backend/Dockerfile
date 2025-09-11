# Build stage
FROM golang:1.25-alpine AS builder

# Set working directory
WORKDIR /app

# Install air for hot reload
RUN go install github.com/air-verse/air@v1.62

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -mod=mod -o main ./cmd/api

# Development stage
FROM golang:1.25-alpine AS development

# Set working directory
WORKDIR /app

# Install air for hot reload
RUN go install github.com/air-verse/air@v1.62.0

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Use air for hot reload
CMD ["air", "--build.cmd", "go build -mod=mod -o ./tmp/main ./cmd/api", "--build.bin", "./tmp/main"]

# Production stage
FROM alpine:latest AS production

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]

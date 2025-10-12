package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// GenerateRandomString generates a random string of specified length
func GenerateRandomString(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random string: %w", err)
	}
	return hex.EncodeToString(bytes), nil
}

// HashString creates a SHA256 hash of the input string
func HashString(input string) string {
	hash := sha256.Sum256([]byte(input))
	return hex.EncodeToString(hash[:])
}

// HashPassword creates a hash of a password (basic implementation)
// In production, use bcrypt or similar
func HashPassword(password string) (string, error) {
	// This is a basic implementation. In production, use bcrypt:
	// return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	hashed := HashString(password)
	return hashed, nil
}

// VerifyPassword verifies a password against its hash (basic implementation)
// In production, use bcrypt or similar
func VerifyPassword(password, hash string) bool {
	// This is a basic implementation. In production, use bcrypt:
	// return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
	hashed := HashString(password)
	return hashed == hash
}

// GenerateAPIKey generates a secure API key
func GenerateAPIKey() (string, error) {
	return GenerateRandomString(32)
}

// GenerateToken generates a secure token
func GenerateToken() (string, error) {
	return GenerateRandomString(64)
}

package validation

import (
	"finance-management/internal/errors"
	"regexp"
	"strings"
)

// ValidateEmail validates email format
func ValidateEmail(email string) error {
	if len(email) == 0 {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			"Email is required",
			"Email cannot be empty",
		)
	}

	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	if !emailRegex.MatchString(strings.ToLower(email)) {
		return errors.NewWithDetails(
			errors.ErrInvalidFormat.Code,
			"Invalid email format",
			"Email must be in valid format (e.g., user@example.com)",
		)
	}

	return nil
}

// ValidatePassword validates password strength
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Password too short",
			"Password must be at least 8 characters long",
		)
	}

	if len(password) > 128 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Password too long",
			"Password must be 128 characters or less",
		)
	}

	// Check for at least one uppercase letter
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	// Check for at least one lowercase letter
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	// Check for at least one digit
	hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)
	// Check for at least one special character
	hasSpecial := regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`).MatchString(password)

	if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Password does not meet requirements",
			"Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
		)
	}

	return nil
}

// ValidateUsername validates username format
func ValidateUsername(username string) error {
	if len(username) == 0 {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			"Username is required",
			"Username cannot be empty",
		)
	}

	if len(username) < 3 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Username too short",
			"Username must be at least 3 characters long",
		)
	}

	if len(username) > 50 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Username too long",
			"Username must be 50 characters or less",
		)
	}

	// Username should only contain alphanumeric characters and underscores
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !usernameRegex.MatchString(username) {
		return errors.NewWithDetails(
			errors.ErrInvalidFormat.Code,
			"Invalid username format",
			"Username can only contain letters, numbers, and underscores",
		)
	}

	return nil
}

// ValidateNonEmptyString validates that a string is not empty
func ValidateNonEmptyString(value, fieldName string) error {
	if strings.TrimSpace(value) == "" {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			fieldName+" is required",
			fieldName+" cannot be empty",
		)
	}
	return nil
}

// ValidateStringLength validates string length
func ValidateStringLength(value, fieldName string, min, max int) error {
	length := len(strings.TrimSpace(value))

	if length < min {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			fieldName+" too short",
			fieldName+" must be at least %d characters long",
		)
	}

	if length > max {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			fieldName+" too long",
			fieldName+" must be %d characters or less",
		)
	}

	return nil
}

// ValidatePositiveNumber validates that a number is positive
func ValidatePositiveNumber(value float64, fieldName string) error {
	if value <= 0 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Invalid "+fieldName,
			fieldName+" must be greater than 0",
		)
	}
	return nil
}

// ValidateNonNegativeNumber validates that a number is non-negative
func ValidateNonNegativeNumber(value float64, fieldName string) error {
	if value < 0 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Invalid "+fieldName,
			fieldName+" must be 0 or greater",
		)
	}
	return nil
}

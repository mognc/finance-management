package validation

import (
	"time"

	"finance-management/internal/errors"

	"github.com/google/uuid"
)

// ValidateAmount validates that an amount is positive
func ValidateAmount(amount float64) error {
	if amount <= 0 {
		return errors.ErrInvalidAmount
	}
	return nil
}

// ValidateDateRange validates that start date is before end date
func ValidateDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.ErrInvalidDateRange
	}
	return nil
}

// ValidateGoalTarget validates goal target amount
func ValidateGoalTarget(targetAmount float64) error {
	if targetAmount <= 0 {
		return errors.WrapWithDetails(errors.ErrInvalidAmount.Err, errors.ErrInvalidAmount.Code, "Goal target amount must be positive", "Goal target amount must be greater than 0")
	}
	return nil
}

// ValidateGoalDate validates goal target date is in the future
func ValidateGoalDate(targetDate time.Time) error {
	if targetDate.Before(time.Now()) {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Goal target date must be in the future",
			"Target date cannot be in the past",
		)
	}
	return nil
}

// ValidateUUID validates that a string is a valid UUID
func ValidateUUID(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.WrapWithDetails(
			err,
			errors.ErrInvalidInput.Code,
			"Invalid ID format",
			"ID must be a valid UUID",
		)
	}
	return nil
}

// ValidatePeriodType validates period type for historical data
func ValidatePeriodType(periodType string) error {
	validTypes := map[string]bool{
		"weekly":  true,
		"monthly": true,
		"yearly":  true,
	}

	if !validTypes[periodType] {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Invalid period type",
			"Period type must be one of: weekly, monthly, yearly",
		)
	}
	return nil
}

// ValidateCategoryName validates category name
func ValidateCategoryName(name string) error {
	if len(name) == 0 {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			"Category name is required",
			"Category name cannot be empty",
		)
	}

	if len(name) > 100 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Category name too long",
			"Category name must be 100 characters or less",
		)
	}

	return nil
}

// ValidateGoalName validates goal name
func ValidateGoalName(name string) error {
	if len(name) == 0 {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			"Goal name is required",
			"Goal name cannot be empty",
		)
	}

	if len(name) > 200 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Goal name too long",
			"Goal name must be 200 characters or less",
		)
	}

	return nil
}

// ValidateGoalDescription validates goal description
func ValidateGoalDescription(description string) error {
	if len(description) > 1000 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Goal description too long",
			"Goal description must be 1000 characters or less",
		)
	}

	return nil
}

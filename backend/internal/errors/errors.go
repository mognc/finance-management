package errors

import (
	"fmt"
	"net/http"
)

// AppError represents a custom application error
type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
	Err     error  `json:"-"`
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// Unwrap returns the underlying error
func (e *AppError) Unwrap() error {
	return e.Err
}

// New creates a new AppError
func New(code int, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
	}
}

// NewWithDetails creates a new AppError with details
func NewWithDetails(code int, message, details string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Details: details,
	}
}

// Wrap wraps an existing error with additional context
func Wrap(err error, code int, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// WrapWithDetails wraps an existing error with additional context and details
func WrapWithDetails(err error, code int, message, details string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Details: details,
		Err:     err,
	}
}

// Predefined error types
var (
	// Validation errors (400)
	ErrInvalidInput     = New(http.StatusBadRequest, "Invalid input provided")
	ErrMissingField     = New(http.StatusBadRequest, "Required field is missing")
	ErrInvalidFormat    = New(http.StatusBadRequest, "Invalid format provided")
	ErrValidationFailed = New(http.StatusBadRequest, "Validation failed")

	// Authentication errors (401)
	ErrUnauthorized = New(http.StatusUnauthorized, "Unauthorized access")
	ErrInvalidToken = New(http.StatusUnauthorized, "Invalid or expired token")

	// Authorization errors (403)
	ErrForbidden = New(http.StatusForbidden, "Access forbidden")

	// Not found errors (404)
	ErrNotFound        = New(http.StatusNotFound, "Resource not found")
	ErrUserNotFound    = New(http.StatusNotFound, "User not found")
	ErrNoteNotFound    = New(http.StatusNotFound, "Note not found")
	ErrGoalNotFound    = New(http.StatusNotFound, "Goal not found")
	ErrIncomeNotFound  = New(http.StatusNotFound, "Income not found")
	ErrExpenseNotFound = New(http.StatusNotFound, "Expense not found")

	// Conflict errors (409)
	ErrAlreadyExists  = New(http.StatusConflict, "Resource already exists")
	ErrDuplicateEntry = New(http.StatusConflict, "Duplicate entry")

	// Server errors (500)
	ErrInternalServer  = New(http.StatusInternalServerError, "Internal server error")
	ErrDatabaseError   = New(http.StatusInternalServerError, "Database operation failed")
	ErrExternalService = New(http.StatusInternalServerError, "External service error")

	// Business logic errors
	ErrInsufficientFunds = New(http.StatusBadRequest, "Insufficient funds")
	ErrInvalidAmount     = New(http.StatusBadRequest, "Invalid amount")
	ErrGoalTargetReached = New(http.StatusBadRequest, "Goal target already reached")
	ErrInvalidDateRange  = New(http.StatusBadRequest, "Invalid date range")
)

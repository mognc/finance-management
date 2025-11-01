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
	ErrInvalidInput = New(http.StatusBadRequest, "Invalid input provided")
	ErrMissingField = New(http.StatusBadRequest, "Required field is missing")

	// Not found errors (404)
	ErrNoteNotFound = New(http.StatusNotFound, "Note not found")

	// Server errors (500)
	ErrDatabaseError = New(http.StatusInternalServerError, "Database operation failed")

	// Business logic errors
	ErrInvalidAmount = New(http.StatusBadRequest, "Invalid amount")
)

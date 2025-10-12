package errors

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorResponse represents the structure of error responses
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
	Details string `json:"details,omitempty"`
	Code    int    `json:"code"`
}

// HandleError handles application errors and returns appropriate HTTP responses
func HandleError(c *gin.Context, err error) {
	if appErr, ok := err.(*AppError); ok {
		response := ErrorResponse{
			Error:   http.StatusText(appErr.Code),
			Message: appErr.Message,
			Details: appErr.Details,
			Code:    appErr.Code,
		}
		c.JSON(appErr.Code, response)
		return
	}

	// Handle unknown errors
	response := ErrorResponse{
		Error:   http.StatusText(http.StatusInternalServerError),
		Message: "An unexpected error occurred",
		Code:    http.StatusInternalServerError,
	}
	c.JSON(http.StatusInternalServerError, response)
}

// HandleValidationError handles validation errors
func HandleValidationError(c *gin.Context, err error) {
	HandleError(c, WrapWithDetails(err, http.StatusBadRequest, "Validation failed", err.Error()))
}

// HandleNotFoundError handles not found errors
func HandleNotFoundError(c *gin.Context, resource string) {
	HandleError(c, NewWithDetails(http.StatusNotFound, "Resource not found", resource))
}

// HandleUnauthorizedError handles unauthorized access errors
func HandleUnauthorizedError(c *gin.Context) {
	HandleError(c, ErrUnauthorized)
}

// HandleForbiddenError handles forbidden access errors
func HandleForbiddenError(c *gin.Context) {
	HandleError(c, ErrForbidden)
}

// HandleInternalServerError handles internal server errors
func HandleInternalServerError(c *gin.Context, err error) {
	HandleError(c, Wrap(err, http.StatusInternalServerError, "Internal server error"))
}

// HandleDatabaseError handles database errors
func HandleDatabaseError(c *gin.Context, err error) {
	HandleError(c, Wrap(err, http.StatusInternalServerError, "Database operation failed"))
}

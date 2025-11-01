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

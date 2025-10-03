package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"finance-management/internal/handlers"

	"github.com/gin-gonic/gin"
)

func TestHealthHandler_Health(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	h := handlers.NewHealthHandler()
	r.GET("/health", h.Health)
	r.GET("/api/v1/health", h.Health)

	// Root health
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/health", nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	// Versioned health
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w2.Code)
	}
}

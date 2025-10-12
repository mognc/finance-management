package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"finance-management/internal/dto/request"
	"finance-management/internal/handlers"
	"finance-management/internal/models"
	"finance-management/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type mockNotesRepo struct {
	createFn  func(note *models.Note) error
	getByIDFn func(id, userID uuid.UUID) (*models.Note, error)
	listFn    func(userID uuid.UUID) ([]models.Note, error)
	updateFn  func(id, userID uuid.UUID, updates map[string]interface{}) error
	deleteFn  func(id, userID uuid.UUID) error
}

func (m *mockNotesRepo) CreateNote(note *models.Note) error { return m.createFn(note) }
func (m *mockNotesRepo) GetNoteByID(id, userID uuid.UUID) (*models.Note, error) {
	return m.getByIDFn(id, userID)
}
func (m *mockNotesRepo) GetNotesByUserID(userID uuid.UUID) ([]models.Note, error) {
	return m.listFn(userID)
}
func (m *mockNotesRepo) UpdateNote(id, userID uuid.UUID, updates map[string]interface{}) error {
	return m.updateFn(id, userID, updates)
}
func (m *mockNotesRepo) DeleteNote(id, userID uuid.UUID) error { return m.deleteFn(id, userID) }

var _ repository.NotesRepositoryInterface = (*mockNotesRepo)(nil)

func setupNotesRouter(t *testing.T, repo repository.NotesRepositoryInterface) *gin.Engine {
	t.Helper()
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := handlers.NewNotesHandler(repo)
	api := r.Group("/api")
	{
		api.GET("/notes", h.GetNotes)
		api.GET("/notes/:id", h.GetNote)
		api.POST("/notes", h.CreateNote)
		api.PUT("/notes/:id", h.UpdateNote)
		api.DELETE("/notes/:id", h.DeleteNote)
	}
	return r
}

func sampleNote() models.Note {
	return models.Note{
		ID:         uuid.New(),
		UserID:     uuid.MustParse("00000000-0000-0000-0000-000000000000"),
		Title:      "Title",
		Content:    "Content",
		Category:   "general",
		Tags:       []string{"a", "b"},
		IsFavorite: false,
		IsArchived: false,
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}
}

func TestGetNotes_Success(t *testing.T) {
	n := sampleNote()
	repo := &mockNotesRepo{
		listFn: func(userID uuid.UUID) ([]models.Note, error) {
			return []models.Note{n}, nil
		},
	}
	r := setupNotesRouter(t, repo)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/notes", nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestGetNote_Success(t *testing.T) {
	n := sampleNote()
	repo := &mockNotesRepo{
		getByIDFn: func(id, userID uuid.UUID) (*models.Note, error) { return &n, nil },
	}
	r := setupNotesRouter(t, repo)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/notes/"+n.ID.String(), nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestCreateNote_Success(t *testing.T) {
	n := sampleNote()
	repo := &mockNotesRepo{
		createFn: func(note *models.Note) error { return nil },
	}
	r := setupNotesRouter(t, repo)

	body := request.CreateNoteRequest{Title: n.Title, Content: n.Content, Category: n.Category, Tags: n.Tags, IsFavorite: n.IsFavorite}
	b, _ := json.Marshal(body)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/notes", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", w.Code)
	}
}

func TestUpdateNote_Success(t *testing.T) {
	n := sampleNote()
	title := "Updated"
	updated := n
	updated.Title = title
	repo := &mockNotesRepo{
		updateFn:  func(id, userID uuid.UUID, updates map[string]interface{}) error { return nil },
		getByIDFn: func(id, userID uuid.UUID) (*models.Note, error) { return &updated, nil },
	}
	r := setupNotesRouter(t, repo)

	body := request.UpdateNoteRequest{Title: &title}
	b, _ := json.Marshal(body)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPut, "/api/notes/"+n.ID.String(), bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestDeleteNote_Success(t *testing.T) {
	n := sampleNote()
	repo := &mockNotesRepo{
		deleteFn: func(id, userID uuid.UUID) error { return nil },
	}
	r := setupNotesRouter(t, repo)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodDelete, "/api/notes/"+n.ID.String(), nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

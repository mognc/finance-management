package response

import (
	"time"

	"github.com/google/uuid"
)

// NoteResponse represents the response for note operations
type NoteResponse struct {
	ID         uuid.UUID `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Category   string    `json:"category"`
	Tags       []string  `json:"tags"`
	IsFavorite bool      `json:"is_favorite"`
	IsArchived bool      `json:"is_archived"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// NotesListResponse represents the response for listing notes
type NotesListResponse struct {
	Notes []NoteResponse `json:"notes"`
	Total int            `json:"total"`
	Page  int            `json:"page"`
	Limit int            `json:"limit"`
}

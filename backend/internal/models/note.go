package models

import (
	"time"

	"github.com/google/uuid"
)

// Note represents a note/document in the system
type Note struct {
	ID         uuid.UUID `json:"id" db:"id"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	Title      string    `json:"title" db:"title"`
	Content    string    `json:"content" db:"content"`
	Category   string    `json:"category" db:"category"`
	Tags       []string  `json:"tags" db:"tags"`
	IsFavorite bool      `json:"is_favorite" db:"is_favorite"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}

// CreateNoteRequest represents the request to create a new note
type CreateNoteRequest struct {
	Title      string   `json:"title" binding:"required"`
	Content    string   `json:"content"`
	Category   string   `json:"category"`
	Tags       []string `json:"tags"`
	IsFavorite bool     `json:"is_favorite"`
}

// UpdateNoteRequest represents the request to update a note
type UpdateNoteRequest struct {
	Title      *string   `json:"title"`
	Content    *string   `json:"content"`
	Category   *string   `json:"category"`
	Tags       *[]string `json:"tags"`
	IsFavorite *bool     `json:"is_favorite"`
}

// NoteResponse represents the response for note operations
type NoteResponse struct {
	ID         uuid.UUID `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Category   string    `json:"category"`
	Tags       []string  `json:"tags"`
	IsFavorite bool      `json:"is_favorite"`
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

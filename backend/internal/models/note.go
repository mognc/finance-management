package models

import (
	"time"

	"github.com/google/uuid"
)

// Note represents a note/document in the system
type Note struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;index"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Category   string    `json:"category"`
	Tags       []string  `json:"tags" gorm:"type:text[]"`
	IsFavorite bool      `json:"is_favorite"`
	IsArchived bool      `json:"is_archived"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
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
	IsArchived *bool     `json:"is_archived"`
}

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

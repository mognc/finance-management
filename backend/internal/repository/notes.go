package repository

import (
	"database/sql"
	"fmt"

	"finance-management/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// NotesRepositoryInterface defines behavior required by handlers for notes operations
type NotesRepositoryInterface interface {
	CreateNote(note *models.Note) error
	GetNoteByID(id, userID uuid.UUID) (*models.Note, error)
	GetNotesByUserID(userID uuid.UUID) ([]models.Note, error)
	UpdateNote(id, userID uuid.UUID, updates map[string]interface{}) error
	DeleteNote(id, userID uuid.UUID) error
}

// NotesRepository handles database operations for notes
type NotesRepository struct {
	db *gorm.DB
}

// NewNotesRepository creates a new notes repository
func NewNotesRepository(db *gorm.DB) *NotesRepository {
	return &NotesRepository{db: db}
}

// CreateNote creates a new note in the database
func (r *NotesRepository) CreateNote(note *models.Note) error {
	return r.db.Create(note).Error
}

// GetNoteByID retrieves a note by its ID and user ID
func (r *NotesRepository) GetNoteByID(id, userID uuid.UUID) (*models.Note, error) {
	var note models.Note
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&note).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound || err == sql.ErrNoRows {
			return nil, fmt.Errorf("note not found")
		}
		return nil, err
	}

	return &note, nil
}

// GetNotesByUserID retrieves all notes for a specific user with pagination
func (r *NotesRepository) GetNotesByUserID(userID uuid.UUID) ([]models.Note, error) {
	var notes []models.Note
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&notes).Error
	if err != nil {
		return nil, err
	}
	return notes, nil
}

// UpdateNote updates an existing note
func (r *NotesRepository) UpdateNote(id, userID uuid.UUID, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return fmt.Errorf("no updates provided")
	}
	tx := r.db.Model(&models.Note{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return fmt.Errorf("note not found or no changes made")
	}
	return nil
}

// DeleteNote deletes a note by ID and user ID
func (r *NotesRepository) DeleteNote(id, userID uuid.UUID) error {
	tx := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Note{})
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return fmt.Errorf("note not found")
	}
	return nil
}

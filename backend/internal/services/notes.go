package services

import (
	"time"

	"finance-management/internal/dto/request"
	"finance-management/internal/dto/response"
	"finance-management/internal/errors"
	"finance-management/internal/models"
	"finance-management/internal/repository"
	"finance-management/internal/validation"

	"github.com/google/uuid"
)

// NotesService handles business logic for notes operations
type NotesService struct {
	notesRepo repository.NotesRepositoryInterface
}

// NewNotesService creates a new notes service
func NewNotesService(notesRepo repository.NotesRepositoryInterface) *NotesService {
	return &NotesService{
		notesRepo: notesRepo,
	}
}

// CreateNote creates a new note
func (s *NotesService) CreateNote(userID uuid.UUID, req *request.CreateNoteRequest) (*response.NoteResponse, error) {
	// Validate note data
	if err := validation.ValidateNoteTitle(req.Title); err != nil {
		return nil, err
	}
	if err := validation.ValidateNoteContent(req.Content); err != nil {
		return nil, err
	}
	if err := validation.ValidateTags(req.Tags); err != nil {
		return nil, err
	}

	// Create note model
	note := &models.Note{
		ID:         uuid.New(),
		UserID:     userID,
		Title:      req.Title,
		Content:    req.Content,
		Category:   req.Category,
		Tags:       req.Tags,
		IsFavorite: req.IsFavorite,
		IsArchived: false, // New notes are not archived by default
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}

	// Save to database
	if err := s.notesRepo.CreateNote(note); err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to create note")
	}

	// Convert to response
	return &response.NoteResponse{
		ID:         note.ID,
		Title:      note.Title,
		Content:    note.Content,
		Category:   note.Category,
		Tags:       note.Tags,
		IsFavorite: note.IsFavorite,
		IsArchived: note.IsArchived,
		CreatedAt:  note.CreatedAt,
		UpdatedAt:  note.UpdatedAt,
	}, nil
}

// GetNote retrieves a specific note by ID
func (s *NotesService) GetNote(userID, noteID uuid.UUID) (*response.NoteResponse, error) {
	note, err := s.notesRepo.GetNoteByID(noteID, userID)
	if err != nil {
		if err.Error() == "note not found" {
			return nil, errors.ErrNoteNotFound
		}
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get note")
	}

	// Convert to response
	return &response.NoteResponse{
		ID:         note.ID,
		Title:      note.Title,
		Content:    note.Content,
		Category:   note.Category,
		Tags:       note.Tags,
		IsFavorite: note.IsFavorite,
		IsArchived: note.IsArchived,
		CreatedAt:  note.CreatedAt,
		UpdatedAt:  note.UpdatedAt,
	}, nil
}

// ListNotes retrieves all notes for a user
func (s *NotesService) ListNotes(userID uuid.UUID) ([]response.NoteResponse, error) {
	notes, err := s.notesRepo.GetNotesByUserID(userID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to list notes")
	}

	// Convert to response
	responses := make([]response.NoteResponse, len(notes))
	for i, note := range notes {
		responses[i] = response.NoteResponse{
			ID:         note.ID,
			Title:      note.Title,
			Content:    note.Content,
			Category:   note.Category,
			Tags:       note.Tags,
			IsFavorite: note.IsFavorite,
			IsArchived: note.IsArchived,
			CreatedAt:  note.CreatedAt,
			UpdatedAt:  note.UpdatedAt,
		}
	}

	return responses, nil
}

// UpdateNote updates an existing note
func (s *NotesService) UpdateNote(userID, noteID uuid.UUID, req *request.UpdateNoteRequest) (*response.NoteResponse, error) {
	updates := make(map[string]interface{})

	if req.Title != nil {
		if err := validation.ValidateNoteTitle(*req.Title); err != nil {
			return nil, err
		}
		updates["title"] = *req.Title
	}
	if req.Content != nil {
		if err := validation.ValidateNoteContent(*req.Content); err != nil {
			return nil, err
		}
		updates["content"] = *req.Content
	}
	if req.Category != nil {
		if err := validation.ValidateNoteCategory(*req.Category); err != nil {
			return nil, err
		}
		updates["category"] = *req.Category
	}
	if req.Tags != nil {
		if err := validation.ValidateTags(*req.Tags); err != nil {
			return nil, err
		}
		updates["tags"] = *req.Tags
	}
	if req.IsFavorite != nil {
		updates["is_favorite"] = *req.IsFavorite
	}
	if req.IsArchived != nil {
		updates["is_archived"] = *req.IsArchived
	}

	if len(updates) == 0 {
		return nil, errors.ErrInvalidInput
	}

	// Update the note
	if err := s.notesRepo.UpdateNote(noteID, userID, updates); err != nil {
		if err.Error() == "note not found or no changes made" {
			return nil, errors.ErrNoteNotFound
		}
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to update note")
	}

	// Retrieve the updated note
	note, err := s.notesRepo.GetNoteByID(noteID, userID)
	if err != nil {
		return nil, errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to get updated note")
	}

	// Convert to response
	return &response.NoteResponse{
		ID:         note.ID,
		Title:      note.Title,
		Content:    note.Content,
		Category:   note.Category,
		Tags:       note.Tags,
		IsFavorite: note.IsFavorite,
		IsArchived: note.IsArchived,
		CreatedAt:  note.CreatedAt,
		UpdatedAt:  note.UpdatedAt,
	}, nil
}

// DeleteNote deletes a note
func (s *NotesService) DeleteNote(userID, noteID uuid.UUID) error {
	if err := s.notesRepo.DeleteNote(noteID, userID); err != nil {
		if err.Error() == "note not found" {
			return errors.ErrNoteNotFound
		}
		return errors.Wrap(err, errors.ErrDatabaseError.Code, "Failed to delete note")
	}
	return nil
}

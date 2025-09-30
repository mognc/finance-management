package handlers

import (
	"net/http"

	"finance-management/internal/models"
	"finance-management/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// NotesHandler handles note-related HTTP requests
type NotesHandler struct {
	notesRepo repository.NotesRepositoryInterface
}

// NewNotesHandler creates a new notes handler
func NewNotesHandler(notesRepo repository.NotesRepositoryInterface) *NotesHandler {
	return &NotesHandler{
		notesRepo: notesRepo,
	}
}

// GetNotes retrieves all notes for the authenticated user
func (h *NotesHandler) GetNotes(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	notes, err := h.notesRepo.GetNotesByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve notes",
		})
		return
	}

	// Convert to response format
	noteResponses := make([]models.NoteResponse, len(notes))
	for i, note := range notes {
		noteResponses[i] = models.NoteResponse{
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

	c.JSON(http.StatusOK, noteResponses)
}

// GetNote retrieves a specific note by ID
func (h *NotesHandler) GetNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid note ID format",
		})
		return
	}

	note, err := h.notesRepo.GetNoteByID(noteID, userID)
	if err != nil {
		if err.Error() == "note not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Note not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve note",
		})
		return
	}

	response := models.NoteResponse{
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

	c.JSON(http.StatusOK, response)
}

// CreateNote creates a new note
func (h *NotesHandler) CreateNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	var req models.CreateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request body",
			"details": err.Error(),
		})
		return
	}

	// Create new note
	note := &models.Note{
		ID:         uuid.New(),
		UserID:     userID,
		Title:      req.Title,
		Content:    req.Content,
		Category:   req.Category,
		Tags:       req.Tags,
		IsFavorite: req.IsFavorite,
		IsArchived: false, // New notes are not archived by default
	}

	if err := h.notesRepo.CreateNote(note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create note",
		})
		return
	}

	response := models.NoteResponse{
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

	c.JSON(http.StatusCreated, response)
}

// UpdateNote updates an existing note
func (h *NotesHandler) UpdateNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid note ID format",
		})
		return
	}

	var req models.UpdateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request body",
			"details": err.Error(),
		})
		return
	}

	// Build updates map
	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Content != nil {
		updates["content"] = *req.Content
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.Tags != nil {
		updates["tags"] = *req.Tags
	}
	if req.IsFavorite != nil {
		updates["is_favorite"] = *req.IsFavorite
	}
	if req.IsArchived != nil {
		updates["is_archived"] = *req.IsArchived
	}

	if err := h.notesRepo.UpdateNote(noteID, userID, updates); err != nil {
		if err.Error() == "note not found or no changes made" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Note not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update note",
		})
		return
	}

	// Retrieve updated note
	note, err := h.notesRepo.GetNoteByID(noteID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve updated note",
		})
		return
	}

	response := models.NoteResponse{
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

	c.JSON(http.StatusOK, response)
}

// DeleteNote deletes a note
func (h *NotesHandler) DeleteNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid note ID format",
		})
		return
	}

	if err := h.notesRepo.DeleteNote(noteID, userID); err != nil {
		if err.Error() == "note not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Note not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete note",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note deleted successfully",
	})
}

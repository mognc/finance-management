package handlers

import (
	"net/http"

	"finance-management/internal/dto/request"
	"finance-management/internal/errors"
	"finance-management/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// NotesHandler handles note-related HTTP requests
type NotesHandler struct {
	notesService *services.NotesService
}

// NewNotesHandler creates a new notes handler
func NewNotesHandler(notesService *services.NotesService) *NotesHandler {
	return &NotesHandler{
		notesService: notesService,
	}
}

// GetNotes retrieves all notes for the authenticated user
func (h *NotesHandler) GetNotes(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	notes, err := h.notesService.ListNotes(userID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, notes)
}

// GetNote retrieves a specific note by ID
func (h *NotesHandler) GetNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	note, err := h.notesService.GetNote(userID, noteID)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, note)
}

// CreateNote creates a new note
func (h *NotesHandler) CreateNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	var req request.CreateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	note, err := h.notesService.CreateNote(userID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote updates an existing note
func (h *NotesHandler) UpdateNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	var req request.UpdateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.HandleValidationError(c, err)
		return
	}

	note, err := h.notesService.UpdateNote(userID, noteID, &req)
	if err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, note)
}

// DeleteNote deletes a note
func (h *NotesHandler) DeleteNote(c *gin.Context) {
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Default system user

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		errors.HandleError(c, errors.ErrInvalidInput)
		return
	}

	if err := h.notesService.DeleteNote(userID, noteID); err != nil {
		errors.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note deleted successfully",
	})
}

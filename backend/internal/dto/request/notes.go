package request

// CreateNoteRequest represents the request to create a new note
type CreateNoteRequest struct {
	Title      string   `json:"title" binding:"required,min=1,max=255"`
	Content    string   `json:"content" binding:"max=10000"`
	Category   string   `json:"category" binding:"max=100"`
	Tags       []string `json:"tags" binding:"max=20,dive,max=50"`
	IsFavorite bool     `json:"is_favorite"`
}

// UpdateNoteRequest represents the request to update a note
type UpdateNoteRequest struct {
	Title      *string   `json:"title" binding:"omitempty,min=1,max=255"`
	Content    *string   `json:"content" binding:"omitempty,max=10000"`
	Category   *string   `json:"category" binding:"omitempty,max=100"`
	Tags       *[]string `json:"tags" binding:"omitempty,max=20,dive,max=50"`
	IsFavorite *bool     `json:"is_favorite"`
	IsArchived *bool     `json:"is_archived"`
}

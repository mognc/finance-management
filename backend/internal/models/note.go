package models

import (
	"time"

	"github.com/google/uuid"
)

// Note represents a note/document in the system
type Note struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;column:id"`
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;index;column:user_id"`
	Title      string    `json:"title" gorm:"column:title"`
	Content    string    `json:"content" gorm:"column:content"`
	Category   string    `json:"category" gorm:"column:category"`
	Tags       []string  `json:"tags" gorm:"type:text[];column:tags"`
	IsFavorite bool      `json:"is_favorite" gorm:"column:is_favorite"`
	IsArchived bool      `json:"is_archived" gorm:"column:is_archived"`
	CreatedAt  time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"column:updated_at"`
}

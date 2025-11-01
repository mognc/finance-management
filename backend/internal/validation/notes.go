package validation

import (
	"finance-management/internal/errors"
)

// ValidateNoteTitle validates note title
func ValidateNoteTitle(title string) error {
	if len(title) == 0 {
		return errors.NewWithDetails(
			errors.ErrMissingField.Code,
			"Note title is required",
			"Note title cannot be empty",
		)
	}

	if len(title) > 255 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Note title too long",
			"Note title must be 255 characters or less",
		)
	}

	return nil
}

// ValidateNoteContent validates note content
func ValidateNoteContent(content string) error {
	if len(content) > 10000 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Note content too long",
			"Note content must be 10000 characters or less",
		)
	}

	return nil
}

// ValidateNoteCategory validates note category
func ValidateNoteCategory(category string) error {
	if len(category) > 100 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Note category too long",
			"Note category must be 100 characters or less",
		)
	}

	return nil
}

// ValidateTags validates note tags
func ValidateTags(tags []string) error {
	if len(tags) > 20 {
		return errors.NewWithDetails(
			errors.ErrInvalidInput.Code,
			"Too many tags",
			"Maximum 20 tags allowed",
		)
	}

	for _, tag := range tags {
		if len(tag) == 0 {
			return errors.NewWithDetails(
				errors.ErrInvalidInput.Code,
				"Empty tag not allowed",
				"Tag cannot be empty",
			)
		}

		if len(tag) > 50 {
			return errors.NewWithDetails(
				errors.ErrInvalidInput.Code,
				"Tag too long",
				"Tag must be 50 characters or less",
			)
		}
	}

	return nil
}

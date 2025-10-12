package utils

import (
	"regexp"
	"strings"
	"unicode"
)

// IsEmpty checks if a string is empty or contains only whitespace
func IsEmpty(s string) bool {
	return strings.TrimSpace(s) == ""
}

// IsNotEmpty checks if a string is not empty and contains non-whitespace characters
func IsNotEmpty(s string) bool {
	return !IsEmpty(s)
}

// Truncate truncates a string to the specified length
func Truncate(s string, maxLength int) string {
	if len(s) <= maxLength {
		return s
	}
	return s[:maxLength]
}

// TruncateWithEllipsis truncates a string and adds ellipsis if truncated
func TruncateWithEllipsis(s string, maxLength int) string {
	if len(s) <= maxLength {
		return s
	}
	if maxLength <= 3 {
		return s[:maxLength]
	}
	return s[:maxLength-3] + "..."
}

// Capitalize capitalizes the first letter of a string
func Capitalize(s string) string {
	if len(s) == 0 {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}

// ToTitleCase converts a string to title case
func ToTitleCase(s string) string {
	words := strings.Fields(s)
	for i, word := range words {
		words[i] = Capitalize(strings.ToLower(word))
	}
	return strings.Join(words, " ")
}

// RemoveSpecialCharacters removes all non-alphanumeric characters from a string
func RemoveSpecialCharacters(s string) string {
	reg := regexp.MustCompile(`[^a-zA-Z0-9\s]`)
	return reg.ReplaceAllString(s, "")
}

// RemoveWhitespace removes all whitespace characters from a string
func RemoveWhitespace(s string) string {
	reg := regexp.MustCompile(`\s+`)
	return reg.ReplaceAllString(s, "")
}

// NormalizeWhitespace normalizes whitespace by replacing multiple spaces with single space
func NormalizeWhitespace(s string) string {
	reg := regexp.MustCompile(`\s+`)
	return strings.TrimSpace(reg.ReplaceAllString(s, " "))
}

// ContainsOnlyLetters checks if a string contains only letters
func ContainsOnlyLetters(s string) bool {
	reg := regexp.MustCompile(`^[a-zA-Z]+$`)
	return reg.MatchString(s)
}

// ContainsOnlyNumbers checks if a string contains only numbers
func ContainsOnlyNumbers(s string) bool {
	reg := regexp.MustCompile(`^[0-9]+$`)
	return reg.MatchString(s)
}

// ContainsOnlyAlphanumeric checks if a string contains only alphanumeric characters
func ContainsOnlyAlphanumeric(s string) bool {
	reg := regexp.MustCompile(`^[a-zA-Z0-9]+$`)
	return reg.MatchString(s)
}

// IsValidEmail checks if a string is a valid email address
func IsValidEmail(email string) bool {
	reg := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	return reg.MatchString(strings.ToLower(email))
}

// IsValidURL checks if a string is a valid URL
func IsValidURL(url string) bool {
	reg := regexp.MustCompile(`^https?://[a-z0-9.-]+\.[a-z]{2,}(/.*)?$`)
	return reg.MatchString(strings.ToLower(url))
}

// GenerateSlug generates a URL-friendly slug from a string
func GenerateSlug(s string) string {
	// Convert to lowercase
	slug := strings.ToLower(s)

	// Remove special characters except spaces and hyphens
	reg := regexp.MustCompile(`[^a-z0-9\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	// Replace spaces with hyphens
	reg = regexp.MustCompile(`\s+`)
	slug = reg.ReplaceAllString(slug, "-")

	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")

	// Remove leading and trailing hyphens
	slug = strings.Trim(slug, "-")

	return slug
}

// MaskEmail masks an email address for privacy (e.g., j***@example.com)
func MaskEmail(email string) string {
	if !IsValidEmail(email) {
		return email
	}

	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return email
	}

	username := parts[0]
	domain := parts[1]

	if len(username) <= 2 {
		return strings.Repeat("*", len(username)) + "@" + domain
	}

	maskedUsername := string(username[0]) + strings.Repeat("*", len(username)-2) + string(username[len(username)-1])
	return maskedUsername + "@" + domain
}

// MaskPhoneNumber masks a phone number for privacy
func MaskPhoneNumber(phone string) string {
	// Remove all non-digit characters
	digits := RemoveWhitespace(RemoveSpecialCharacters(phone))

	if len(digits) < 4 {
		return strings.Repeat("*", len(digits))
	}

	// Show first 2 and last 2 digits, mask the rest
	visibleStart := digits[:2]
	visibleEnd := digits[len(digits)-2:]
	maskedMiddle := strings.Repeat("*", len(digits)-4)

	return visibleStart + maskedMiddle + visibleEnd
}

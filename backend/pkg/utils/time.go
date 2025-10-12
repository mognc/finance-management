package utils

import (
	"time"
)

// GetCurrentTime returns the current UTC time
func GetCurrentTime() time.Time {
	return time.Now().UTC()
}

// GetCurrentDate returns the current date (without time)
func GetCurrentDate() time.Time {
	now := time.Now().UTC()
	return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
}

// GetStartOfMonth returns the start of the current month
func GetStartOfMonth(year int, month time.Month) time.Time {
	return time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
}

// GetEndOfMonth returns the end of the current month
func GetEndOfMonth(year int, month time.Month) time.Time {
	// Get the first day of the next month, then subtract one day
	nextMonth := time.Date(year, month+1, 1, 0, 0, 0, 0, time.UTC)
	return nextMonth.AddDate(0, 0, -1)
}

// GetStartOfWeek returns the start of the week (Monday)
func GetStartOfWeek(date time.Time) time.Time {
	// Get the weekday (0 = Sunday, 1 = Monday, etc.)
	weekday := int(date.Weekday())
	if weekday == 0 {
		weekday = 7 // Convert Sunday to 7
	}

	// Calculate days to subtract to get to Monday
	daysToSubtract := weekday - 1

	// Return the start of the week
	return date.AddDate(0, 0, -daysToSubtract).Truncate(24 * time.Hour)
}

// GetEndOfWeek returns the end of the week (Sunday)
func GetEndOfWeek(date time.Time) time.Time {
	startOfWeek := GetStartOfWeek(date)
	return startOfWeek.AddDate(0, 0, 6).Add(23*time.Hour + 59*time.Minute + 59*time.Second)
}

// GetStartOfYear returns the start of the year
func GetStartOfYear(year int) time.Time {
	return time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
}

// GetEndOfYear returns the end of the year
func GetEndOfYear(year int) time.Time {
	return time.Date(year, 12, 31, 23, 59, 59, 999999999, time.UTC)
}

// IsDateInRange checks if a date is within the specified range
func IsDateInRange(date, start, end time.Time) bool {
	return !date.Before(start) && !date.After(end)
}

// GetDaysBetween returns the number of days between two dates
func GetDaysBetween(start, end time.Time) int {
	// Truncate to remove time component
	startDate := time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC)
	endDate := time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0, time.UTC)

	duration := endDate.Sub(startDate)
	return int(duration.Hours() / 24)
}

// GetMonthsBetween returns the number of months between two dates
func GetMonthsBetween(start, end time.Time) int {
	years := end.Year() - start.Year()
	months := int(end.Month()) - int(start.Month())

	return years*12 + months
}

// FormatDate formats a date as YYYY-MM-DD
func FormatDate(date time.Time) string {
	return date.Format("2006-01-02")
}

// FormatDateTime formats a date and time as YYYY-MM-DD HH:MM:SS
func FormatDateTime(date time.Time) string {
	return date.Format("2006-01-02 15:04:05")
}

// ParseDate parses a date string in YYYY-MM-DD format
func ParseDate(dateStr string) (time.Time, error) {
	return time.Parse("2006-01-02", dateStr)
}

// ParseDateTime parses a date and time string in YYYY-MM-DD HH:MM:SS format
func ParseDateTime(dateTimeStr string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", dateTimeStr)
}

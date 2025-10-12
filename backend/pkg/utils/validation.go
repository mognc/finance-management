package utils

import (
	"regexp"
	"strconv"
	"strings"
)

// IsValidUUID checks if a string is a valid UUID
func IsValidUUID(uuid string) bool {
	reg := regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)
	return reg.MatchString(strings.ToLower(uuid))
}

// IsValidInteger checks if a string is a valid integer
func IsValidInteger(s string) bool {
	_, err := strconv.Atoi(s)
	return err == nil
}

// IsValidFloat checks if a string is a valid float
func IsValidFloat(s string) bool {
	_, err := strconv.ParseFloat(s, 64)
	return err == nil
}

// IsValidBoolean checks if a string is a valid boolean
func IsValidBoolean(s string) bool {
	lower := strings.ToLower(s)
	return lower == "true" || lower == "false" || lower == "1" || lower == "0"
}

// IsValidDate checks if a string is a valid date in YYYY-MM-DD format
func IsValidDate(dateStr string) bool {
	reg := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)
	if !reg.MatchString(dateStr) {
		return false
	}

	// Try to parse the date
	parts := strings.Split(dateStr, "-")
	if len(parts) != 3 {
		return false
	}

	year, err1 := strconv.Atoi(parts[0])
	month, err2 := strconv.Atoi(parts[1])
	day, err3 := strconv.Atoi(parts[2])

	if err1 != nil || err2 != nil || err3 != nil {
		return false
	}

	// Basic validation
	if year < 1900 || year > 2100 {
		return false
	}
	if month < 1 || month > 12 {
		return false
	}
	if day < 1 || day > 31 {
		return false
	}

	return true
}

// IsValidDateTime checks if a string is a valid date and time in YYYY-MM-DD HH:MM:SS format
func IsValidDateTime(dateTimeStr string) bool {
	reg := regexp.MustCompile(`^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$`)
	return reg.MatchString(dateTimeStr)
}

// IsValidCreditCard checks if a string is a valid credit card number (basic Luhn algorithm)
func IsValidCreditCard(cardNumber string) bool {
	// Remove spaces and dashes
	cleaned := RemoveWhitespace(strings.ReplaceAll(cardNumber, "-", ""))

	// Check if it's all digits and has reasonable length
	if !ContainsOnlyNumbers(cleaned) || len(cleaned) < 13 || len(cleaned) > 19 {
		return false
	}

	// Luhn algorithm
	sum := 0
	alternate := false

	for i := len(cleaned) - 1; i >= 0; i-- {
		digit := int(cleaned[i] - '0')

		if alternate {
			digit *= 2
			if digit > 9 {
				digit = (digit % 10) + 1
			}
		}

		sum += digit
		alternate = !alternate
	}

	return sum%10 == 0
}

// IsValidSSN checks if a string is a valid US Social Security Number
func IsValidSSN(ssn string) bool {
	// Remove spaces and dashes
	cleaned := RemoveWhitespace(strings.ReplaceAll(ssn, "-", ""))

	// Check if it's 9 digits
	if !ContainsOnlyNumbers(cleaned) || len(cleaned) != 9 {
		return false
	}

	// Check for invalid patterns
	invalidPatterns := []string{
		"000000000", "111111111", "222222222", "333333333",
		"444444444", "555555555", "666666666", "777777777",
		"888888888", "999999999", "123456789", "987654321",
	}

	for _, pattern := range invalidPatterns {
		if cleaned == pattern {
			return false
		}
	}

	// Check for area numbers that are invalid
	area := cleaned[:3]
	if area == "000" || area == "666" || (area >= "900" && area <= "999") {
		return false
	}

	return true
}

// IsValidPhoneNumber checks if a string is a valid phone number
func IsValidPhoneNumber(phone string) bool {
	// Remove all non-digit characters
	digits := RemoveWhitespace(RemoveSpecialCharacters(phone))

	// Check if it's all digits and has reasonable length
	if !ContainsOnlyNumbers(digits) || len(digits) < 10 || len(digits) > 15 {
		return false
	}

	return true
}

// IsValidPostalCode checks if a string is a valid US postal code
func IsValidPostalCode(postalCode string) bool {
	// Remove spaces
	cleaned := RemoveWhitespace(strings.ToUpper(postalCode))

	// Check for 5-digit format
	if reg := regexp.MustCompile(`^\d{5}$`); reg.MatchString(cleaned) {
		return true
	}

	// Check for 9-digit format (ZIP+4)
	if reg := regexp.MustCompile(`^\d{5}-\d{4}$`); reg.MatchString(cleaned) {
		return true
	}

	return false
}

// IsValidCurrency checks if a string is a valid currency amount
func IsValidCurrency(amount string) bool {
	// Remove currency symbols and spaces
	cleaned := RemoveWhitespace(strings.ReplaceAll(amount, "$", ""))
	cleaned = strings.ReplaceAll(cleaned, ",", "")

	// Check if it's a valid float
	if !IsValidFloat(cleaned) {
		return false
	}

	// Parse and check if it's positive
	if val, err := strconv.ParseFloat(cleaned, 64); err == nil {
		return val >= 0
	}

	return false
}

// IsValidPercentage checks if a string is a valid percentage
func IsValidPercentage(percentage string) bool {
	// Remove % symbol and spaces
	cleaned := RemoveWhitespace(strings.ReplaceAll(percentage, "%", ""))

	// Check if it's a valid float
	if !IsValidFloat(cleaned) {
		return false
	}

	// Parse and check if it's between 0 and 100
	if val, err := strconv.ParseFloat(cleaned, 64); err == nil {
		return val >= 0 && val <= 100
	}

	return false
}

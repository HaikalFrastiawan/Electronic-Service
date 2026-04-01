package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// PreloadBooking loads Customer and Technician relations into the booking struct.
func PreloadBooking(booking *models.Booking) {
	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
}

// CreateBooking saves a new booking record.
func CreateBooking(input *models.Booking) error {
	var customer models.Customer
	if err := config.DB.First(&customer, input.CustomerID).Error; err != nil {
		return errors.New("customer not found")
	}

	return config.DB.Create(input).Error
}

// GetAllBookings retrieves all bookings with relations.
func GetAllBookings() ([]models.Booking, error) {
	var bookings []models.Booking
	err := config.DB.Preload("Customer").Preload("Technician").Find(&bookings).Error
	return bookings, err
}

// GetBookingByID retrieves a single booking by ID.
func GetBookingByID(id string) (*models.Booking, error) {
	var booking models.Booking
	err := config.DB.Preload("Customer").Preload("Technician").First(&booking, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("booking not found")
		}
		return nil, err
	}
	return &booking, nil
}

// UpdateBooking updates an existing booking record.
func UpdateBooking(id string, input *models.Booking) (*models.Booking, error) {
	booking, err := GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	if err := config.DB.Model(booking).Updates(input).Error; err != nil {
		return nil, err
	}

	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
	return booking, nil
}

// UpdateBookingStatus updates the status and potentially the technician of a specific booking.
func UpdateBookingStatus(id string, status string, technicianID *uint) (*models.Booking, error) {
	validStatuses := map[string]bool{
		"Pending":          true,
		"Waiting Parts":    true,
		"In Repair":        true,
		"Ready for Pickup": true,
		"Completed":        true,
		"Cancelled":        true,
	}
	if !validStatuses[status] {
		return nil, errors.New("invalid status. Use: Pending, Waiting Parts, In Repair, Ready for Pickup, Completed, or Cancelled")
	}

	booking, err := GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	updates := map[string]interface{}{
		"status": status,
	}
	if technicianID != nil {
		updates["technician_id"] = *technicianID
	}

	if err := config.DB.Model(booking).Updates(updates).Error; err != nil {
		return nil, err
	}

	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
	return booking, nil
}

// DeleteBooking removes a booking record by ID.
func DeleteBooking(id string) error {
	booking, err := GetBookingByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(booking).Error
}

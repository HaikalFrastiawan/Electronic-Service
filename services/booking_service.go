package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// PreloadBooking memuat relasi Customer dan Technician ke struct booking
func PreloadBooking(booking *models.Booking) {
	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
}

// CreateBooking menyimpan data booking baru
func CreateBooking(input *models.Booking) error {
	// Pastikan customer ada
	var customer models.Customer
	if err := config.DB.First(&customer, input.CustomerID).Error; err != nil {
		return errors.New("customer tidak ditemukan")
	}

	return config.DB.Create(input).Error
}

// GetAllBookings mengambil semua booking beserta relasi Customer & Technician
func GetAllBookings() ([]models.Booking, error) {
	var bookings []models.Booking
	err := config.DB.Preload("Customer").Preload("Technician").Find(&bookings).Error
	return bookings, err
}

// GetBookingByID mengambil satu booking berdasarkan ID
func GetBookingByID(id string) (*models.Booking, error) {
	var booking models.Booking
	err := config.DB.Preload("Customer").Preload("Technician").First(&booking, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("booking tidak ditemukan")
		}
		return nil, err
	}
	return &booking, nil
}

// UpdateBooking memperbarui data booking berdasarkan ID
func UpdateBooking(id string, input *models.Booking) (*models.Booking, error) {
	booking, err := GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	if err := config.DB.Model(booking).Updates(input).Error; err != nil {
		return nil, err
	}

	// Reload dengan relasi
	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
	return booking, nil
}

// UpdateBookingStatus mengubah hanya status booking
func UpdateBookingStatus(id string, status string) (*models.Booking, error) {
	validStatuses := map[string]bool{
		"pending":     true,
		"in_progress": true,
		"done":        true,
		"cancelled":   true,
	}
	if !validStatuses[status] {
		return nil, errors.New("status tidak valid. Gunakan: pending, in_progress, done, cancelled")
	}

	booking, err := GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	if err := config.DB.Model(booking).Update("status", status).Error; err != nil {
		return nil, err
	}

	config.DB.Preload("Customer").Preload("Technician").First(booking, booking.ID)
	return booking, nil
}

// DeleteBooking menghapus booking berdasarkan ID
func DeleteBooking(id string) error {
	booking, err := GetBookingByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(booking).Error
}

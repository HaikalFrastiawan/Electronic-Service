package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// CreateTechnician saves a new technician record.
func CreateTechnician(input *models.Technician) error {
	return config.DB.Create(input).Error
}

// GetAllTechnicians retrieves all technician records.
func GetAllTechnicians() ([]models.Technician, error) {
	var technicians []models.Technician
	err := config.DB.Find(&technicians).Error
	return technicians, err
}

// GetTechnicianByID retrieves a single technician by ID.
func GetTechnicianByID(id string) (*models.Technician, error) {
	var technician models.Technician
	err := config.DB.First(&technician, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("technician not found")
		}
		return nil, err
	}
	return &technician, nil
}

// UpdateTechnician updates an existing technician record.
func UpdateTechnician(id string, input *models.Technician) (*models.Technician, error) {
	technician, err := GetTechnicianByID(id)
	if err != nil {
		return nil, err
	}
	if err := config.DB.Model(technician).Updates(input).Error; err != nil {
		return nil, err
	}
	return technician, nil
}

// DeleteTechnician removes a technician record by ID.
func DeleteTechnician(id string) error {
	technician, err := GetTechnicianByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(technician).Error
}

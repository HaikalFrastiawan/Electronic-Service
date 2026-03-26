package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// CreateTechnician menyimpan teknisi baru
func CreateTechnician(input *models.Technician) error {
	return config.DB.Create(input).Error
}

// GetAllTechnicians mengambil semua teknisi
func GetAllTechnicians() ([]models.Technician, error) {
	var technicians []models.Technician
	err := config.DB.Find(&technicians).Error
	return technicians, err
}

// GetTechnicianByID mengambil satu teknisi berdasarkan ID
func GetTechnicianByID(id string) (*models.Technician, error) {
	var technician models.Technician
	err := config.DB.First(&technician, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("teknisi tidak ditemukan")
		}
		return nil, err
	}
	return &technician, nil
}

// UpdateTechnician memperbarui data teknisi
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

// DeleteTechnician menghapus teknisi berdasarkan ID
func DeleteTechnician(id string) error {
	technician, err := GetTechnicianByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(technician).Error
}

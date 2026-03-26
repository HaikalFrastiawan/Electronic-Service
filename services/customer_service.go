package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// CreateCustomer menyimpan customer baru
func CreateCustomer(input *models.Customer) error {
	return config.DB.Create(input).Error
}

// GetAllCustomers mengambil semua customer
func GetAllCustomers() ([]models.Customer, error) {
	var customers []models.Customer
	err := config.DB.Find(&customers).Error
	return customers, err
}

// GetCustomerByID mengambil satu customer berdasarkan ID
func GetCustomerByID(id string) (*models.Customer, error) {
	var customer models.Customer
	err := config.DB.First(&customer, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("customer tidak ditemukan")
		}
		return nil, err
	}
	return &customer, nil
}

// UpdateCustomer memperbarui data customer
func UpdateCustomer(id string, input *models.Customer) (*models.Customer, error) {
	customer, err := GetCustomerByID(id)
	if err != nil {
		return nil, err
	}
	if err := config.DB.Model(customer).Updates(input).Error; err != nil {
		return nil, err
	}
	return customer, nil
}

// DeleteCustomer menghapus customer berdasarkan ID
func DeleteCustomer(id string) error {
	customer, err := GetCustomerByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(customer).Error
}

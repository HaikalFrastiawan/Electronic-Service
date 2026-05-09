package services

import (
	"booking-service/config"
	"booking-service/models"
	"errors"

	"gorm.io/gorm"
)

// CreateCustomer saves a new customer record.
func CreateCustomer(input *models.Customer) error {
	return config.DB.Create(input).Error
}

// GetAllCustomers retrieves all customer records.
func GetAllCustomers() ([]models.Customer, error) {
	var customers []models.Customer
	err := config.DB.Find(&customers).Error
	return customers, err
}

// GetCustomerByID retrieves a single customer by ID.
func GetCustomerByID(id string) (*models.Customer, error) {
	var customer models.Customer
	err := config.DB.First(&customer, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("customer not found")
		}
		return nil, err
	}
	return &customer, nil
}

// UpdateCustomer updates an existing customer record.
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

// DeleteCustomer removes a customer record by ID.
func DeleteCustomer(id string) error {
	customer, err := GetCustomerByID(id)
	if err != nil {
		return err
	}
	return config.DB.Delete(customer).Error
}

// GetCustomerByEmail retrieves a customer by their email address.
func GetCustomerByEmail(email string) (*models.Customer, error) {
	var customer models.Customer
	err := config.DB.Where("email = ?", email).First(&customer).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Return nil, nil to indicate not found, but not an error
		}
		return nil, err
	}
	return &customer, nil
}

// FindOrCreateCustomer looks for a customer by email. If not found, it creates a new one.
func FindOrCreateCustomer(name, email, phone, address string) (*models.Customer, error) {
	customer, err := GetCustomerByEmail(email)
	if err != nil {
		return nil, err
	}
	if customer != nil {
		return customer, nil
	}

	newCustomer := models.Customer{
		Name:    name,
		Email:   email,
		Phone:   phone,
		Address: address,
	}
	if err := config.DB.Create(&newCustomer).Error; err != nil {
		return nil, err
	}
	return &newCustomer, nil
}

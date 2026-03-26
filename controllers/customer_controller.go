package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateCustomer adds a new customer.
func CreateCustomer(c *gin.Context) {
	var input models.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := services.CreateCustomer(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save customer: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Customer added successfully", "data": input})
}

// GetAllCustomers retrieves all customers.
func GetAllCustomers(c *gin.Context) {
	customers, err := services.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve customer data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customers})
}

// GetCustomerByID retrieves a single customer by ID.
func GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	customer, err := services.GetCustomerByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customer})
}

// UpdateCustomer updates customer data.
func UpdateCustomer(c *gin.Context) {
	id := c.Param("id")
	var input models.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	customer, err := services.UpdateCustomer(id, &input)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer updated successfully", "data": customer})
}

// DeleteCustomer deletes a customer by ID.
func DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteCustomer(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted successfully"})
}

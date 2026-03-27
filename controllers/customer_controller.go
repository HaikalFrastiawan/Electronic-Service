package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"booking-service/utils"
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
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to save customer")
		return
	}
	utils.JSONResponse(c, http.StatusCreated, "Customer added successfully", input)
}

// GetAllCustomers retrieves all customers.
func GetAllCustomers(c *gin.Context) {
	customers, err := services.GetAllCustomers()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve customer data")
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Customers retrieved", customers)
}

// GetCustomerByID retrieves a single customer by ID.
func GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	customer, err := services.GetCustomerByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Customer found", customer)
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
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Customer updated successfully", customer)
}

// DeleteCustomer deletes a customer by ID.
func DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteCustomer(id); err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Customer deleted successfully", nil)
}

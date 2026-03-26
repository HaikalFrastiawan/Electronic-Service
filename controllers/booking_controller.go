package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BookingInput struct {
	CustomerID       uint    `json:"customer_id" binding:"required"`
	TechnicianID     *uint   `json:"technician_id"`
	DeviceName       string  `json:"device_name" binding:"required"`
	DeviceType       string  `json:"device_type"`
	IssueDescription string  `json:"issue_description"`
	EstimatedCost    float64 `json:"estimated_cost"`
	Notes            string  `json:"notes"`
}

// CreateBooking creates a new service booking.
func CreateBooking(c *gin.Context) {
	var input BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	booking := models.Booking{
		CustomerID:       input.CustomerID,
		TechnicianID:     input.TechnicianID,
		DeviceName:       input.DeviceName,
		DeviceType:       input.DeviceType,
		IssueDescription: input.IssueDescription,
		EstimatedCost:    input.EstimatedCost,
		Notes:            input.Notes,
	}
	if err := services.CreateBooking(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.PreloadBooking(&booking)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking created successfully",
		"data":    booking,
	})
}

// GetAllBookings retrieves all bookings.
func GetAllBookings(c *gin.Context) {
	bookings, err := services.GetAllBookings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

// GetBookingByID retrieves a single booking by ID.
func GetBookingByID(c *gin.Context) {
	id := c.Param("id")
	booking, err := services.GetBookingByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": booking})
}

// UpdateBooking updates booking data.
func UpdateBooking(c *gin.Context) {
	id := c.Param("id")
	var input BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	update := models.Booking{
		CustomerID:       input.CustomerID,
		TechnicianID:     input.TechnicianID,
		DeviceName:       input.DeviceName,
		DeviceType:       input.DeviceType,
		IssueDescription: input.IssueDescription,
		EstimatedCost:    input.EstimatedCost,
		Notes:            input.Notes,
	}
	booking, err := services.UpdateBooking(id, &update)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully", "data": booking})
}

// UpdateBookingStatus updates the status of a booking.
func UpdateBookingStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	booking, err := services.UpdateBookingStatus(id, input.Status)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking status updated successfully", "data": booking})
}

// DeleteBooking deletes a booking by ID.
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteBooking(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}

// PublicBookingInput is the DTO for customer-initiated bookings.
type PublicBookingInput struct {
	CustomerName     string `json:"customer_name" binding:"required"`
	CustomerEmail    string `json:"customer_email" binding:"required,email"`
	CustomerPhone    string `json:"customer_phone" binding:"required"`
	CustomerAddress  string `json:"customer_address"`
	DeviceName       string `json:"device_name" binding:"required"`
	DeviceType       string `json:"device_type"`
	IssueDescription string `json:"issue_description"`
}

// PublicCreateBooking handles bookings from unauthenticated customers.
func PublicCreateBooking(c *gin.Context) {
	var input PublicBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Find or Create Customer
	var customer models.Customer
	config.DB.Where("email = ?", input.CustomerEmail).First(&customer)

	if customer.ID == 0 {
		customer = models.Customer{
			Name:    input.CustomerName,
			Email:   input.CustomerEmail,
			Phone:   input.CustomerPhone,
			Address: input.CustomerAddress,
		}
		if err := config.DB.Create(&customer).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create customer profile"})
			return
		}
	}

	// 2. Create Booking
	booking := models.Booking{
		CustomerID:       customer.ID,
		DeviceName:       input.DeviceName,
		DeviceType:       input.DeviceType,
		IssueDescription: input.IssueDescription,
		Status:           "pending",
	}

	if err := services.CreateBooking(&booking); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit booking"})
		return
	}

	services.PreloadBooking(&booking)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Service request submitted successfully!",
		"data":    booking,
	})
}

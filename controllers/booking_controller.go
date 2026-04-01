package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/services"
	"booking-service/utils"
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

type CustomerBookingInput struct {
	DeviceName       string `json:"device_name" binding:"required"`
	DeviceType       string `json:"device_type"`
	IssueDescription string `json:"issue_description" binding:"required"`
	Phone            string `json:"phone" binding:"required"`
	Address          string `json:"address"`
}

// CreateBooking creates a new service booking.
func CreateBooking(c *gin.Context) {
	var input BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
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
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create booking")
		return
	}
	services.PreloadBooking(&booking)
	utils.JSONResponse(c, http.StatusCreated, "Booking created successfully", booking)
}

// GetAllBookings retrieves all bookings.
func GetAllBookings(c *gin.Context) {
	bookings, err := services.GetAllBookings()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve data")
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Bookings retrieved", bookings)
}

// GetBookingByID retrieves a single booking by ID.
func GetBookingByID(c *gin.Context) {
	id := c.Param("id")
	booking, err := services.GetBookingByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Booking found", booking)
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
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Booking updated successfully", booking)
}

// UpdateBookingStatus updates the status of a booking.
func UpdateBookingStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status       string `json:"status" binding:"required"`
		TechnicianID *uint  `json:"technician_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	booking, err := services.UpdateBookingStatus(id, input.Status, input.TechnicianID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Booking status updated successfully", booking)
}

// DeleteBooking deletes a booking by ID.
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteBooking(id); err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Booking deleted successfully", nil)
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
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
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
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create customer profile")
			return
		}
	}

	// 2. Create Booking
	booking := models.Booking{
		CustomerID:       customer.ID,
		DeviceName:       input.DeviceName,
		DeviceType:       input.DeviceType,
		IssueDescription: input.IssueDescription,
		Status:           "Pending",
	}

	if err := services.CreateBooking(&booking); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to submit booking")
		return
	}

	services.PreloadBooking(&booking)
	utils.JSONResponse(c, http.StatusCreated, "Service request submitted successfully!", booking)
}

// TrackBooking allows customers to check booking status by tracking ID.
func TrackBooking(c *gin.Context) {
	trackingID := c.Param("tracking_id")
	var booking models.Booking
	if err := config.DB.Preload("Customer").Preload("Technician").Where("tracking_id = ?", trackingID).First(&booking).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Booking not found with the provided Tracking ID")
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Booking found", booking)
}
// GetCustomerBookings allows a logged-in customer to fetch their own bookings.
func GetCustomerBookings(c *gin.Context) {
	// We extract user email from the JWT context (mapped in auth middleware)
	userEmail, exists := c.Get("user_email")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized: No email in context")
		return
	}

	var customer models.Customer
	// Find customer profile using the email from token
	if err := config.DB.Where("email = ?", userEmail).First(&customer).Error; err != nil {
		// If no customer profile exists, it means they haven't booked anything.
		utils.JSONResponse(c, http.StatusOK, "No bookings found yet", []models.Booking{})
		return
	}

	var bookings []models.Booking
	// Find all bookings for this customer ID
	if err := config.DB.Preload("Customer").Preload("Technician").Where("customer_id = ?", customer.ID).Find(&bookings).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve your bookings")
		return
	}

	utils.JSONResponse(c, http.StatusOK, "Your bookings retrieved", bookings)
}

// CreateCustomerBooking handles booking creation from authenticated customers.
func CreateCustomerBooking(c *gin.Context) {
	// 1. Get user identity from JWT context
	userEmail, _ := c.Get("user_email")
	
	var input CustomerBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// 2. Find or Create Customer Profile
	var customer models.Customer
	config.DB.Where("email = ?", userEmail).First(&customer)

	if customer.ID == 0 {
		// Fetch user to get the name safely if profile doesn't exist
		var user models.User
		if err := config.DB.Where("email = ?", userEmail).First(&user).Error; err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User account not found")
			return
		}

		customer = models.Customer{
			Name:    user.Name,
			Email:   user.Email,
			Phone:   input.Phone,
			Address: input.Address,
		}
		if err := config.DB.Create(&customer).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create customer profile")
			return
		}
	} else {
		// Update phone and address if provided/needed
		if input.Phone != "" {
			customer.Phone = input.Phone
		}
		if input.Address != "" {
			customer.Address = input.Address
		}
		config.DB.Save(&customer)
	}

	// 3. Create Booking
	booking := models.Booking{
		CustomerID:       customer.ID,
		DeviceName:       input.DeviceName,
		DeviceType:       input.DeviceType,
		IssueDescription: input.IssueDescription,
		Status:           "Pending",
	}

	if err := services.CreateBooking(&booking); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to submit booking")
		return
	}

	services.PreloadBooking(&booking)
	utils.JSONResponse(c, http.StatusCreated, "Booking created successfully from your account!", booking)
}

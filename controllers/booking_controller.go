package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"booking-service/utils"
	"net/http"
	"strconv"

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
	customer, err := services.FindOrCreateCustomer(input.CustomerName, input.CustomerEmail, input.CustomerPhone, input.CustomerAddress)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create or find customer profile")
		return
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
	booking, err := services.GetBookingByTrackingID(trackingID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
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

	// Find customer profile using the email from token
	customer, err := services.GetCustomerByEmail(userEmail.(string))
	if err != nil || customer == nil {
		// If no customer profile exists, it means they haven't booked anything.
		utils.JSONResponse(c, http.StatusOK, "No bookings found yet", []models.Booking{})
		return
	}

	// Find all bookings for this customer ID
	bookings, err := services.GetBookingsByCustomerID(customer.ID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve your bookings")
		return
	}

	utils.JSONResponse(c, http.StatusOK, "Your bookings retrieved", bookings)
}

// CreateCustomerBooking handles booking creation from authenticated customers.
func CreateCustomerBooking(c *gin.Context) {
	// 1. Get user identity from JWT context
	userEmail, exists := c.Get("user_email")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized: No email in context")
		return
	}
	
	var input CustomerBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// 2. Find or Create Customer Profile
	customer, err := services.GetCustomerByEmail(userEmail.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Database error")
		return
	}

	if customer == nil {
		// Fetch user to get the name safely if profile doesn't exist
		user, err := services.GetUserByEmail(userEmail.(string))
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User account not found")
			return
		}

		newCustomer := models.Customer{
			Name:    user.Name,
			Email:   user.Email,
			Phone:   input.Phone,
			Address: input.Address,
		}
		if err := services.CreateCustomer(&newCustomer); err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create customer profile")
			return
		}
		customer = &newCustomer
	} else {
		// Update phone and address if provided/needed
		updated := false
		if input.Phone != "" && customer.Phone != input.Phone {
			customer.Phone = input.Phone
			updated = true
		}
		if input.Address != "" && customer.Address != input.Address {
			customer.Address = input.Address
			updated = true
		}
		if updated {
			services.UpdateCustomer(strconv.FormatUint(uint64(customer.ID), 10), customer)
		}
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

// GetTechnicianBookings allows a logged-in technician to fetch their assigned bookings.
func GetTechnicianBookings(c *gin.Context) {
	userEmail, exists := c.Get("user_email")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized: No email in context")
		return
	}

	bookings, err := services.GetBookingsByTechnicianEmail(userEmail.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.JSONResponse(c, http.StatusOK, "Assigned bookings retrieved", bookings)
}

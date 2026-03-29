package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AddBookingItemInput struct {
	BookingID   uint `json:"booking_id" binding:"required"`
	SparepartID uint `json:"sparepart_id" binding:"required"`
	Quantity    int  `json:"quantity" binding:"required,min=1"`
}

// AddBookingItem adds a sparepart to a booking and deducts stock.
func AddBookingItem(c *gin.Context) {
	var input AddBookingItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// 1. Validate Booking ID exists
	var booking models.Booking
	if err := config.DB.First(&booking, input.BookingID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Booking not found")
		return
	}

	// 2. Validate Sparepart ID exists and get current price
	var sparepart models.Sparepart
	if err := config.DB.First(&sparepart, input.SparepartID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Sparepart not found")
		return
	}

	// 3. Create BookingItem inside a transaction (the hooks will handle decrement & cost update)
	tx := config.DB.Begin()

	item := models.BookingItem{
		BookingID:   input.BookingID,
		SparepartID: input.SparepartID,
		Quantity:    input.Quantity,
		Price:       sparepart.Price,
	}

	if err := tx.Create(&item).Error; err != nil {
		tx.Rollback()
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to add item: "+err.Error())
		return
	}

	tx.Commit()

	utils.JSONResponse(c, http.StatusCreated, "Sparepart added to booking", item)
}

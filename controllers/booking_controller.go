package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateBooking membuat booking servis baru
func CreateBooking(c *gin.Context) {
	var input models.Booking
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := services.CreateBooking(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Preload relasi sebelum kirim response
	services.PreloadBooking(&input)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking service berhasil dibuat!",
		"data":    input,
	})
}

// GetAllBookings mengambil semua booking
func GetAllBookings(c *gin.Context) {
	bookings, err := services.GetAllBookings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

// GetBookingByID mengambil satu booking berdasarkan ID
func GetBookingByID(c *gin.Context) {
	id := c.Param("id")
	booking, err := services.GetBookingByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": booking})
}

// UpdateBooking memperbarui data booking
func UpdateBooking(c *gin.Context) {
	id := c.Param("id")
	var input models.Booking
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	booking, err := services.UpdateBooking(id, &input)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking berhasil diupdate", "data": booking})
}

// UpdateBookingStatus mengubah hanya status booking
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
	c.JSON(http.StatusOK, gin.H{"message": "Status booking berhasil diupdate", "data": booking})
}

// DeleteBooking menghapus booking berdasarkan ID
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteBooking(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking berhasil dihapus"})
}

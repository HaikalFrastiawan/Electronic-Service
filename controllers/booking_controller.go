package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

//Post
func CreateBooking(c *gin.Context) {
	var input models.Booking

	// 1. Validasi Input JSON (Binding)
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Simpan ke Database
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
		return
	}

	// 3. Respon Berhasil
	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking service berhasil dibuat!",
		"data":    input,
	})
}

// GetAllBookings untuk mengambil semua antrean servis
func GetAllBookings(c *gin.Context) {
	var bookings []models.Booking
	
	// Mengambil semua data dari tabel bookings
	if err := config.DB.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

// GetBookingByID untuk melihat detail satu servis berdasarkan ID
func GetBookingByID(c *gin.Context) {
	id := c.Param("id") // Mengambil ID dari URL
	var booking models.Booking

	if err := config.DB.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data booking tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": booking})
}
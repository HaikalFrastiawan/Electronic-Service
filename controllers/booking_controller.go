package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
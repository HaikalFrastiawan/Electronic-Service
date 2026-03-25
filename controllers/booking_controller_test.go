package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestCreateBookingHandler(t *testing.T) {
	// 1. Setup Mock Database atau gunakan DB Test
	// Untuk belajar, kita pastikan DB terkoneksi dulu
	config.ConnectDatabase()
	config.DB.AutoMigrate(&models.Booking{})

	// 2. Setup Gin Mode Test
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/bookings", CreateBooking)

	// 3. Data Dummy untuk dikirim
	body := models.Booking{
		CustomerName:  "Test User",
		CustomerPhone: "089999",
		DeviceName:    "Radio Lawas",
	}
	jsonValue, _ := json.Marshal(body)

	// 4. Buat Request HTTP
	req, _ := http.NewRequest("POST", "/api/bookings", bytes.NewBuffer(jsonValue))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// 5. Assertion (Pengecekan hasil)
	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetAllBookingsHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/api/bookings", GetAllBookings)

	req, _ := http.NewRequest("GET", "/api/bookings", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetDashboardStats returns high level summary for the admin dashboard.
func GetDashboardStats(c *gin.Context) {
	var totalCustomers int64
	config.DB.Model(&models.Customer{}).Count(&totalCustomers)

	var totalRevenue float64
	// Calculate total revenue based on completed bookings
	config.DB.Model(&models.Booking{}).Where("status = ?", "Completed").Select("coalesce(sum(estimated_cost), 0)").Scan(&totalRevenue)

	type StatusCount struct {
		Status string `json:"status"`
		Count  int64  `json:"count"`
	}
	var statusCounts []StatusCount
	// Get counts grouped by status
	config.DB.Model(&models.Booking{}).Select("status, count(*) as count").Group("status").Scan(&statusCounts)

	utils.JSONResponse(c, http.StatusOK, "Dashboard stats retrieved", gin.H{
		"total_customers": totalCustomers,
		"total_revenue":   totalRevenue,
		"service_status":  statusCounts,
	})
}

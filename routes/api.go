package routes

import (
	"booking-service/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.POST("/bookings", controllers.CreateBooking)
		api.GET("/bookings", controllers.GetAllBookings)
		api.GET("/bookings/:id", controllers.GetBookingByID)
	}

	return r
}
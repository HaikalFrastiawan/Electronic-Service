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
	}

	return r
}
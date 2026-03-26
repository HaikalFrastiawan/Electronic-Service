package routes

import (
	"booking-service/controllers"
	"booking-service/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures the API routes and global middleware.
func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CorsMiddleware())
	r.Use(middleware.LoggerMiddleware())

	api := r.Group("/api")

	// Public Auth Routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}

	// Protected API Routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())
	{
		// Bookings
		bookings := protected.Group("/bookings")
		{
			bookings.POST("", controllers.CreateBooking)
			bookings.GET("", controllers.GetAllBookings)
			bookings.GET("/:id", controllers.GetBookingByID)
			bookings.PUT("/:id", controllers.UpdateBooking)
			bookings.PATCH("/:id/status", controllers.UpdateBookingStatus)
			bookings.DELETE("/:id", controllers.DeleteBooking)
		}

		// Customers
		customers := protected.Group("/customers")
		{
			customers.POST("", controllers.CreateCustomer)
			customers.GET("", controllers.GetAllCustomers)
			customers.GET("/:id", controllers.GetCustomerByID)
			customers.PUT("/:id", controllers.UpdateCustomer)
			customers.DELETE("/:id", controllers.DeleteCustomer)
		}

		// Technicians
		technicians := protected.Group("/technicians")
		{
			technicians.POST("", controllers.CreateTechnician)
			technicians.GET("", controllers.GetAllTechnicians)
			technicians.GET("/:id", controllers.GetTechnicianByID)
			technicians.PUT("/:id", controllers.UpdateTechnician)
			technicians.DELETE("/:id", controllers.DeleteTechnician)
		}
	}

	return r
}

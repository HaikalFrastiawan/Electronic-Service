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
	r.Use(middleware.ErrorHandler()) // Global Error Handler

	v1 := r.Group("/api/v1")
	{
		// Auth Routes (Public)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Public Info Routes
		public := v1.Group("/public")
		{
			public.POST("/bookings", controllers.PublicCreateBooking)
			public.GET("/track/:tracking_id", controllers.TrackBooking)
		}

		// Protected Routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Admin Routes (Protected by AdminOnly)
			admin := protected.Group("/admin")
			admin.Use(middleware.AdminOnly())
			{
				admin.GET("/dashboard-stats", controllers.GetDashboardStats)
				
				// Spareparts (CRUD)
				spareparts := admin.Group("/spareparts")
				{
					spareparts.POST("", controllers.CreateSparepart)
					spareparts.GET("", controllers.GetAllSpareparts)
					spareparts.GET("/:id", controllers.GetSparepartByID)
					spareparts.PUT("/:id", controllers.UpdateSparepart)
					spareparts.DELETE("/:id", controllers.DeleteSparepart)
				}

				// Bookings Management (Admin)
				bookings := admin.Group("/bookings")
				{
					bookings.POST("", controllers.CreateBooking)
					bookings.GET("", controllers.GetAllBookings)
					bookings.GET("/:id", controllers.GetBookingByID)
					bookings.PUT("/:id", controllers.UpdateBooking)
					bookings.PATCH("/:id/status", controllers.UpdateBookingStatus)
					bookings.DELETE("/:id", controllers.DeleteBooking)
					bookings.POST("/:id/items", controllers.AddBookingItem)
				}

				// Customers Management (Admin)
				customers := admin.Group("/customers")
				{
					customers.POST("", controllers.CreateCustomer)
					customers.GET("", controllers.GetAllCustomers)
					customers.GET("/:id", controllers.GetCustomerByID)
					customers.PUT("/:id", controllers.UpdateCustomer)
					customers.DELETE("/:id", controllers.DeleteCustomer)
				}

				// Technicians Management (Admin)
				technicians := admin.Group("/technicians")
				{
					technicians.POST("", controllers.CreateTechnician)
					technicians.GET("", controllers.GetAllTechnicians)
					technicians.GET("/:id", controllers.GetTechnicianByID)
					technicians.PUT("/:id", controllers.UpdateTechnician)
					technicians.DELETE("/:id", controllers.DeleteTechnician)
				}
			}

			// Customer Routes (Protected by JWT)
			customer := protected.Group("/customer")
			{
				customer.GET("/bookings", controllers.GetCustomerBookings)
				customer.POST("/bookings", controllers.CreateCustomerBooking)
			}
		}
	}

	return r
}

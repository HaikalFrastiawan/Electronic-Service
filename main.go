package main

import (
	"booking-service/models"
	"booking-service/config"
	"booking-service/routes"
)

func main() {
	
	config.ConnectDatabase()
	config.DB.AutoMigrate(&models.Booking{})

	r := routes.SetupRouter()
	r.Run(":8080")
}